import { NextRequest, NextResponse } from "next/server";
import { Pool, QueryResult } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const referenceSolutions: Record<
  string,
  { preparationQuery: string; selectQuery: string }
> = {
  "3": {
    preparationQuery: "",
    selectQuery:
      "SELECT de.employee_id, d.dept_name FROM department_employee de join department d on de.department_id = d.id where d.dept_name = 'Development' limit 5;",
  },
  "5": {
    preparationQuery: "CREATE INDEX idx_dept_emp_from_date ON department_employee (from_date);",
    selectQuery: "SELECT d.dept_name, de.employee_id, de.from_date, de.first_name, de.last_name FROM department d LEFT JOIN LATERAL (SELECT employee_id, from_date, first_name, last_name FROM department_employee JOIN employee e ON department_employee.employee_id = e.id WHERE department_id = d.id ORDER BY from_date LIMIT 1) de ON TRUE;",
  },
  "7": {
    preparationQuery: "CREATE INDEX idx_salary_amount_fromdate_todate ON salary (amount, from_date, to_date);",
    selectQuery: "SELECT COUNT(1) AS employee_count FROM salary WHERE from_date <= '1990-01-01' AND to_date >= '1990-01-01' AND amount > 120000;",
  }
};

function resultToSet(queryResult: QueryResult): Set<string> {
  return new Set(queryResult.rows.map((row) => JSON.stringify(row)));
}

