"use client"

import { useState } from "react"
import { ServiceRequestForm } from "@/components/service-request-form"
import { ServiceResults } from "@/components/service-results"
import { Header } from "@/components/header"
import type { ServiceRequest, ServiceResult } from "@/lib/types"
// import { getServiceDetails } from "@/lib/service-data" // Legacy simulation
import { fetchServiceDetails } from "@/lib/api" // Real backend

export default function Home() {
  const [result, setResult] = useState<ServiceResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (request: ServiceRequest) => {
    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      const serviceResult = await fetchServiceDetails(request)
      setResult(serviceResult)
    } catch (err: any) {
      console.error("Submission failed", err)
      setError(err.message || "Failed to fetch service details. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setResult(null)
    setError(null)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-md mb-4 border border-red-200">
            Error: {error}
          </div>
        )}
        {!result ? (
          <ServiceRequestForm onSubmit={handleSubmit} isLoading={isLoading} />
        ) : (
          <ServiceResults result={result} onReset={handleReset} />
        )}
      </main>
    </div>
  )
}
