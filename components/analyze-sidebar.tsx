import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

interface AnalyzeSidebarProps {
    queryPlan: string
    setQueryPlan: (value: string) => void
    onDigest: () => void
}

export function AnalyzeSidebar({ queryPlan, setQueryPlan, onDigest }: AnalyzeSidebarProps) {
    return (
        <div className="w-1/5 h-full bg-gray-100 p-4 flex flex-col">
            <Textarea
                className="flex-grow mb-4"
                placeholder="Paste your query plan here..."
                value={queryPlan}
                onChange={(e) => setQueryPlan(e.target.value)}
            />
            <Button className="w-full" onClick={onDigest}>
                Digest Query Plan
            </Button>
        </div>
    )
}

