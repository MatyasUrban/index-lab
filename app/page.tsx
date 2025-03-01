import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-4">Welcome to PostgreSQL Index Lab</h1>
        <p className="mb-8">Explore, analyze, and master PostgreSQL indexing techniques.</p>
        <div className="flex justify-center space-x-4">
          <Button asChild>
            <Link href="/learn">Learn</Link>
          </Button>
          <Button asChild>
            <Link href="/analyze">Analyze</Link>
          </Button>
          <Button asChild>
            <Link href="/practice">Practice</Link>
          </Button>
        </div>
      </main>
  )
}

