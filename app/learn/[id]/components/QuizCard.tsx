"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { learningPath, LearnItem } from "@/data/learning-path";
import { addLearningProgress } from "@/app/learn/utils/AddLearningProgress";

type QuizState = "start" | "question" | "feedback" | "results";

interface QuizCardProps {
  id: number;
}

export default function QuizCard({ id }: QuizCardProps) {
  const [state, setState] = useState<QuizState>("start");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [options, setOptions] = useState<string[]>([]);

  // Find the learn item with the matching id
  const learnItem = learningPath.find(
    (item) => item.id === id && item.type === "learn",
  ) as LearnItem | undefined;
  const questions = learnItem ? learnItem.questions : [];

  const totalQuestions = questions.length;
  const currentQuestion = questions[currentQuestionIndex];
  const progress = (answeredQuestions / totalQuestions) * 100;

  // Shuffle options when question changes
  useEffect(() => {
    if (state === "question" && currentQuestion) {
      const allOptions = [
        ...currentQuestion.incorrect,
        currentQuestion.correct,
      ];
      setOptions(shuffleArray(allOptions));
      setSelectedAnswer(null);
    }
  }, [currentQuestionIndex, state, currentQuestion]);

  // Fisher-Yates shuffle algorithm
  const shuffleArray = (array: string[]) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const startQuiz = () => {
    setState("question");
    setCurrentQuestionIndex(0);
    setAnsweredQuestions(0);
    setCorrectAnswers(0);
    setSelectedAnswer(null);
  };

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer);
    setState("feedback");

    if (answer === currentQuestion.correct) {
      setCorrectAnswers((prev) => prev + 1);
    }

    setAnsweredQuestions((prev) => prev + 1);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setState("question");
    } else {
      setState("results");
      if (correctAnswers === totalQuestions) {
        addLearningProgress(id);
      }
    }
  };

  const resetQuiz = () => {
    setState("start");
    setCurrentQuestionIndex(0);
    setAnsweredQuestions(0);
    setCorrectAnswers(0);
    setSelectedAnswer(null);
  };

  // If no questions are available, don't render the quiz
  if (questions.length === 0) {
    return null;
  }

  return (
    <Card className="w-full mt-4">
      {state !== "start" && (
        <CardHeader>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-muted-foreground">
              Question {currentQuestionIndex + 1} of {totalQuestions}
            </span>
            <span className="text-sm text-muted-foreground">
              {answeredQuestions} answered
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </CardHeader>
      )}

      <CardContent className="pt-6">
        {state === "start" && (
          <div className="text-center py-8">
            <CardTitle className="mb-6">Quiz Challenge</CardTitle>
            <p className="mb-6 text-muted-foreground">
              Test your knowledge with {totalQuestions} questions.
            </p>
          </div>
        )}

        {(state === "question" || state === "feedback") && (
          <div>
            <CardTitle className="mb-6">{currentQuestion.question}</CardTitle>
            <RadioGroup
              value={selectedAnswer || ""}
              className="space-y-3"
              disabled={state === "feedback"}
            >
              {options.map((option) => (
                <div
                  key={option}
                  className={`flex items-center space-x-2 rounded-md border p-3 ${
                    state === "feedback" && selectedAnswer === option
                      ? option === currentQuestion.correct
                        ? "border-green-500 bg-green-50"
                        : "border-red-500 bg-red-50"
                      : ""
                  }`}
                >
                  <RadioGroupItem
                    value={option}
                    id={option}
                    onClick={() => state === "question" && handleAnswer(option)}
                  />
                  <Label htmlFor={option} className="flex-grow cursor-pointer">
                    {option}
                  </Label>
                  {state === "feedback" &&
                    selectedAnswer === option &&
                    (option === currentQuestion.correct ? (
                      <Check className="h-5 w-5 text-green-500" />
                    ) : (
                      <X className="h-5 w-5 text-red-500" />
                    ))}
                </div>
              ))}
            </RadioGroup>
          </div>
        )}

        {state === "results" && (
          <div className="text-center py-8">
            <CardTitle className="mb-6">Quiz Results</CardTitle>
            <div className="text-4xl font-bold mb-4">
              {correctAnswers} / {totalQuestions}
            </div>
            <Badge
              className={
                correctAnswers === totalQuestions
                  ? "bg-green-600"
                  : "bg-red-600"
              }
            >
              {correctAnswers === totalQuestions ? "Passed" : "Failed"}
            </Badge>
            <p className="text-muted-foreground mb-6 mt-4">
              {correctAnswers === totalQuestions
                ? "Congratulations! You got all questions correct."
                : "Try again to improve your score."}
            </p>
          </div>
        )}
      </CardContent>

      <CardFooter>
        {state === "start" && (
          <Button className="w-full" onClick={startQuiz}>
            Begin Quiz
          </Button>
        )}

        {state === "feedback" && (
          <Button className="w-full" onClick={nextQuestion}>
            {currentQuestionIndex < totalQuestions - 1
              ? "Next Question"
              : "See Results"}
          </Button>
        )}

        {state === "results" && (
          <Button className="w-full" onClick={resetQuiz}>
            Restart Quiz
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
