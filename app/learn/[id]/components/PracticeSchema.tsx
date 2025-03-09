"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Database } from "lucide-react";

type ColumnConstraint = "PK" | "FK->employee" | "FK->department" | "-";
type TableColumn = [string, string, ColumnConstraint[]];
type DatabaseSchema = {
  [tableName: string]: TableColumn[];
};

const databaseSchema: DatabaseSchema = {
  department: [
    ["id", "int", ["PK"]],
    ["dept_name", "varchar(40)", ["-"]],
  ],
  department_employee: [
    ["employee_id", "int", ["PK", "FK->employee"]],
    ["department_id", "int", ["PK", "FK->department"]],
    ["from_date", "date", ["-"]],
    ["to_date", "date", ["-"]],
  ],
  department_manager: [
    ["employee_id", "int", ["PK", "FK->employee"]],
    ["department_id", "int", ["PK", "FK->department"]],
    ["from_date", "date", ["-"]],
    ["to_date", "date", ["-"]],
  ],
  employee: [
    ["id", "int", ["PK"]],
    ["birth_date", "date", ["-"]],
    ["first_name", "varchar(14)", ["-"]],
    ["gender", "enum('M', 'F', 'X')", ["-"]],
    ["hire_date", "date", ["-"]],
    ["last_name", "varchar(16)", ["-"]],
  ],
  salary: [
    ["employee_id", "int", ["PK", "FK->employee"]],
    ["amount", "int", ["-"]],
    ["from_date", "date", ["PK"]],
    ["to_date", "date", ["-"]],
  ],
  title: [
    ["employee_id", "int", ["PK", "FK->employee"]],
    ["title", "varchar(50)", ["PK"]],
    ["from_date", "date", ["PK"]],
    ["to_date", "date", ["-"]],
  ],
};

export function PracticeSchema() {
  const [showDiagram, setShowDiagram] = useState(false);

  return (
    <>
      <Button
        variant="outline"
        className="w-full bg-white text-primary hover:bg-gray-100"
        onClick={() => setShowDiagram(true)}
      >
        View Database Schema
      </Button>

      {/* Schema Diagram Dialog */}
      <Dialog open={showDiagram} onOpenChange={setShowDiagram}>
        <DialogContent className="max-w-[90vw] max-h-[90vh] w-[90vw] h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Database Schema</DialogTitle>
          </DialogHeader>
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* First 3 tables (left side) */}
              <div className="space-y-6">
                {Object.entries(databaseSchema)
                  .slice(0, 3)
                  .map(([tableName, columns]) => (
                    <Card key={tableName} className="overflow-hidden">
                      <CardHeader className="bg-slate-50 py-3">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                          <Database className="h-4 w-4" />
                          {tableName}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-0">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-[30%]">Column</TableHead>
                              <TableHead className="w-[30%]">Type</TableHead>
                              <TableHead className="w-[40%]">
                                Constraints
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {columns.map(
                              (
                                [columnName, dataType, constraints],
                                rowIndex,
                              ) => (
                                <TableRow
                                  key={`${tableName}-${columnName}-${rowIndex}`}
                                >
                                  <TableCell className="font-medium">
                                    {columnName}
                                  </TableCell>
                                  <TableCell>{dataType}</TableCell>
                                  <TableCell>
                                    {constraints.map((constraint, i) =>
                                      constraint !== "-" ? (
                                        <Badge
                                          key={`${constraint}-${i}`}
                                          variant="outline"
                                          className="mr-1"
                                        >
                                          {constraint}
                                        </Badge>
                                      ) : null,
                                    )}
                                  </TableCell>
                                </TableRow>
                              ),
                            )}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  ))}
              </div>

              {/* Next 3 tables (right side) */}
              <div className="space-y-6">
                {Object.entries(databaseSchema)
                  .slice(3, 6)
                  .map(([tableName, columns]) => (
                    <Card key={tableName} className="overflow-hidden">
                      <CardHeader className="bg-slate-50 py-3">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                          <Database className="h-4 w-4" />
                          {tableName}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-0">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-[30%]">Column</TableHead>
                              <TableHead className="w-[30%]">Type</TableHead>
                              <TableHead className="w-[40%]">
                                Constraints
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {columns.map(
                              (
                                [columnName, dataType, constraints],
                                rowIndex,
                              ) => (
                                <TableRow
                                  key={`${tableName}-${columnName}-${rowIndex}`}
                                >
                                  <TableCell className="font-medium">
                                    {columnName}
                                  </TableCell>
                                  <TableCell>{dataType}</TableCell>
                                  <TableCell>
                                    {constraints.map((constraint, i) =>
                                      constraint !== "-" ? (
                                        <Badge
                                          key={`${constraint}-${i}`}
                                          variant="outline"
                                          className="mr-1"
                                        >
                                          {constraint}
                                        </Badge>
                                      ) : null,
                                    )}
                                  </TableCell>
                                </TableRow>
                              ),
                            )}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
