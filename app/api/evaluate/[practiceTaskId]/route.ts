import { NextRequest } from 'next/server';
import { ResultType } from '@/app/types/sql-practice';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Reference solutions map
const referenceSolutions: Record<string, { preparationQuery: string, selectQuery: string }> = {
  '1': {
    preparationQuery: 'CREATE INDEX IF NOT EXISTS idx_actor_first_name ON actor (first_name);',
    selectQuery: 'SELECT count(1) FROM actor WHERE first_name LIKE \'MARILYN\';'
  },
  '2': {
    preparationQuery: '',
    selectQuery: 'SELECT * FROM bookings.flights limit 100;'
  },
  '3': {
    preparationQuery: 'CREATE INDEX IF NOT EXISTS idx_actor_first_name ON actor (first_name);',
    selectQuery: 'SELECT count(1) FROM actor WHERE first_name LIKE \'MARILYN\';'
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
    const queryPlan = explainResult.rows[0]['QUERY PLAN'];
    return queryPlan[0]['Execution Time'];
  } catch (error) {
    console.error('Error extracting execution time:', error);
    return 0;
  }
}

// Helper function to add a small delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Interface for the request body
interface EvaluateRequestBody {
  preparationQuery: string;
  selectQuery: string;
}

export async function POST(
  request: NextRequest,
  { params }: { params: { practiceTaskId: string } }
) {
  try {
    const { practiceTaskId } = await params;

    if (!referenceSolutions[practiceTaskId]) {
      return new Response(JSON.stringify({ error: `Practice task with ID ${practiceTaskId} not found` }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    try {
      const usersSolution: EvaluateRequestBody = await request.json();
      let { preparationQuery, selectQuery } = usersSolution;

      console.log(`Evaluating task ${practiceTaskId} with:`, { preparationQuery, selectQuery });

      const referenceSolution = referenceSolutions[practiceTaskId];

      const result: ResultType = {
        correct: false,
        performant: false,
        usersTime: undefined,
        referenceTime: undefined,
        usersSet: undefined,
        referenceSet: undefined,
        usersPlan: undefined,
      };

      // Get a client from the pool
      const client = await pool.connect();

      try {
        // First transaction: Run reference solution
        await client.query('BEGIN');

        if (referenceSolution.preparationQuery && referenceSolution.preparationQuery.trim() !== '') {
          await client.query(referenceSolution.preparationQuery);
        }

        const referenceQueryResult = await client.query(referenceSolution.selectQuery);
        result.referenceSet = referenceQueryResult.rows;

        // Run explain analyze on reference select query
        const explainReferenceQuery = `EXPLAIN (ANALYZE, FORMAT JSON) ${referenceSolution.selectQuery}`;
        const referenceExplain = await client.query(explainReferenceQuery);
        result.referenceTime = getExecutionTime(referenceExplain);

        await client.query('ROLLBACK');

        // Second transaction: Run user solution
        await client.query('BEGIN');

        // Run user preparation query if it exists
        if (preparationQuery && preparationQuery.trim() !== '') {
          await client.query(preparationQuery);
        }

        // Run user select query
        const usersQueryResult = await client.query(selectQuery);
        result.usersSet = usersQueryResult.rows;

        // Run explain analyze on user select query
        const explainUserQuery = `EXPLAIN (ANALYZE, FORMAT JSON) ${selectQuery}`;
        const userExplain = await client.query(explainUserQuery);
        result.usersTime = getExecutionTime(userExplain);
        // Store the full plan for visualization
        result.usersPlan = userExplain.rows[0]['QUERY PLAN'][0];

        await client.query('ROLLBACK');

        // Compare results using sets
        const referenceSet = resultToSet(referenceQueryResult);
        const userSet = resultToSet(usersQueryResult);
        result.correct = referenceSet.size === userSet.size &&
          [...referenceSet].every(item => userSet.has(item));

        // Check performance (user's time should be less than 1.5x reference time)
        if (result.correct && result.usersTime !== undefined && result.referenceTime !== undefined) {
          result.performant = result.usersTime < result.referenceTime;
        }

        return new Response(JSON.stringify(result), {
          headers: { 'Content-Type': 'application/json' }
        });
      } catch (dbError) {
        // Rollback transaction on error
        await client.query('ROLLBACK');
        console.error('Database error:', dbError);
        return new Response(JSON.stringify({ error: dbError instanceof Error ? dbError.message : String(dbError) }), {
          headers: { 'Content-Type': 'application/json' }
        });
      } finally {
        // Release client back to pool
        client.release();
      }
    } catch (parseError) {
      console.error('Error parsing request body:', parseError);
      return new Response(JSON.stringify({ error: 'Invalid request body. Please check your query syntax.' }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
  } catch (error) {
    console.error('Error evaluating SQL query:', error);
    return new Response(JSON.stringify({ error: 'Failed to evaluate SQL query' }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 