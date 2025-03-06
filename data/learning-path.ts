export type LearningItem = {
    id: number
    title: string
    description: string
} & (
    | {
    type: "learn"
}
    | {
    type: "practice"
    hints: string[]
}
    )

export const learningPath: LearningItem[] = [
    {
        type: "learn",
        id: 1,
        title: "Introduction to PostgreSQL Indexes",
        description: "Learn the basics of PostgreSQL indexes and why they're important",
    },
    {
        type: "practice",
        id: 2,
        title: "Creating Your First Index",
        description: "Practice creating a basic index on a PostgreSQL table",
        hints: [
            "B-tree indexes are the default index type in PostgreSQL and work well for equality and range queries.",
            "The syntax for creating an index is: CREATE INDEX index_name ON table_name (column_name);",
            "You can verify the performance improvement by running EXPLAIN ANALYZE on your query before and after creating the index."
        ],
    },
    {
        type: "learn",
        id: 3,
        title: "Index Types in PostgreSQL",
        description: "Explore the different types of indexes available in PostgreSQL",
    },
    {
        type: "practice",
        id: 4,
        title: "Choosing the Right Index",
        description: "Practice selecting the appropriate index type for different scenarios",
        hints: [],
    },
    {
        type: "learn",
        id: 5,
        title: "Query Planning and Execution",
        description: "Understand how PostgreSQL uses indexes during query planning",
    },
]

