"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export function TopNavigation() {
    const pathname = usePathname()

    return (
        <nav className="bg-gray-800 text-white p-4">
            <div className="container mx-auto flex justify-between items-center">
                <Link href="/" className="text-xl font-bold">
                    PostgreSQL Index Lab
                </Link>
                <div className="space-x-4">
                    <Link
                        href="/learn"
                        className={cn("hover:text-gray-300", pathname === "/learn" && "text-blue-400 font-semibold")}
                    >
                        Learn
                    </Link>
                    <Link
                        href="/analyze"
                        className={cn("hover:text-gray-300", pathname === "/analyze" && "text-blue-400 font-semibold")}
                    >
                        Analyze
                    </Link>
                    <Link
                        href="/practice"
                        className={cn("hover:text-gray-300", pathname === "/practice" && "text-blue-400 font-semibold")}
                    >
                        Practice
                    </Link>
                </div>
            </div>
        </nav>
    )
}

