"use client"

import { useState } from "react"
import { ArrowRight, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import {
  KENYA_COUNTIES,
  PUBLIC_SERVICES,
  AGE_RANGES,
  RESIDENCY_TYPES,
  APPLICATION_TYPES,
  type ServiceRequest,
} from "@/lib/types"

interface ServiceRequestFormProps {
  onSubmit: (request: ServiceRequest) => void
  isLoading: boolean
}

export function ServiceRequestForm({ onSubmit, isLoading }: ServiceRequestFormProps) {
  const [county, setCounty] = useState("")
  const [service, setService] = useState("")
  const [age, setAge] = useState("")
  const [residency, setResidency] = useState("")
  const [applicationType, setApplicationType] = useState("")
  const [query, setQuery] = useState("")

  const isValid = (county && service && age && residency && applicationType) || (query.length > 5)

  const handleSubmit = () => {
    if (!isValid) return
    onSubmit({ county, service, age, residency, applicationType, query })
  }

  // Group services by category
  const servicesByCategory = PUBLIC_SERVICES.reduce(
    (acc, svc) => {
      if (!acc[svc.category]) acc[svc.category] = []
      acc[svc.category].push(svc)
      return acc
    },
    {} as Record<string, typeof PUBLIC_SERVICES[number][]>
  )

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Navigate Public Services
        </h2>
        <p className="mt-2 text-muted-foreground">
          Get clear, step-by-step guidance for any Kenyan government service
        </p>
      </div>

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-lg text-card-foreground">Service Details</CardTitle>
          <CardDescription>
            Select your location and the service you need help with
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            {/* County Selector */}
            <div className="space-y-2">
              <Label htmlFor="county" className="text-foreground">County / Region</Label>
              <Select value={county} onValueChange={setCounty}>
                <SelectTrigger id="county" className="w-full">
                  <SelectValue placeholder="Select your county" />
                </SelectTrigger>
                <SelectContent>
                  {KENYA_COUNTIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Service Selector */}
            <div className="space-y-2">
              <Label htmlFor="service" className="text-foreground">Public Service</Label>
              <Select value={service} onValueChange={setService}>
                <SelectTrigger id="service" className="w-full">
                  <SelectValue placeholder="Select a service" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(servicesByCategory).map(([category, services]) => (
                    <SelectGroup key={category}>
                      <SelectLabel>{category}</SelectLabel>
                      {services.map((svc) => (
                        <SelectItem key={svc.id} value={svc.id}>
                          {svc.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="h-px bg-border" />

          <div>
            <h3 className="mb-4 text-sm font-medium text-foreground">Your Context</h3>
            <div className="grid gap-6 sm:grid-cols-3">
              {/* Age Range */}
              <div className="space-y-2">
                <Label htmlFor="age" className="text-foreground">Age Range</Label>
                <Select value={age} onValueChange={setAge}>
                  <SelectTrigger id="age" className="w-full">
                    <SelectValue placeholder="Select age" />
                  </SelectTrigger>
                  <SelectContent>
                    {AGE_RANGES.map((a) => (
                      <SelectItem key={a.id} value={a.id}>
                        {a.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Residency */}
              <div className="space-y-2">
                <Label htmlFor="residency" className="text-foreground">Residency Status</Label>
                <Select value={residency} onValueChange={setResidency}>
                  <SelectTrigger id="residency" className="w-full">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {RESIDENCY_TYPES.map((r) => (
                      <SelectItem key={r.id} value={r.id}>
                        {r.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Application Type */}
              <div className="space-y-2">
                <Label htmlFor="application-type" className="text-foreground">Application Type</Label>
                <Select value={applicationType} onValueChange={setApplicationType}>
                  <SelectTrigger id="application-type" className="w-full">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {APPLICATION_TYPES.map((t) => (
                      <SelectItem key={t.id} value={t.id}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="h-px bg-border" />

          <div className="space-y-2">
            <Label htmlFor="query" className="text-foreground">Specific Question or Follow-up</Label>
            <Textarea
              id="query"
              placeholder="E.g. How do I get a passport for a minor? Or tell me about eligibility for NHIF."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="min-h-[100px]"
            />
          </div>

          <div className="flex items-start gap-3 rounded-lg bg-secondary p-4">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-info" />
            <p className="text-sm text-muted-foreground">
              No personal data is stored. Your selections are only used to generate relevant guidance.
            </p>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={!isValid || isLoading}
            className="w-full gap-2"
            size="lg"
          >
            {isLoading ? (
              <>
                <Spinner className="mr-2" />
                Processing...
              </>
            ) : (
              <>
                Check Service Details
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
