export type LearningItem = {
    id: number
    title: string
    description: string
} & (
    | {
    type: "learn"
    content: string
}
    | {
    type: "practice"
    taskDescription: string
}
    )

export const learningPath: LearningItem[] = [
    {
        type: "learn",
        id: 1,
        title: "Introduction to PostgreSQL Indexes",
        description: "Learn the basics of PostgreSQL indexes and why they're important",
        content: "introduction-to-indexes",
    },
    {
        type: "practice",
        id: 2,
        title: "Creating Your First Index",
        description: "Practice creating a basic index on a PostgreSQL table",
        taskDescription:
            "Create a B-tree index on the 'users' table for the 'email' column and verify its performance improvement.",
    },
    {
        type: "learn",
        id: 3,
        title: "Index Types in PostgreSQL",
        description: "Explore the different types of indexes available in PostgreSQL",
        content: "index-types",
    },
    {
        type: "practice",
        id: 4,
        title: "Choosing the Right Index",
        description: "Practice selecting the appropriate index type for different scenarios",
        taskDescription:
            "For the given table structure and query patterns, determine which index types would be most appropriate and implement them.",
    },
    {
        type: "learn",
        id: 5,
        title: "Query Planning and Execution",
        description: "Understand how PostgreSQL uses indexes during query planning",
        content: "query-planning",
    },
]

