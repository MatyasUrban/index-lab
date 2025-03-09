"use client";

import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

interface PracticeInputComponentProps {
  onSubmit: (preparationQuery: string, selectQuery: string) => void;
  loading: boolean;
}

export function PracticeInputComponent({
  onSubmit,
  loading,
}: PracticeInputComponentProps) {
  const prepQueryRef = useRef<HTMLInputElement>(null);
  const selectQueryRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = () => {
    const selectQuery = selectQueryRef.current?.value.trim() || "";
    if (!selectQuery) {
      alert("Please enter a SQL query before submitting");
      selectQueryRef.current?.focus();
      return;
    }

    const prepQuery = prepQueryRef.current?.value.trim() || "";
    onSubmit(prepQuery, selectQuery);
  };

  return (
    <>
      <div className="flex flex-col gap-2">
        <label htmlFor="pre-query" className="text-sm font-medium">
          Preparation Query
        </label>
        <Input
          id="pre-query"
          ref={prepQueryRef}
          defaultValue=""
          placeholder="Optional: CREATE INDEX..."
          className="font-mono"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="query" className="text-sm font-medium">
          Select Query
        </label>
        <div className="relative">
          <Textarea
            id="query"
            ref={selectQueryRef}
            defaultValue=""
            placeholder="SELECT * FROM employees WHERE..."
            className="font-mono resize-none h-32 pr-28"
            required
          />
          <Button
            className="font-medium absolute bottom-2 right-2"
            onClick={handleSubmit}
            disabled={loading}
            size="sm"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Evaluating...
              </>
            ) : (
              "Evaluate"
            )}
          </Button>
        </div>
      </div>
    </>
  );
}
