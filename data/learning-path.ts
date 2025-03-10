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
    type: "practice",
    id: 4,
    title: "Choosing the Right Index",
    description:
      "Practice selecting the appropriate index type for different scenarios",
    hints: [],
  },
  {
    type: "learn",
    id: 5,
    title: "Query Planning and Execution",
    description: "Understand how PostgreSQL uses indexes during query planning",
    questions: [
      {
        question: "What is the capital of France?",
        correct: "Paris",
        incorrect: ["London", "Berlin", "Madrid"],
      },
      {
        question: "Which planet is known as the Red Planet?",
        correct: "Mars",
        incorrect: ["Venus", "Jupiter", "Mercury"],
      },
      {
        question: "What is the largest mammal?",
        correct: "Blue Whale",
        incorrect: ["Elephant", "Giraffe", "Hippopotamus"],
      },
      {
        question: "Who painted the Mona Lisa?",
        correct: "Leonardo da Vinci",
        incorrect: ["Pablo Picasso", "Vincent van Gogh", "Michelangelo"],
      },
    ],
  },
];
