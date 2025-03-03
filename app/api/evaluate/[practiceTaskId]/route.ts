import { NextRequest, NextResponse } from 'next/server';
import { EvaluateRequestBody, ResultType } from '@/app/types/sql-practice';
import { pool } from '@/lib/db';

// Helper function to simulate a delay
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Reference solutions map
const referenceSolutions: Record<string, { preparationQuery: string, selectQuery: string }> = {
  '1': {
    preparationQuery: 'CREATE INDEX IF NOT EXISTS idx_actor_first_name ON actor (first_name);',
    selectQuery: 'SELECT count(1) FROM actor WHERE first_name LIKE \'MARILYN\';'
  },
  '2': {
    preparationQuery: '',
    selectQuery: 'SELECT count(*) FROM film WHERE rental_rate > 2.0;'
  },
  '3': {
    preparationQuery: 'CREATE INDEX IF NOT EXISTS idx_customer_last_name ON customer (last_name);',
    selectQuery: 'SELECT * FROM customer WHERE last_name = \'SMITH\';'
  }
};

export async function POST(
  request: NextRequest,
  { params }: { params: { practiceTaskId: string } }
) {
  try {
    const practiceTaskId = params.practiceTaskId;
    
    // Check if the practice task exists in reference solutions
    if (!referenceSolutions[practiceTaskId]) {
      return NextResponse.json(
        { error: `Practice task with ID ${practiceTaskId} not found` },
        { status: 404 }
      );
    }
    
    // Parse the request body
    const body: EvaluateRequestBody = await request.json();
    const { preparationQuery, selectQuery } = body;

    console.log(`Evaluating task ${practiceTaskId} with:`, { preparationQuery, selectQuery });

    // Simulate processing delay (3 seconds)
    await sleep(3000);

    // Get the reference solution
    const referenceSolution = referenceSolutions[practiceTaskId];
    
    // Store all query results for debugging
    const queryResults: any = {
      referencePreparation: null,
      referenceSelect: null,
      referenceExplain: null,
      userPreparation: null,
      userSelect: null,
      userExplain: null
    };

    // Get a client from the pool
    const client = await pool.connect();
    
    try {
      // First transaction: Run reference solution
      await client.query('BEGIN');
      
      // Run preparation query if it exists
      if (referenceSolution.preparationQuery && referenceSolution.preparationQuery.trim() !== '') {
        queryResults.referencePreparation = await client.query(referenceSolution.preparationQuery);
      }
      
      // Run reference select query
      queryResults.referenceSelect = await client.query(referenceSolution.selectQuery);
      
      // Run explain analyze on reference select query
      const explainReferenceQuery = `EXPLAIN (ANALYZE, FORMAT JSON) ${referenceSolution.selectQuery}`;
      queryResults.referenceExplain = await client.query(explainReferenceQuery);
      
      // Rollback the transaction
      await client.query('ROLLBACK');
      
      // Second transaction: Run user solution
      await client.query('BEGIN');
      
      // Run user preparation query if it exists
      if (preparationQuery && preparationQuery.trim() !== '') {
        queryResults.userPreparation = await client.query(preparationQuery);
      }
      
      // Run user select query
      queryResults.userSelect = await client.query(selectQuery);
      
      // Run explain analyze on user select query
      const explainUserQuery = `EXPLAIN (ANALYZE, FORMAT JSON) ${selectQuery}`;
      queryResults.userExplain = await client.query(explainUserQuery);
      
      // Rollback the transaction
      await client.query('ROLLBACK');
      
    } catch (dbError) {
      // Rollback transaction on error
      await client.query('ROLLBACK');
      console.error('Database error:', dbError);
      
      // Store the error in queryResults
      queryResults.error = dbError instanceof Error ? dbError.message : String(dbError);
    } finally {
      // Release client back to pool
      client.release();
    }

    // For now, we'll just mock the results but include the query results for debugging
    let result: ResultType = {
      correct: true,
      performant: true,
      usersTime: 40,
      referenceTime: 50,
      usersSet: [{ id: 2, name: "Jane Smith", salary: 85000 }],
      referenceSet: [{ id: 2, name: "Jane Smith", salary: 85000 }],
      usersPlan: JSON.stringify(queryResults, null, 2)
    };

    // Return the result
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error evaluating SQL query:', error);
    return NextResponse.json(
      { error: 'Failed to evaluate SQL query' },
      { status: 500 }
    );
  }
} 