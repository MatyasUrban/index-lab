import Link from "next/link"
import { BookOpen, BarChart2, MonitorSmartphone } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function Home() {
  return (
    <>
      {/* Small/Medium device message */}
      <div className="lg:hidden container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[80vh]">
        <Alert className="max-w-md">
          <MonitorSmartphone className="h-5 w-5" />
          <AlertTitle className="text-xl font-semibold mb-2">Screen Size Not Supported</AlertTitle>
          <AlertDescription>
            <p className="mb-4">PostgreSQL Index Lab requires a larger screen for the best experience.</p>
            <p>Please access this application on a desktop or laptop computer with a screen width of at least 1024px.</p>
          </AlertDescription>
        </Alert>
      </div>

      {/* Desktop view */}
      <div className="hidden lg:block">
        <main className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h1 className="text-5xl font-bold mb-4 text-primary">PostgreSQL Index Lab</h1>
            <p className="text-xl text-muted-foreground">Explore, analyze, and master PostgreSQL indexing techniques.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <Card className="border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-md">
              <CardHeader className="text-center pb-2">
                <div className="mx-auto bg-primary/10 p-4 rounded-full mb-4">
                  <BookOpen className="h-10 w-10 text-primary" />
                </div>
                <CardTitle className="text-2xl">Learning Path</CardTitle>
                <CardDescription>Master PostgreSQL indexing concepts step by step</CardDescription>
              </CardHeader>
              <CardContent className="text-center pb-2">
                <p className="text-muted-foreground">
                  Comprehensive tutorials and guides to understand how PostgreSQL indexes work and how to optimize them.
                </p>
              </CardContent>
              <CardFooter className="flex justify-center pt-2">
                <Button asChild>
                  <Link href="/learn">Start Learning</Link>
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-md">
              <CardHeader className="text-center pb-2">
                <div className="mx-auto bg-primary/10 p-4 rounded-full mb-4">
                  <BarChart2 className="h-10 w-10 text-primary" />
                </div>
                <CardTitle className="text-2xl">Plan Analysis</CardTitle>
                <CardDescription>Analyze and optimize your database queries</CardDescription>
              </CardHeader>
              <CardContent className="text-center pb-2">
                <p className="text-muted-foreground">
                  Interactive tools to analyze query execution plans and identify opportunities for index optimization.
                </p>
              </CardContent>
              <CardFooter className="flex justify-center pt-2">
                <Button asChild>
                  <Link href="/analyze">Start Analyzing</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <div className="mt-16 text-center text-muted-foreground">
            <p>This application requires a large screen for the best experience.</p>
          </div>
        </main>
      </div>
    </>
  )
}

