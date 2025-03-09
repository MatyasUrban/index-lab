// Base type for all path items
export interface PathItem {
  id: number;
  title: string;
  description: string;
}

// Question interface for quiz questions
export interface Question {
  question: string;
  correct: string;
  incorrect: string[];
}

// Learn content type
export interface LearnItem extends PathItem {
  type: "learn";
  questions: Question[];
}

// Practice content type
export interface PracticeItem extends PathItem {
  type: "practice";
  hints: string[];
}

// Union type for all learning path items
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
          "Correctness and Redability",
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
    type: "practice",
    id: 2,
    title: "Creating Your First Index",
    description: "Practice creating a basic index on a PostgreSQL table",
    hints: [
      "B-tree indexes are the default index type in PostgreSQL and work well for equality and range queries.",
      "The syntax for creating an index is: CREATE INDEX index_name ON table_name (column_name);",
      "You can verify the performance improvement by running EXPLAIN ANALYZE on your query before and after creating the index.",
    ],
  },
  {
    type: "learn",
    id: 3,
    title: "Index Types in PostgreSQL",
    description:
      "Explore the different types of indexes available in PostgreSQL",
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
