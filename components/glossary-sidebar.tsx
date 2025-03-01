"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

const glossaryTerms = ["Sequential Scan", "Index Scan", "Bitmap Heap Scan", "Nested Loop", "Hash Join", "Merge Join"]

export function GlossarySidebar() {
    const [selectedTerm, setSelectedTerm] = useState<string | null>(null)

    return (
        <div className="w-1/5 h-full bg-gray-100 p-4">
            <h2 className="text-xl font-semibold mb-4">Glossary</h2>
            <ScrollArea className="h-full">
                {glossaryTerms.map((term) => (
                    <Sheet key={term}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" className="w-full justify-start mb-2" onClick={() => setSelectedTerm(term)}>
                                {term}
                            </Button>
                        </SheetTrigger>
                        <SheetContent>
                            <SheetHeader>
                                <SheetTitle>{term}</SheetTitle>
                            </SheetHeader>
                            <div className="mt-4">
                                {/* In a real application, you would load the MDX content here */}
                                <p>This is the explanation for {term}.</p>
                            </div>
                        </SheetContent>
                    </Sheet>
                ))}
            </ScrollArea>
        </div>
    )
}

