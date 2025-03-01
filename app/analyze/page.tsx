"use client"

import { useState } from "react"
import { AnalyzeSidebar } from "@/components/analyze-sidebar"
import { GlossarySidebar } from "@/components/glossary-sidebar"
import { QueryPlanVisualizer } from "@/components/query-plan-visualizer"

export default function AnalyzePage() {
    const [queryPlan, setQueryPlan] = useState("")

    const handleDigest = () => {
        console.log("Digesting query plan:", queryPlan)
    }

    return (
        <div className="flex h-[calc(100vh-64px)]">
            <AnalyzeSidebar queryPlan={queryPlan} setQueryPlan={setQueryPlan} onDigest={handleDigest} />
            <div className="flex-grow overflow-auto">
                <QueryPlanVisualizer queryPlan={queryPlan} />
            </div>
            <GlossarySidebar />
        </div>
    )
}

