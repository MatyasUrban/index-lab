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
    title: "Extracting Employee IDs from Development",
    description:
      "Challenge yourself to write a highly selective query that meets the requirements",
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
        question: "Which index type is created by default when you define a PRIMARY KEY constraint?",
        correct: "B-tree",
        incorrect: [
          "Hash",
          "GiST",
          "GIN",
        ],
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
    type: "learn",
    id: 5,
    title: "Compound Indexes for Multi-Column Lookup",
    description:
      "Learn how to create and effectively use compound indexes to optimize queries involving multiple columns, understanding their benefits and limitations.",
    questions: [
      {
        question:
          "Which of the following queries would benefit the most from a compound index on `(last_name, first_name)`?",
        correct: "SELECT * FROM users WHERE last_name = 'Smith' AND first_name = 'John';",
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
        correct: "A scan that uses a bitmap generated from index scans to identify the relevant heap blocks to read.",
        incorrect: [
          "A scan that always reads the entire table heap.",
          "A scan that only uses a single index.",
          "A scan that avoids reading the heap entirely (like an index-only scan).",
        ],
      },
      {
        question: "Why is the order of columns in a compound index important?",
        correct: "It affects which queries can efficiently use the index and the overall index traversal efficiency.",
        incorrect: [
          "The order has no impact on query performance.",
          "The order only affects the size of the index.",
          "The order only matters for index-only scans.",
        ]
      }
    ],
  },
  {
    type: "learn",
    id: 6,
    title: "Covering Indexes and Index-Only Scans",
    description: "Learn how to create indexes that contain all the data needed for a query, eliminating the need to access the table itself.",
    questions: [
      {
        question: "What is a covering index?",
        correct: "An index that includes all columns needed for a query, enabling index-only scans.",
        incorrect: [
          "An index that covers the entire table, regardless of the query.",
          "An index that is automatically created by PostgreSQL.",
          "An index used only for full table scans.",
        ],
      },
      {
        question: "What is the primary benefit of an index-only scan?",
        correct: "It avoids reading data from the table's heap blocks, significantly reducing I/O.",
        incorrect: [
          "It automatically optimizes all queries.",
          "It always uses less memory than a regular index scan.",
          "It is only beneficial for small tables.",
        ],
      },
      {
        question: "How can you create a covering index for a query on multiple columns?",
        correct: "Create a compound index including all the queried columns.",
        incorrect: [
          "Create separate indexes on each column.",
          "It's impossible, you need to filter only by 1 column",
          "PostgreSQL creates covering indexes automagically."
        ]
      },
      {
        question: "What is the purpose of the `INCLUDE` clause in PostgreSQL index creation?",
        correct: "To add columns to the index that are not part of the index's search key, but are useful for index-only scans.",
        incorrect: [
          "To exclude specific columns from the index.",
          "To make the index unique.",
          "To specify the sort order of the index.",
        ],
      },
    ],
  },
  {
    type: "learn",
    id: 7,
    title: "Functional Indexes and Ordering",
    description: "Learn how to create indexes that match your query's specific needs, including custom sort orders and functional transformations.",
    questions: [
      {
        question: "What is the primary limitation of a basic index created on a column without specifying sort order?",
        correct: "It may not be usable for queries with different sort orders or transformations on the indexed column.",
        incorrect: [
          "It will always be slower than a full table scan.",
          "It can only be used for equality comparisons.",
          "It cannot be used with WHERE clauses.",
        ],
      },
      {
        question: "In a compound index defined with `(column1 ASC, column2 ASC)`, can it efficiently satisfy a query ordering by `column1 ASC, column2 DESC`?",
        correct: "No, the index's sort order does not match the query's sort order.",
        incorrect: [
          "Yes, the order of columns in the index definition doesn't matter.",
          "Yes, PostgreSQL will automatically reverse the index scan.",
          "It depends on the data distribution in the table.",
        ],
      },
      {
        question: "What is a functional index?",
        correct: "An index that stores the result of a function applied to one or more columns, rather than the raw column values.",
        incorrect: [
          "An index that automatically updates itself whenever the underlying table changes.",
          "An index that uses a special algorithm to improve performance for all types of queries.",
          "An index that can only be created on functions, not on columns.",
        ],
      },
      {
        question: "Which of the following is a good use case for a functional index?",
        correct: "Performing case-insensitive searches on a text column.",
        incorrect: [
          "Indexing a column that is rarely used in queries.",
          "Improving the performance of queries that always return a large percentage of the table.",
          "Replacing a regular index on a numeric column to save space."
        ],
      },
      {
        question: "Can an index on lower(name) be used to improve the below query? SELECT * FROM users WHERE name = 'John Doe';",
        correct: "No, Because query is not using the same function (lower) that was used in the index.",
        incorrect: [
          "Yes, functional indexes improve all queries on the base column.",
          "Yes, PostgreSQL automatically handles case-insensitive comparisons.",
          "It depends on if John Doe record exists or not",
        ],
      },
    ],
  },
  {
    type: "learn",
    id: 8,
    title: "Partial Indexes to Target Specific Data Subsets",
    description: "Learn how to create smaller, faster indexes for specific portions of your data using a WHERE clause.",
    questions: [
      {
        question: "What is the primary purpose of a partial index?",
        correct: "To index only a subset of rows in a table, defined by a WHERE clause.",
        incorrect: [
          "To index all rows in a table, regardless of their values.",
          "To create a copy of the entire table for faster access.",
          "To automatically index all columns of a table.",
        ],
      },
      {
        question: "What is a key benefit of using partial indexes?",
        correct: "They are generally smaller and can be faster than full indexes on the same column.",
        incorrect: [
          "They always improve query performance, regardless of the query.",
          "They eliminate the need for WHERE clauses in queries.",
          "They are automatically created by PostgreSQL.",
        ],
      },
      {
        question: "In what scenario are partial indexes particularly useful?",
        correct: "When you frequently query for a rare value or a specific subset of data within a table.",
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
          "Partial indexes are created automatically; no special syntax is needed."
        ]
      }
    ],
  },
  {
    type: "learn",
    id: 9,
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
        question: "What PostgreSQL extension is commonly used for trigram-based indexing?",
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
        incorrect: ["It is enabled by default", "ENABLE EXTENSION pg_trgm;", "INSTALL EXTENSION pg_trgm;", "None of above"],
      },
    ],
  },
  {
    type: "learn",
    id: 10,
    title: "Lightning-Fast Equality: Unleashing Hash Indexes",
    description: "Discover the speed and efficiency of hash indexes for equality-based queries in PostgreSQL.",
    questions: [
      {
        question: "What type of queries are hash indexes *exclusively* designed for?",
        correct: "Equality comparisons (e.g., `WHERE column = value`)",
        incorrect: [
          "Range comparisons (e.g., `WHERE column > value`)",
          "Pattern matching (e.g., `WHERE column LIKE 'pattern%'`)",
          "Inequality comparisons (e.g., `WHERE column != value`)"
        ]
      },
      {
        question: "How do hash indexes store data?",
        correct: "They use a hash table to store hashed values and their corresponding locations.",
        incorrect: [
          "They use a B-tree structure to store values in sorted order.",
          "They store the original, unhashed values in a list.",
          "They don't store data, they just recompute the hash every time."
        ]
      },
      {
        question: "Why are hash indexes generally smaller than B-tree indexes for the same data?",
        correct: "They don't need to store the tree structure and branching logic.",
        incorrect: [
          "They compress the data more efficiently.",
          "They only store a subset of the data.",
          "They use a more advanced data storage format."
        ]
      }
    ]
  }
];
