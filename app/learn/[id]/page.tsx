"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { LearningDetail } from "./components/learning-detail"

export default function LearnDetailPage({ params }: { params: Promise<{ id: string }> }) {
    useRouter();
    const unwrappedParams = React.use(params);
    const currentItemId = Number.parseInt(unwrappedParams.id, 10)

    return <LearningDetail currentItemId={currentItemId} />
}

