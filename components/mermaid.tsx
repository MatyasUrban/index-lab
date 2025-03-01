"use client"

import mermaid from "mermaid"
import { useEffect, useRef } from "react"

interface MermaidProps {
    chart: string
    config?: any
}

export default function Mermaid({ chart, config }: MermaidProps) {
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        mermaid.initialize(config)
        mermaid.run()
    }, [config])

    return (
        <div className="mermaid" ref={ref}>
            {chart}
        </div>
    )
}