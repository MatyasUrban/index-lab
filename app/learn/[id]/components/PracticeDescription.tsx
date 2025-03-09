"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Markdown } from "@/components/Markdown";

interface PracticeDescriptionProps {
  itemId: number;
}

export function PracticeDescription({ itemId }: PracticeDescriptionProps) {
  return (
    <Card className="flex-grow-0">
      <CardHeader>
        <CardTitle>Task</CardTitle>
      </CardHeader>
      <CardContent>
        <Markdown contentId={itemId} />
      </CardContent>
    </Card>
  );
}
