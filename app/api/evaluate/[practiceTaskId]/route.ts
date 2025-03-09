import { NextRequest, NextResponse } from "next/server";
import { ResultType } from "@/app/types/sql-practice";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Reference solutions map
const referenceSolutions: Record<
  string,
  { preparationQuery: string; selectQuery: string }
> = {
  "1": {
    preparationQuery:
      "CREATE INDEX IF NOT EXISTS idx_actor_first_name ON actor (first_name);",
    selectQuery: "SELECT count(1) FROM actor WHERE first_name LIKE 'MARILYN';",
  },
  "2": {
    preparationQuery: "",
    selectQuery: "SELECT * FROM department;",
  },
  "3": {
    preparationQuery:
      "CREATE INDEX IF NOT EXISTS idx_actor_first_name ON actor (first_name);",
    selectQuery: "SELECT count(1) FROM actor WHERE first_name LIKE 'MARILYN';",
  },
};

// Helper function to convert query results to comparable sets
function resultToSet(queryResult: any): Set<string> {
  return new Set(queryResult.rows.map((row: any) => JSON.stringify(row)));
}

// Helper function to extract execution time from EXPLAIN ANALYZE JSON output
function getExecutionTime(explainResult: any): number {
  try {
    // The result comes as { rows: [{ 'QUERY PLAN': [Array] }] }
    const queryPlan = explainResult.rows[0]["QUERY PLAN"];
    return queryPlan[0]["Execution Time"];
  } catch (error) {
    console.error("Error extracting execution time:", error);
    return 0;
  }
}

// Helper function to add a small delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Interface for the request body
interface EvaluateRequestBody {
  preparationQuery: string;
  selectQuery: string;
}

export async function POST(
  request: NextRequest,
  { params }: { params: { practiceTaskId: string } },
) {
  const responseStream = new TransformStream();
  const writer = responseStream.writable.getWriter();
  const encoder = new TextEncoder();

  // Start the processing in the background
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

      const result: ResultType = {
        correct: false,
        performant: false,
        usersTime: undefined,
        referenceTime: undefined,
        usersRows: undefined,
        referenceRows: undefined,
        usersPlan: undefined,
      };

      // Get a client from the pool
      const client = await pool.connect();

      try {
        // Step 1: Running reference preparation queries (0%)
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

        // Step 2: Running reference select queries (15%)
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

        // Step 3: Restoring the database (30%)
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

        // Step 4: Running user's preparation queries (45%)
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

        // Step 5: Running user's select queries (60%)
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

        // Run user select query
        const usersQueryResult = await client.query(selectQuery);
        result.usersRows = usersQueryResult.rows;

        // Run explain analyze on user select query
        const explainUserQuery = `EXPLAIN (ANALYZE, FORMAT JSON) ${selectQuery}`;
        const userExplain = await client.query(explainUserQuery);
        result.usersTime = getExecutionTime(userExplain);
        // Store the full plan for visualization
        result.usersPlan = userExplain.rows[0]["QUERY PLAN"];

        // Step 6: Restoring the database (75%)
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
          result.performant = result.usersTime < result.referenceTime;
        }

        // Send final result (100%)
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
        // Rollback transaction on error
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
        // Release client back to pool
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
