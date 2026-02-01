"use client";

import { useState } from "react";
import { ServiceRequestForm } from "@/components/service-request-form";
import { ServiceResults } from "@/components/service-results";
import { Header } from "@/components/header";
import type { ServiceRequest, ServiceResult } from "@/lib/types";
import { getServiceDetails } from "@/lib/service-data";

export default function Home() {
  const [result, setResult] = useState<ServiceResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  function addResponse(responseText: string) {
    alert("Hello youve hit me");
  }

  const handleSubmit = async (request: ServiceRequest) => {
    setIsLoading(true);
    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 800));
    const serviceResult = getServiceDetails(request);
    setResult(serviceResult);
    setIsLoading(false);
  };

  const handleReset = () => {
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {!result ? (
          <ServiceRequestForm  onSubmit={handleSubmit} isLoading={isLoading} />
        ) : (
          <ServiceResults result={result}  onReset={handleReset} />
        )}
      </main>
    </div>
  );
}
