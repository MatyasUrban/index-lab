export interface PathItem {
  id: number;
  title: string;
  description: string;
}

export interface Question {
  question: string;
  correct: string;
  incorrect: string[];
}

export interface LearnItem extends PathItem {
  type: "learn";
  questions: Question[];
}

export interface PracticeItem extends PathItem {
  type: "practice";
  hints: string[];
}

export type LearningItem = LearnItem | PracticeItem;

export const learningPath: LearningItem[] = [
  {
    type: "learn",
    id: 1,
    title: "Introduction to PostgreSQL Index Lab",
    description:
      "Understand how the learning path is structured and how to work with the platform",
    questions: [
      {
        question:
          "What are the two main criteria used to evaluate your solutions in the practice components?",
        correct: "Correctness and Performance",
        incorrect: [
          "Correctness and Readability",
          "Performance and Code Style",
          "Readability and Code Style",
        ],
      },
      {
        question:
          'What is the purpose of the "Preparation Query" in a practice component?',
        correct:
          "It's an optional query to set up the database, typically for creating indexes.",
        incorrect: [
          "It's the main query that is evaluated for correctness and performance.",
          "It's used to display instructions to the user.",
          "It's used to automatically grade the user's submission.",
        ],
      },
      {
        question: "What happens to the DB state after a task execution?",
        correct: "DB is rolled back to the state before the task execution.",
        incorrect: [
          "the DB is shut down.",
          "the changes are saved.",
          "none of above.",
        ],
      },
    ],
  },
  {
    type: "learn",
    id: 2,
    title: "Understanding Indexes: The Navigators of Your Data",
    description:
      "Understand why and under which circumstances indexes help you get your data faster",
    questions: [
      {
        question:
          "What is a key characteristic of indexes in terms of data storage?",
        correct:
          "They store redundant data that is already present in or derivable from tables.",
        incorrect: [
          "They store completely new data that isn't found in tables.",
          "They are a compressed representation of the entire table.",
          "They replace the original table data to save space.",
        ],
      },
      {
        question: "How does PostgreSQL store table data?",
        correct:
          "In 8 kilobyte blocks called heap blocks, with tuples representing rows.",
        incorrect: [
          "In alphabetically sorted files.",
          "In a single, large, continuous file.",
          "In a hierarchical tree structure.",
        ],
      },
      {
        question:
          'What does "high selectivity" mean in the context of database queries?',
        correct:
          "The query needs to access only a small percentage of the table's rows.",
        incorrect: [
          "The query needs to access a large percentage of the table's rows.",
          "The query is very complex and involves many joins.",
          "The query is poorly written and inefficient.",
        ],
      },
      {
        question: "What does selectivity mean?",
        correct:
          "Proportion of rows that is needed to compute the result versus all the available rows",
        incorrect: [
          "Number of relevant rows",
          "Number of rows in a table",
          "None of the above",
        ],
      },
    ],
  },
  {
    type: "practice",
    id: 3,
    title: "Challenge 1: Query Employee Identifiers",
    description: "Apply what you learned about selectivity",
    hints: [
      "The information you need is spread across several tables – `employee`, `department`, and `department_employee` – and you'll need to think carefully about how these tables relate to one another to retrieve the necessary data.",
      "To combine information from multiple tables, you'll need to use `JOIN` operations, remembering that joins are performed based on common columns between tables (for instance, you might consider joining `employee` and `department_employee` using a condition like `employee.id = department_employee.employee_id`, and you should explore similar relationships between the other tables).",
      "Carefully consider which tables are absolutely essential to fulfill the requirements; ask yourself if you really need all three tables, or if it's possible to achieve the desired result with fewer.",
      "The acceptance criteria are very specific about the columns required in the output, so review them carefully and avoid selecting more columns than necessary.",
      "The task challenges you to return at least five rows, and remember that 'at least five rows' includes the possibility of exactly five rows; given what you've learned about achieving high selectivity, you might consider aiming for precisely five rows, and PostgreSQL's `LIMIT` clause is a tool designed specifically for controlling the number of rows returned.",
    ],
  },
  {
    type: "learn",
    id: 4,
    title: "B-tree Indexes",
    description:
      "Learn how to create and use B-tree indexes, PostgreSQL's default and most versatile index type",
    questions: [
      {
        question:
          "Which index type is created by default when you define a PRIMARY KEY constraint?",
        correct: "B-tree",
        incorrect: ["Hash", "GiST", "GIN"],
      },
      {
        question:
          "In a B-tree index, what do the leaf nodes typically contain?",
        correct:
          "Indexed data and tuple identifiers (TIDs) pointing to the row's location in the heap.",
        incorrect: [
          "Only the indexed data, without any reference to the heap.",
          "Pointers to other internal nodes in the B-tree.",
          "The entire table row data.",
        ],
      },
      {
        question: "Why is the B-tree index the default choice in PostgreSQL?",
        correct:
          "It efficiently supports a wide variety of operations, including equality, range queries, and sorting.",
        incorrect: [
          "It consumes the least amount of storage space.",
          "It's the only index type that supports unique constraints.",
          "It always performs better than other index types, regardless of the query.",
        ],
      },
      {
        question: "Are indexes automatically created for foreign keys?",
        correct: "No, indexes are not created automatically.",
        incorrect: [
          "Yes they are.",
          "Sometimes.",
          "Depends on the size of the table",
        ],
      },
    ],
  },
  {
    type: "practice",
    id: 5,
    title: "Challenge 2: Query Millennial Joiners by Department",
    description: "Apply what you learned about basic indexing",
    hints: [
      "Which tables record an employee’s basic info and their department history?",
      "How would you link an employee to the department they were in on their hire date?",
      "What extra JOIN condition ensures you match `hire_date` to `from_date`?",
      "How do you filter for dates exactly on ’1999-12-31’ or ’2000-01-01’? Lookup BETWEEN x AND y syntax.",
      "Why might an index on `employee.hire_date` speed up that date-range filter?",
    ],
  },
  {
    type: "learn",
    id: 6,
    title: "Compound Indexes for Multi-Column Lookup",
    description:
      "Learn how to create and effectively use compound indexes to optimize queries involving multiple columns, understanding their benefits and limitations.",
    questions: [
      {
        question:
          "Which of the following queries would benefit the most from a compound index on `(last_name, first_name)`?",
        correct:
          "SELECT * FROM users WHERE last_name = 'Smith' AND first_name = 'John';",
        incorrect: [
          "SELECT * FROM users WHERE first_name = 'Jones';",
          "SELECT * FROM users WHERE last_name = 'Anderson';",
          "SELECT * FROM users WHERE age > 30;",
        ],
      },
      {
        question:
          "If you have a compound index on `(year, month, day)`, which filter condition is least likely to utilize the index efficiently?",
        correct: "WHERE day = 15",
        incorrect: [
          "WHERE year = 2023",
          "WHERE year = 2023 AND month = 10",
          "WHERE year = 2023 AND month = 10 AND day = 15",
        ],
      },
      {
        question:
          "What is a potential disadvantage of using multiple single-column indexes instead of a single compound index for a multi-column query?",
        correct:
          "It can lead to less efficient bitmap index scans and combining results from multiple indexes.",
        incorrect: [
          "Single-column indexes are always faster.",
          "Single-column indexes always use less storage space.",
          "PostgreSQL cannot use multiple single-column indexes simultaneously.",
        ],
      },
      {
        question: "What is a Bitmap Heap Scan?",
        correct:
          "A scan that uses a bitmap generated from index scans to identify the relevant heap blocks to read.",
        incorrect: [
          "A scan that always reads the entire table heap.",
          "A scan that only uses a single index.",
          "A scan that avoids reading the heap entirely (like an index-only scan).",
        ],
      },
      {
        question: "Why is the order of columns in a compound index important?",
        correct:
          "It affects which queries can efficiently use the index and the overall index traversal efficiency.",
        incorrect: [
          "The order has no impact on query performance.",
          "The order only affects the size of the index.",
          "The order only matters for index-only scans.",
        ],
      },
    ],
  },
  {
    type: "practice",
    id: 7,
    title: "Challenge 3: Query Amount of High Earners",
    description: "Apply what you learned about compound indexing",
    hints: [
      "Start by considering the salary table. This table contains the information necessary to answer the question.",
      "Think about how the from_date and to_date columns in the salary table define the period during which a salary is active",
      "Generally, the columns you use in your WHERE clause's filtering conditions are good candidates for inclusion in an index.",
      "Columns used for precise equalities or the first part of range comparisons, offer more initial restrictiveness and should be positioned accordingly in the index. Consider also the logical organization of the data.",
      "Consider the likely distribution of salaries within the company. On January 1st, 1990, many employees were likely working at the company. However, only a small fraction of them would have been earning a salary greater than 120000. How might this difference in selectivity influence the optimal order of columns in a compound index?",
      "Feel free to run the task several times, experimenting with index column orders. Use the analysis to compare performance. The fastest execution plan will provide insights, remember that the database might use the index in unexpected ways.",
    ],
  },
  {
    type: "learn",
    id: 8,
    title: "Covering Indexes and Index-Only Scans",
    description:
      "Learn how to create indexes that contain all the data needed for a query, eliminating the need to access the table itself.",
    questions: [
      {
        question: "What is a covering index?",
        correct:
          "An index that includes all columns needed for a query, enabling index-only scans.",
        incorrect: [
          "An index that covers the entire table, regardless of the query.",
          "An index that is automatically created by PostgreSQL.",
          "An index used only for full table scans.",
        ],
      },
      {
        question: "What is the primary benefit of an index-only scan?",
        correct:
          "It avoids reading data from the table's heap blocks, significantly reducing I/O.",
        incorrect: [
          "It automatically optimizes all queries.",
          "It always uses less memory than a regular index scan.",
          "It is only beneficial for small tables.",
        ],
      },
      {
        question:
          "How can you create a covering index for a query on multiple columns?",
        correct: "Create a compound index including all the queried columns.",
        incorrect: [
          "Create separate indexes on each column.",
          "It's impossible, you need to filter only by 1 column",
          "PostgreSQL creates covering indexes automagically.",
        ],
      },
      {
        question:
          "What is the purpose of the `INCLUDE` clause in PostgreSQL index creation?",
        correct:
          "To add columns to the index that are not part of the index's search key, but are useful for index-only scans.",
        incorrect: [
          "To exclude specific columns from the index.",
          "To make the index unique.",
          "To specify the sort order of the index.",
        ],
      },
    ],
  },
  {
    type: "practice",
    id: 9,
    title: "Challenge 4: Query Recent Technique Leaders",
    description: "Apply what you learned about achieving index only scans",
    hints: [
      "Identify the tables that contain the necessary information (employee details and title history). You will need to join these tables.",
      "Examine the primary keys of the employee and title tables. Are these primary keys sufficient to efficiently satisfy all the requirements of the task, including filtering, sorting, and retrieving all the necessary columns?",
      "Consider which table you'll likely use to first filter down to the relevant 'Technique Leader' records.  Which columns are involved in that filtering? Could an index on that table be helpful? What minimal information you need from this table?",
      "After identifying the relevant 'Technique Leaders', how will you efficiently retrieve the additional employee information (first_name, last_name, gender, birth_date) and sort the results?  Think about an index on the employee table.",
      "Could covering indexes, using the INCLUDE clause, be used to avoid accessing the table data pages after the initial filtering?  Which columns would you need to include for each table?",
      "Remember that you can create multiple indexes (separated by semicolons in your solution) to optimize different parts of the query. Don't be afraid to create an index on more than one table. Focus on making the query highly selective first, and then efficiently retrieving the remaining data. Consider index that could help sorting on employee table.",
      "The order of columns in a composite index is crucial. Consider the ORDER BY clause in the task description.",
      "After writing your query and creating any indexes, use analysis output to analyze the query execution plan. Aim for index-only scans on both the employee and title tables. This will require some iterations.",
    ],
  },
  {
    type: "learn",
    id: 10,
    title: "Functional Indexes and Ordering",
    description:
      "Learn how to create indexes that match your query's specific needs, including custom sort orders and functional transformations.",
    questions: [
      {
        question:
          "What is the primary limitation of a basic index created on a column without specifying sort order?",
        correct:
          "It may not be usable for queries with different sort orders or transformations on the indexed column.",
        incorrect: [
          "It will always be slower than a full table scan.",
          "It can only be used for equality comparisons.",
          "It cannot be used with WHERE clauses.",
        ],
      },
      {
        question:
          "In a compound index defined with `(column1 ASC, column2 ASC)`, can it efficiently satisfy a query ordering by `column1 ASC, column2 DESC`?",
        correct:
          "No, the index's sort order does not match the query's sort order.",
        incorrect: [
          "Yes, the order of columns in the index definition doesn't matter.",
          "Yes, PostgreSQL will automatically reverse the index scan.",
          "It depends on the data distribution in the table.",
        ],
      },
      {
        question: "What is a functional index?",
        correct:
          "An index that stores the result of a function applied to one or more columns, rather than the raw column values.",
        incorrect: [
          "An index that automatically updates itself whenever the underlying table changes.",
          "An index that uses a special algorithm to improve performance for all types of queries.",
          "An index that can only be created on functions, not on columns.",
        ],
      },
      {
        question:
          "Which of the following is a good use case for a functional index?",
        correct: "Performing case-insensitive searches on a text column.",
        incorrect: [
          "Indexing a column that is rarely used in queries.",
          "Improving the performance of queries that always return a large percentage of the table.",
          "Replacing a regular index on a numeric column to save space.",
        ],
      },
      {
        question:
          "Can an index on lower(name) be used to improve the below query? SELECT * FROM users WHERE name = 'John Doe';",
        correct:
          "No, Because query is not using the same function (lower) that was used in the index.",
        incorrect: [
          "Yes, functional indexes improve all queries on the base column.",
          "Yes, PostgreSQL automatically handles case-insensitive comparisons.",
          "It depends on if John Doe record exists or not",
        ],
      },
    ],
  },
  {
    type: "practice",
    id: 11,
    title: "Challenge 5: Query Short Tenures",
    description: "Apply what you learned about functional indexes",
    hints: [
      "Which tables contain the information needed to determine the length of an employee's assignment in a specific department? Think about how you would *calculate* that length.",
      "Consider how an index could speed up queries that filter based on a calculated value.  What if you could pre-calculate and store that value in the index itself? This is the core idea behind a *functional index*.",
      "In PostgreSQL, subtracting two `DATE` values results in an `INTEGER` representing the number of days between them. How does this fact relate to the task of finding assignments that lasted 7 days or less? How might this influence the design of a functional index?",
      "To generate the statistics, consider joining the necessary tables, grouping by the department name (which must also appear in the SELECT list), using COUNT(*) to count assignments within each group, aliasing the count with AS, and then ordering the results ORDER BY that aliased count in descending order, all while leveraging a functional index for efficiency.",
    ],
  },
  {
    type: "practice",
    id: 12,
    title: "Challenge 6: Query Mentorship Candidates",
    description: "Apply what you learned about ASC/DESC in compound indexes",
    hints: [
      "Think about which columns are involved in filtering and sorting. Are there multiple sorting columns?",
      "Consider the order: 'most recently hired' and 'oldest'. Do they suggest the same sorting direction?",
      "Would a standard index on `hire_date` alone be fully efficient? Why or why not?",
      "The index should *exactly* match the query's filtering and sorting. How to create such an index?",
      "Consider using a compound index.",
      "Think about dates in terms of their underlying representation. Imagine dates as timestamps (like seconds since a specific point in time, similar to Unix timestamps).  A *later* date would have a *larger* timestamp value.  What does this imply about ascending (ASC) and descending (DESC) order for dates? Ascending order for dates means going from the past to the future.",
    ],
  },
  {
    type: "learn",
    id: 13,
    title: "Partial Indexes to Target Specific Data Subsets",
    description:
      "Learn how to create smaller, faster indexes for specific portions of your data using a WHERE clause.",
    questions: [
      {
        question: "What is the primary purpose of a partial index?",
        correct:
          "To index only a subset of rows in a table, defined by a WHERE clause.",
        incorrect: [
          "To index all rows in a table, regardless of their values.",
          "To create a copy of the entire table for faster access.",
          "To automatically index all columns of a table.",
        ],
      },
      {
        question: "What is a key benefit of using partial indexes?",
        correct:
          "They are generally smaller and can be faster than full indexes on the same column.",
        incorrect: [
          "They always improve query performance, regardless of the query.",
          "They eliminate the need for WHERE clauses in queries.",
          "They are automatically created by PostgreSQL.",
        ],
      },
      {
        question: "In what scenario are partial indexes particularly useful?",
        correct:
          "When you frequently query for a rare value or a specific subset of data within a table.",
        incorrect: [
          "When you need to query for all rows in a table.",
          "When you want to speed up queries that don't use a WHERE clause.",
          "When the data in your table is uniformly distributed.",
        ],
      },
      {
        question: "How do you define a partial index in PostgreSQL?",
        correct: "By including a WHERE clause in the CREATE INDEX statement.",
        incorrect: [
          "By using the PARTIAL keyword before the INDEX keyword.",
          "By creating a separate table to store the index.",
          "Partial indexes are created automatically; no special syntax is needed.",
        ],
      },
    ],
  },
  {
    type: "practice",
    id: 14,
    title: "Challenge 7: Query Manager Data of Low Earners",
    description: "Apply what you learned about partial indexes",
    hints: [
      "Think about the distribution of salaries in a typical company. Are all salary values equally common? Which salary ranges are likely to contain fewer employees?",
      "This task focuses on a *specific and likely small* segment of the salary data: current low salaries (under $40,000). Would indexing the *entire* `salary` table be the most efficient approach, or is there a better way to target only the relevant rows?",
      "Consider the concept of *partial indexes*. How could you use a `WHERE` clause within the `CREATE INDEX` statement to create an index that only includes the rows relevant to this specific query?",
      "Focus on the `salary` table. The `amount` and `to_date` columns are critical for defining 'currently earning less than $40,000'. What specific condition in the `WHERE` clause of your `CREATE INDEX` statement would achieve this?",
      "The results need to be sorted by the date the employee started their current salary (`salary_from_date`). How can you include this column in your partial index to optimize the sorting operation?  Think about the order of columns in a composite index. Are we interested in sorting by amount?",
      "While not strictly required, can you include any other columns in your partial index (perhaps using an `INCLUDE` clause, or just by including them normally) that might further improve performance by avoiding lookups in the main `salary` table? Think about which columns from `salary` are needed in the `SELECT` list or in `JOIN` conditions. We need `employee_id`.",
      "You'll need to join several tables to retrieve all the required information: `employee`, `salary`, `department_employee`, `department_manager`, and `employee` again (for the manager's information).  Start by joining `employee` and `salary`.",
      "Remember the note about `to_date = '9999-01-01'` representing current records. You'll need to include this condition in your `WHERE` clause not only for the `salary` table but also for the `department_employee` and `department_manager` tables to ensure you're getting the *current* department and manager.",
      "To get the manager's name, you'll need to join the `employee` table *again*.  You *must* use different aliases for the `employee` table in this case (e.g., `e` for the employee and `em` for the manager) to distinguish between them.",
      "Ensure your `WHERE` clause in the main `SELECT` query *exactly* matches the `WHERE` clause of your partial index. This is crucial for the database to use the index. Use the `LIMIT` clause to retrieve only the first 10 employees.",
      "Consider carefully the order of columns within your partial index, think whether ordering by amount could help.",
    ],
  },
  {
    type: "learn",
    id: 15,
    title: "Substring Search and Pattern Matching",
    description:
      "Learn how to efficiently search for substrings within text columns using LIKE, operator classes, trigrams, and GIN indexes.",
    questions: [
      {
        question:
          "What is required to use a B-tree index with the LIKE operator in PostgreSQL?",
        correct:
          "The index must be created with the appropriate operator class, such as text_pattern_ops.",
        incorrect: [
          "No special index is needed; B-trees always work with LIKE.",
          "A separate LIKE index must be created.",
          "LIKE operations are always slow and cannot be indexed.",
        ],
      },
      {
        question:
          "Why is a leading wildcard (%) in a LIKE pattern problematic for B-tree index usage?",
        correct:
          "A leading wildcard prevents the index from efficiently narrowing down the search space.",
        incorrect: [
          "Leading wildcards are always faster than trailing wildcards.",
          "B-tree indexes can only handle exact matches, not patterns.",
          "PostgreSQL automatically optimizes leading wildcards.",
        ],
      },
      {
        question:
          "What PostgreSQL extension is commonly used for trigram-based indexing?",
        correct: "pg_trgm",
        incorrect: ["pg_trigram", "pg_textsearch", "pg_btree", "pg_gin"],
      },
      {
        question:
          "What type of index is typically used in conjunction with the pg_trgm extension?",
        correct: "GIN",
        incorrect: ["B-tree", "Hash", "BRIN"],
      },
      {
        question: "How to enable the pg_trgm extension?",
        correct: "CREATE EXTENSION pg_trgm;",
        incorrect: [
          "It is enabled by default",
          "ENABLE EXTENSION pg_trgm;",
          "INSTALL EXTENSION pg_trgm;",
          "None of above",
        ],
      },
    ],
  },
  {
    type: "practice",
    id: 16,
    title: "Challenge 8: Query Recovered Record",
    description:
      "Apply what you learned about trigram indexes and operator classes",
    hints: [
      "You'll need to combine filtering by both a specific date *and* a partial string match.",
      "Think about the best way to optimize searches that involve partial string matches, especially when the fragment could be anywhere in the string.",
      "Consider using a specialized index type that's designed for this kind of text search.",
      "Remember that searching for a substring within the last name will *significantly reduce* the number of rows that need to be examined, even before considering the hire date. Focus on optimizing that part.",
      "If using a GIN index, remember the appropriate operator class for trigram-based searches (`gin_trgm_ops`).",
    ],
  },
  {
    type: "learn",
    id: 17,
    title: "Fast Equality with Hash Indexes",
    description:
      "Discover the speed and efficiency of hash indexes for equality-based queries in PostgreSQL.",
    questions: [
      {
        question:
          "What type of queries are hash indexes *exclusively* designed for?",
        correct: "Equality comparisons (e.g., `WHERE column = value`)",
        incorrect: [
          "Range comparisons (e.g., `WHERE column > value`)",
          "Pattern matching (e.g., `WHERE column LIKE 'pattern%'`)",
          "Inequality comparisons (e.g., `WHERE column != value`)",
        ],
      },
      {
        question: "How do hash indexes store data?",
        correct:
          "They use a hash table to store hashed values and their corresponding locations.",
        incorrect: [
          "They use a B-tree structure to store values in sorted order.",
          "They store the original, unhashed values in a list.",
          "They don't store data, they just recompute the hash every time.",
        ],
      },
      {
        question:
          "Why are hash indexes generally smaller than B-tree indexes for the same data?",
        correct:
          "They don't need to store the tree structure and branching logic.",
        incorrect: [
          "They compress the data more efficiently.",
          "They only store a subset of the data.",
          "They use a more advanced data storage format.",
        ],
      },
    ],
  },
  {
    type: "practice",
    id: 18,
    title: "Challenge 9: Query Who's Celebrating Today",
    description: "Apply what you learned about hash and functional indexes",
    hints: [
      "Imagine grouping employees into 'buckets' based on their birth month and day. How could you efficiently find the 'bucket' for today's date?",
      "You'll need to extract the month and day from both the `birth_date` and the current date. Consider using the `EXTRACT` function in PostgreSQL.",
      "Since you're looking for an *exact* match of month and day, what type of index would be most efficient? Think about how different index types (B-tree, Hash) work.",
      "A hash index is very fast for equality checks. How could you create a hash index that effectively groups employees into 'buckets' based on their birth month and day?",
      "To use a hash index effectively, you need a single value to represent the month and day.  Think about a simple, locale-independent calculation to combine the extracted month and day into a unique integer.",
      "Use `NOW()` or `CURRENT_DATE`",
    ],
  },
];
