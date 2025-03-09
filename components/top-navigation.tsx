"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { BookOpen, BarChart2 } from "lucide-react";

export function TopNavigation() {
  const pathname = usePathname();

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto flex h-14 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2 font-medium">
          <span className="text-primary text-lg">PostgreSQL Index Lab</span>
        </Link>
        <div className="flex items-center space-x-6">
          <Link
            href="/learn"
            className={cn(
              "flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-primary",
              pathname === "/learn" ? "text-primary" : "text-muted-foreground",
            )}
          >
            <BookOpen className="h-4 w-4" />
            <span>Learning Path</span>
          </Link>
          <Link
            href="/analyze"
            className={cn(
              "flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-primary",
              pathname === "/analyze"
                ? "text-primary"
                : "text-muted-foreground",
            )}
          >
            <BarChart2 className="h-4 w-4" />
            <span>Plan Analysis</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
