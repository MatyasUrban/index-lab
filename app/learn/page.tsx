import Link from "next/link";
import { learningPath } from "@/data/learning-path";
import { PathItem } from "@/app/learn/components/PathItem";

export default function LearnPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">Learning Path</h1>
      <p className="mb-8">
        Follow this structured path to master PostgreSQL indexing.
      </p>

      <div className="space-y-12">
        {learningPath.map((item, index) => (
          <div key={item.id} className="relative">
            {/* Flow indicator line between cards */}
            {index < learningPath.length - 1 && (
              <div className="absolute left-8 top-full h-12 w-0.5 bg-gray-200 z-0"></div>
            )}

            <Link href={`/learn/${item.id}`}>
              <PathItem item={item} index={index} />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
