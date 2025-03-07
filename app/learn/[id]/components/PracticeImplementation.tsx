"use client"

import React, { useState } from 'react'
import { PracticeItem } from "@/data/learning-path"
import { ResultType } from "@/app/types/sql-practice"
import { PracticeInputComponent } from "./PracticeInputComponent"
import { PracticeResultDisplay } from "./PracticeResultDisplay"

interface PracticeImplementationProps {
  item: PracticeItem
}

export function PracticeImplementation({ item }: PracticeImplementationProps) {
  // State declarations
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ResultType | null>(null)
  const [progress, setProgress] = useState<{ value: number; message: string } | null>(null)

  const handleSubmit = async (preparationQuery: string, selectQuery: string) => {
    setSubmitted(true)
    setLoading(true)
    setResult(null)
    setProgress({ value: 0, message: "Starting evaluation..." })

    try {
      const response = await fetch(`/api/evaluate/${item.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'text/event-stream',
        },
        body: JSON.stringify({
          preparationQuery,
          selectQuery,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Handle streaming response
      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("Response body is not readable");
      }

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        
        // Process complete events in the buffer
        const lines = buffer.split('\n\n');
        buffer = lines.pop() || ''; // Keep the last incomplete chunk in the buffer
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const eventData = JSON.parse(line.substring(6));
              
              if (eventData.type === 'error') {
                // Handle error event
                setProgress(null);
                setResult({ error: eventData.message });
                setLoading(false);
              } 
              else if (eventData.type === 'completed' && eventData.progress === 100) {
                // Final result received
                setProgress(null);
                setResult(eventData.result);
                setLoading(false);
              }
              else if (eventData.type === 'progress') {
                // Handle progress updates
                setProgress({ 
                  value: eventData.progress || 0, 
                  message: eventData.message || 'Processing...' 
                });
              }
            } catch (e) {
              console.error('Error parsing event data:', e, line);
            }
          }
        }
      }
    } catch (error) {
      console.error("Error:", error);
      setResult({
        error: error instanceof Error ? error.message : String(error),
      } as ResultType);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Query Input */}
      <PracticeInputComponent
        onSubmit={handleSubmit}
        loading={loading}
      />

      {/* Results Display */}
      <PracticeResultDisplay
        loading={loading}
        submitted={submitted}
        result={result}
        progress={progress}
      />
    </div>
  )
} 