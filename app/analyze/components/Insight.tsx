import React from "react";
import { Info } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

export type LearningConcept = {
  title: string;
  description: string;
};

export type LearningConcepts = {
  [key: string]: LearningConcept;
};

export const learningConcepts: LearningConcepts = {
  startupCost: {
    title: "Startup Cost",
    description:
      "The estimated cost to begin executing a query operation and produce the first row. It includes any preparatory work required by the operation, such as sorting or initializing data structures.",
  },
  totalCost: {
    title: "Total Cost",
    description:
      "The estimated cost to complete the query operation and retrieve all rows. It combines the startup cost with the cost of processing all rows.",
  },
  actualStartupTime: {
    title: "Actual Startup Time",
    description:
      "The real time taken to produce the first row during query execution, measured in milliseconds. It reflects actual performance rather than an estimate.",
  },
  actualTotalTime: {
    title: "Actual Total Time",
    description:
      "The total elapsed time to complete the query operation and retrieve all rows, also measured in milliseconds. It indicates how long the operation actually took to execute.",
  },
  planningTime: {
    title: "Planning Time",
    description:
      "The time taken by the PostgreSQL query planner to generate an execution plan for the query.",
  },
  executionTime: {
    title: "Execution Time",
    description:
      "The actual time taken to execute the query and retrieve the results.",
  },
  "Index Scan": {
    title: "Index Scan",
    description:
      "An Index Scan uses an index to locate specific rows or a range of rows matching certain conditions. It first traverses the index to find matching entries, then fetches the corresponding table data. This method is efficient when retrieving a small subset of rows from a large table, as it avoids reading the entire table. However, it incurs higher per-row overhead compared to a sequential scan due to the additional step of checking the actual table data. Index Scans are particularly effective for queries with highly selective predicates, where few rows need to be retrieved."
  },
  "Index Only Scan": {
    title: "Index Only Scan",
    description:
      "A scan that can retrieve all needed data from the index without accessing the table. This is typically faster than a regular index scan.",
  },
  "Seq Scan": {
    title: "Sequential Scan",
    description:
      "A sequential scan is a basic table access method that reads all rows from start to finish, evaluating each against specified conditions. It’s typically used when a significant portion of the table needs to be examined or when no suitable index exists. Filters can be applied to remove irrelevant rows, potentially reducing the result set. While simple, this method can be inefficient for large tables when only a small subset of data is required.",
  },
  "Hash Join": {
    title: "Hash Join",
    description:
      "A hash join is an algorithm for joining tables based on equijoin conditions, such as joining tables based on shared key identifier. A hash join node takes two inputs: the build side (inner relation) and the probe side (outer relation). The inner relation is typically chosen as the smaller dataset to minimize memory usage. The algorithm works in two phases: build and probe. In the build phase, a hash table is constructed using the inner relation’s join keys. Each key maps to corresponding rows from the inner relation. In the probe phase, the outer relation is scanned sequentially, and its rows are hashed to locate matches in the hash table. This ensures efficient filtering by comparing only rows with matching hash codes.",
  },
  Hash: {
    title: "Hash",
    description:
      "A Hash node prepares data for a Hash Join operation. It reads an input relation, computes hash values for the join keys, and builds an in-memory hash table, which is then used by the corresponding Hash Join node to perform the join efficiently.",
  },
  Limit: {
    title: "Limit",
    description:
      "A Limit node restricts the number of rows returned by its child node. It passes through a specified number of rows and then stops, effectively capping the result set size.",
  },
  "Nested Loop": {
    title: "Nested Loop",
    description:
      "A join algorithm that iterates through rows of the outer table and, for each row, scans the inner table for matches. It’s efficient for small datasets or when the inner table has an index on the join column, but can be slow for large datasets without proper indexing.",
  },
  Sort: {
    title: "Sort",
    description:
      "A node that orders the input rows based on specified columns or expressions. It’s used to implement ORDER BY clauses, to prepare data for merge joins, or to support operations like DISTINCT. Sorting can be memory-intensive for large datasets and may require disk-based operations.",
  },
  "Incremental Sort": {
    title: "Incremental Sort",
    description:
      "An optimization of the Sort node that exploits existing partial ordering in the input data. It sorts smaller groups of rows incrementally, reducing memory usage and improving performance when the input is already partially sorted by leading columns of the sort key.",
  },
  "Bitmap Index Scan": {
    title: "Bitmap Index Scan",
    description:
      "Part 1 of 2-phase table access method. Creates a bitmap of matching row locations using one or more indexes. Efficiently identifies qualifying rows without fetching data. Can combine results from multiple indexes using BitmapAnd or BitmapOr operations. Passes the resulting bitmap to the Bitmap Heap Scan. Particularly effective for queries retrieving moderate number of rows from large tables. Followed by Bitmap Heap Scan node handling part 2.",
  },
  "Bitmap Heap Scan": {
    title: "Bitmap Heap Scan",
    description:
      "Part 2 of 2-phase table access method. Preceded by Bitmap Index Scan node. Uses bitmap from Bitmap Index Scan to fetch actual rows from the table. Reads table blocks sequentially, reducing random I/O. Handles exact or lossy bitmaps based on available memory. For lossy bitmaps, rechecks conditions on fetched pages.",
  },
  Aggregate: {
    title: "Aggregate",
    description:
      "A node that computes aggregate functions like SUM, AVG, or COUNT over groups of rows. It maintains internal state as it processes rows, updating this state with a transition function for each input row. After processing all rows, it applies a final function to produce the aggregate result for each group.",
  },
  Materialize: {
    title: "Materialize",
    description:
      "A node that stores the results of its child node in memory or on disk, allowing for faster repeated access to the data. It’s useful for operations that need to scan their input multiple times, such as nested loop joins or certain types of subqueries.",
  },
};

export type InsightProps = {
  title: string;
  description: string;
  learnings: string[];
  content: React.ReactNode;
};

export function Insight({
  title,
  description,
  learnings,
  content,
}: InsightProps) {
  const validLearnings = learnings.filter(
    (concept) => learningConcepts[concept],
  );

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <h4 className="text-sm font-semibold mb-2">Key Concepts:</h4>
          <div className="flex gap-2 flex-wrap">
            {validLearnings.map((concept) => (
              <Dialog key={concept}>
                <DialogTrigger asChild>
                  <Badge variant="secondary" className="cursor-pointer">
                    <Info className="mr-1 h-3 w-3" />
                    {learningConcepts[concept].title}
                  </Badge>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{learningConcepts[concept].title}</DialogTitle>
                    <DialogDescription>
                      {learningConcepts[concept].description}
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            ))}
          </div>
        </div>
        {content}
      </CardContent>
    </Card>
  );
}
