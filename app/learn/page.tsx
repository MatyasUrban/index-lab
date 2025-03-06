import Link from "next/link"
import { learningPath } from "@/data/learning-path"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronRight, BookOpen, Code } from "lucide-react"

export default function LearnPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold mb-4">Learning Path</h1>
            <p className="mb-8">Follow this structured path to master PostgreSQL indexing.</p>

            <div className="space-y-12">
                {learningPath.map((item, index) => (
                    <div key={item.id} className="relative">
                        {/* Flow indicator line between cards */}
                        {index < learningPath.length - 1 && (
                            <div className="absolute left-8 top-full h-12 w-0.5 bg-gray-200 z-0"></div>
                        )}
                        
                        <Link href={`/learn/${item.id}`}>
                            <Card className="hover:bg-gray-50 transition-colors cursor-pointer border-l-4 border-l-primary shadow-sm">
                                <CardHeader>
                                    <div className="flex justify-between items-center">
                                        <Badge variant={item.type === "learn" ? "default" : "secondary"} className="flex items-center gap-1">
                                            {item.type === "learn" ? <BookOpen className="h-3 w-3" /> : <Code className="h-3 w-3" />}
                                            {item.type === "learn" ? "Learn" : "Practice"}
                                        </Badge>
                                        <div className="flex items-center justify-center h-7 w-7 rounded-full bg-primary text-primary-foreground text-sm font-medium">
                                            {index + 1}
                                        </div>
                                    </div>
                                    <CardTitle>{item.title}</CardTitle>
                                    <CardDescription>{item.description}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-sm text-gray-500 flex items-center">
                                        Click to {item.type === "learn" ? "learn" : "practice"}
                                        <ChevronRight className="h-4 w-4 ml-1" />
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    )
}

