"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { BookOpen, BarChart2, LucideIcon } from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  BookOpen,
  BarChart2,
};

interface FeatureCardProps {
  iconName: string;
  title: string;
  description: string;
  buttonText: string;
  href: string;
}

export function FeatureCard({
  iconName,
  title,
  description,
  buttonText,
  href,
}: FeatureCardProps) {
  const Icon = ICONS[iconName] || BookOpen;

  return (
    <Card className="border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-md">
      <CardHeader className="text-center pb-2">
        <div className="mx-auto bg-primary/10 p-4 rounded-full mb-4">
          <Icon className="h-10 w-10 text-primary" />
        </div>
        <h3 className="text-2xl font-semibold">{title}</h3>
      </CardHeader>
      <CardContent className="text-center pb-2">
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
      <CardFooter className="flex justify-center pt-2">
        <Button asChild>
          <Link href={href}>{buttonText}</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