function getExecutionTime(explainResult: QueryResult): number {
  try {
    // The result comes as { rows: [{ 'QUERY PLAN': [Array] }] }
    const queryPlan = explainResult.rows[0]["QUERY PLAN"];
    return queryPlan[0]["Execution Time"];
  } catch (error) {
    console.error("Error extracting execution time:", error);
    return 0;
  }
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Interface for the request body
interface EvaluateRequestBody {
  preparationQuery: string;
  selectQuery: string;
}

export type EvaluationResponseType = {
  error?: string;
  correct?: boolean;
  performant?: boolean;
  usersTime?: number;
  referenceTime?: number;
  usersRows?: Record<string, any>[];
  referenceRows?: Record<string, any>[];
  usersPlan?: string;
  usersExplain?: string;
};

export async function POST(
  request: NextRequest,
  { params }: { params: { practiceTaskId: string } },
) {
  const responseStream = new TransformStream();
  const writer = responseStream.writable.getWriter();
  const encoder = new TextEncoder();

  evaluateWithUpdates(request, { params }, writer, encoder);

  return new NextResponse(responseStream.readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}

async function evaluateWithUpdates(
  request: NextRequest,
  { params }: { params: { practiceTaskId: string } },
  writer: WritableStreamDefaultWriter,
  encoder: TextEncoder,
) {
  try {
    const { practiceTaskId } = await params;

    if (!referenceSolutions[practiceTaskId]) {
      await writer.write(
        encoder.encode(
          `data: ${JSON.stringify({
            type: "error",
            message: `Practice task with ID ${practiceTaskId} not found`,
          })}\n\n`,
        ),
      );
      await writer.close();
      return;
    }

    try {
      const usersSolution: EvaluateRequestBody = await request.json();
      const { preparationQuery, selectQuery } = usersSolution;

      console.log(`Evaluating task ${practiceTaskId} with:`, {
        preparationQuery,
        selectQuery,
      });

      const referenceSolution = referenceSolutions[practiceTaskId];

      const result: EvaluationResponseType = {
        correct: false,
        performant: false,
        usersTime: undefined,
        referenceTime: undefined,
        usersRows: undefined,
        referenceRows: undefined,
        usersPlan: undefined,
        usersExplain: undefined,
      };

      const client = await pool.connect();

      try {
        // Step 1: Running reference preparation queries
        await writer.write(
          encoder.encode(
            `data: ${JSON.stringify({
              type: "progress",
              step: "runningReferencePreparation",
              progress: 0,
              message: "Running reference preparation queries...",
            })}\n\n`,
          ),
        );
        await delay(500);

        await client.query("BEGIN");
        if (
          referenceSolution.preparationQuery &&
          referenceSolution.preparationQuery.trim() !== ""
        ) {
          await client.query(referenceSolution.preparationQuery);
        }

        // Step 2: Running reference select queries
        await writer.write(
          encoder.encode(
            `data: ${JSON.stringify({
              type: "progress",
              step: "runningReferenceSelect",
              progress: 15,
              message: "Running reference select queries...",
            })}\n\n`,
          ),
        );
        await delay(500);

        const referenceQueryResult = await client.query(
          referenceSolution.selectQuery,
        );
        result.referenceRows = referenceQueryResult.rows;

        // Run explain analyze on reference select query
        const explainReferenceQuery = `EXPLAIN (ANALYZE, FORMAT JSON) ${referenceSolution.selectQuery}`;
        const referenceExplain = await client.query(explainReferenceQuery);
        result.referenceTime = getExecutionTime(referenceExplain);

        // Step 3: Restoring the database
        await writer.write(
          encoder.encode(
            `data: ${JSON.stringify({
              type: "progress",
              step: "restoringDatabase1",
              progress: 30,
              message: "Restoring database state...",
            })}\n\n`,
          ),
        );
        await delay(500);

        await client.query("ROLLBACK");

        // Step 4: Running user's preparation queries
        await writer.write(
          encoder.encode(
            `data: ${JSON.stringify({
              type: "progress",
              step: "runningUserPreparation",
              progress: 45,
              message: "Running your preparation queries...",
            })}\n\n`,
          ),
        );
        await delay(500);

        // Second transaction: Run user solution
        await client.query("BEGIN");

        // Run user preparation query if it exists
        if (preparationQuery && preparationQuery.trim() !== "") {
          await client.query(preparationQuery);
        }

        // Step 5: Running user's select queries
        await writer.write(
          encoder.encode(
            `data: ${JSON.stringify({
              type: "progress",
              step: "runningUserSelect",
              progress: 60,
              message: "Running your select queries...",
            })}\n\n`,
          ),
        );
        await delay(500);

        const usersQueryResult = await client.query(selectQuery);
        result.usersRows = usersQueryResult.rows;

        // Run explain analyze on user select query
        const explainUserQuery = `EXPLAIN (ANALYZE, FORMAT JSON) ${selectQuery}`;
        const userExplain = await client.query(explainUserQuery);
        result.usersTime = getExecutionTime(userExplain);
        // Store the full plan for visualization
        result.usersPlan = userExplain.rows[0]["QUERY PLAN"];
        
        // Run explain with TEXT format for better readability
        const explainTextQuery = `EXPLAIN (FORMAT TEXT) ${selectQuery}`;
        const userExplainText = await client.query(explainTextQuery);
        // Combine all rows of the QUERY PLAN into a single string
        result.usersExplain = userExplainText.rows.map(row => row["QUERY PLAN"]).join('\n');

        // Step 6: Restoring the database
        await writer.write(
          encoder.encode(
            `data: ${JSON.stringify({
              type: "progress",
              step: "restoringDatabase2",
              progress: 75,
              message: "Restoring database state...",
            })}\n\n`,
          ),
        );
        await delay(500);

        await client.query("ROLLBACK");

        // Step 7: Evaluating the solution (90%)
        await writer.write(
          encoder.encode(
            `data: ${JSON.stringify({
              type: "progress",
              step: "evaluatingSolution",
              progress: 90,
              message: "Evaluating your solution...",
            })}\n\n`,
          ),
        );
        await delay(500);

        // Compare results using sets
        const referenceSet = resultToSet(referenceQueryResult);
        const userSet = resultToSet(usersQueryResult);
        result.correct =
          referenceSet.size === userSet.size &&
          [...referenceSet].every((item) => userSet.has(item));

        // Check performance (user's time should be less than 1.5x reference time)
        if (
          result.correct &&
          result.usersTime !== undefined &&
          result.referenceTime !== undefined
        ) {
          result.performant = result.usersTime < result.referenceTime * 1.5;
        }

        // Send final result
        await writer.write(
          encoder.encode(
            `data: ${JSON.stringify({
              type: "completed",
              progress: 100,
              result,
            })}\n\n`,
          ),
        );
      } catch (dbError) {
        await client.query("ROLLBACK");
        console.error("Database error:", dbError);
        await writer.write(
          encoder.encode(
            `data: ${JSON.stringify({
              type: "error",
              message:
                dbError instanceof Error ? dbError.message : String(dbError),
            })}\n\n`,
          ),
        );
      } finally {
        client.release();
      }
    } catch (parseError) {
      console.error("Error parsing request body:", parseError);
      await writer.write(
        encoder.encode(
          `data: ${JSON.stringify({
            type: "error",
            message: "Invalid request body. Please check your query syntax.",
          })}\n\n`,
        ),
      );
    }
  } catch (error) {
    console.error("Error evaluating SQL query:", error);
    await writer.write(
      encoder.encode(
        `data: ${JSON.stringify({
          type: "error",
          message: "Failed to evaluate SQL query",
        })}\n\n`,
      ),
    );
  } finally {
    await writer.close();
  }
}
