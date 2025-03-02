import Link from "next/link"
import { learningPath } from "@/data/learning-path"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function LearnPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold mb-4">Learning Path</h1>
            <p className="mb-8">Follow this structured path to master PostgreSQL indexing.</p>

            <div className="space-y-4">
                {learningPath.map((item, index) => (
                    <Link key={item.id} href={`/learn/${item.id}`}>
                        <Card className="hover:bg-gray-50 transition-colors cursor-pointer">
                            <CardHeader>
                                <div className="flex justify-between items-center">
                                    <Badge variant={item.type === "learn" ? "default" : "secondary"}>
                                        {item.type === "learn" ? "Learn" : "Practice"}
                                    </Badge>
                                    <span className="text-sm text-gray-500">Step {index + 1}</span>
                                </div>
                                <CardTitle>{item.title}</CardTitle>
                                <CardDescription>{item.description}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="text-sm text-gray-500">Click to {item.type === "learn" ? "learn" : "practice"}</div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    )
}

