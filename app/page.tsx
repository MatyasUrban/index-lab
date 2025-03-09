import { MonitorSmartphone } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FeatureCard } from "@/app/components/FeatureCard";

export default function Home() {
  return (
    <>
      <div className="lg:hidden container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[80vh]">
        <Alert className="max-w-md">
          <MonitorSmartphone className="h-5 w-5" />
          <AlertTitle className="text-xl font-semibold mb-2">
            Screen Size Not Supported
          </AlertTitle>
          <AlertDescription>
            <p className="mb-4">
              PostgreSQL Index Lab requires a larger screen for the best
              experience.
            </p>
            <p>
              Please access this application on a desktop or laptop computer
              with a screen width of at least 1024px.
            </p>
          </AlertDescription>
        </Alert>
      </div>

      {/* Desktop view */}
      <div className="hidden lg:block">
        <main className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h1 className="text-5xl font-bold mb-4 text-primary">
              PostgreSQL Index Lab
            </h1>
            <p className="text-xl text-muted-foreground">
              Explore, analyze, and master PostgreSQL indexing techniques.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <FeatureCard
              iconName="BookOpen"
              title="Learning Path"
              description="Comprehensive tutorials and guides to understand how PostgreSQL indexes work and how to optimize them."
              buttonText="Start Learning"
              href="/learn"
            />

            <FeatureCard
              iconName="BarChart2"
              title="Plan Analysis"
              description="Interactive tools to analyze query execution plans and identify opportunities for index optimization."
              buttonText="Start Analyzing"
              href="/analyze"
            />
          </div>
        </main>
      </div>
    </>
  );
}
