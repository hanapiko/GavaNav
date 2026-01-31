"use client"

import { useState } from "react"
import {
  ArrowLeft,
  MapPin,
  Clock,
  Banknote,
  FileText,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Lightbulb,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Scale,
  Info,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import type { ServiceResult } from "@/lib/types"

interface ServiceResultsProps {
  result: ServiceResult
  onReset: () => void
}

function SourceBadge({ isAI = false }: { isAI?: boolean }) {
  return (
    <Badge
      variant="outline"
      className={`gap-1 text-xs ${isAI
          ? "border-accent/50 bg-accent/10 text-accent"
          : "border-primary/50 bg-primary/10 text-primary"
        }`}
    >
      {isAI ? (
        <>
          <Sparkles className="h-3 w-3" />
          AI-Generated
        </>
      ) : (
        <>
          <Scale className="h-3 w-3" />
          Rule-Based
        </>
      )}
    </Badge>
  )
}

export function ServiceResults({ result, onReset }: ServiceResultsProps) {
  const [checkedDocs, setCheckedDocs] = useState<Set<string>>(new Set())
  const [isExplanationOpen, setIsExplanationOpen] = useState(false)

  const toggleDoc = (docName: string) => {
    const newChecked = new Set(checkedDocs)
    if (newChecked.has(docName)) {
      newChecked.delete(docName)
    } else {
      newChecked.add(docName)
    }
    setCheckedDocs(newChecked)
  }

  const requiredDocs = result.requiredDocuments.items.filter((d) => d.required)
  const checkedRequiredCount = requiredDocs.filter((d) => checkedDocs.has(d.name)).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="mb-2 -ml-2 gap-1 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            New Search
          </Button>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            {result.serviceName}
          </h2>
          <p className="text-muted-foreground">{result.county} County</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <Badge variant="secondary" className="px-3 py-1">
            Confidence: {(result.confidenceScore * 100).toFixed(0)}%
          </Badge>
          <SourceBadge isAI={result.confidenceScore < 0.9} />
        </div>
      </div>

      {/* Chat Response (if present) */}
      {result.chatResponse && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Sparkles className="mt-1 h-5 w-5 shrink-0 text-primary" />
              <div>
                <p className="text-sm italic text-foreground leading-relaxed">
                  "{result.chatResponse}"
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Eligibility Status */}
      <Card
        className={`border-2 ${result.eligibility.status === "eligible"
            ? "border-success/50 bg-success/5"
            : result.eligibility.status === "conditionally_eligible"
              ? "border-warning/50 bg-warning/5"
              : "border-destructive/50 bg-destructive/5"
          }`}
      >
        <CardContent className="flex items-start gap-4 p-4">
          {result.eligibility.status === "eligible" ? (
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" />
          ) : result.eligibility.status === "conditionally_eligible" ? (
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-warning" />
          ) : (
            <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
          )}
          <div className="flex-1">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-medium text-foreground">
                {result.eligibility.status === "eligible"
                  ? "You are eligible"
                  : result.eligibility.status === "conditionally_eligible"
                    ? "Conditionally eligible"
                    : "Not eligible"}
              </h3>
              <SourceBadge />
            </div>
            <ul className="mt-2 space-y-1">
              {result.eligibility.conditions.map((condition, i) => (
                <li key={i} className="text-sm text-muted-foreground">
                  {condition}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Main Info Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Location */}
        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <CardTitle className="text-sm font-medium text-card-foreground">
                  Service Location
                </CardTitle>
              </div>
              <SourceBadge />
            </div>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p className="font-medium text-foreground">{result.location.office}</p>
            <p className="text-muted-foreground">{result.location.address}</p>
            <p className="text-muted-foreground">{result.location.hours}</p>
            <p className="text-muted-foreground">{result.location.phone}</p>
          </CardContent>
        </Card>

        {/* Cost */}
        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Banknote className="h-4 w-4 text-primary" />
                <CardTitle className="text-sm font-medium text-card-foreground">
                  Cost / Fees
                </CardTitle>
              </div>
              <SourceBadge />
            </div>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p className="text-lg font-semibold text-foreground">{result.cost.amount}</p>
            <ul className="space-y-1">
              {result.cost.breakdown.map((item, i) => (
                <li key={i} className="flex justify-between text-muted-foreground">
                  <span>{item.item}</span>
                  <span>{item.cost}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Processing Time */}
        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                <CardTitle className="text-sm font-medium text-card-foreground">
                  Processing Time
                </CardTitle>
              </div>
              <SourceBadge />
            </div>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div>
              <p className="text-xs text-muted-foreground">Standard</p>
              <p className="font-medium text-foreground">{result.processingTime.standard}</p>
            </div>
            {result.processingTime.expedited && (
              <div>
                <p className="text-xs text-muted-foreground">Expedited</p>
                <p className="font-medium text-foreground">{result.processingTime.expedited}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Required Documents Checklist */}
      <Card className="border-border bg-card">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              <CardTitle className="text-sm font-medium text-card-foreground">
                Required Documents
              </CardTitle>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground">
                {checkedRequiredCount}/{requiredDocs.length} required items
              </span>
              <SourceBadge />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {result.requiredDocuments.items.map((doc) => (
              <li key={doc.name} className="flex items-start gap-3">
                <Checkbox
                  id={doc.name}
                  checked={checkedDocs.has(doc.name)}
                  onCheckedChange={() => toggleDoc(doc.name)}
                  className="mt-0.5"
                />
                <label htmlFor={doc.name} className="flex-1 cursor-pointer select-none">
                  <span
                    className={`text-sm ${checkedDocs.has(doc.name) ? "text-muted-foreground line-through" : "text-foreground"}`}
                  >
                    {doc.name}
                  </span>
                  {!doc.required && (
                    <Badge variant="outline" className="ml-2 text-xs">
                      Optional
                    </Badge>
                  )}
                  {doc.note && (
                    <p className="mt-0.5 text-xs text-muted-foreground">{doc.note}</p>
                  )}
                </label>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Step-by-Step Process */}
      <Card className="border-border bg-card">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-card-foreground">
              Step-by-Step Process
            </CardTitle>
            <SourceBadge />
          </div>
        </CardHeader>
        <CardContent>
          <ol className="relative space-y-4 border-l border-border pl-6">
            {result.processSteps.steps.map((step, i) => (
              <li key={step.step} className="relative">
                <span className="absolute -left-9 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                  {step.step}
                </span>
                <h4 className="font-medium text-foreground">{step.title}</h4>
                <p className="mt-0.5 text-sm text-muted-foreground">{step.description}</p>
                {step.location && (
                  <p className="mt-1 text-xs text-primary">{step.location}</p>
                )}
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      {/* AI Guidance */}
      <Card className="border-accent/30 bg-accent/5">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-accent" />
              <CardTitle className="text-sm font-medium text-card-foreground">
                Explanation & Guidance
              </CardTitle>
            </div>
            <SourceBadge isAI />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">{result.aiGuidance.explanation}</p>

          {result.aiGuidance.tips.length > 0 && (
            <div>
              <h4 className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Tips
              </h4>
              <ul className="space-y-2">
                {result.aiGuidance.tips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {result.aiGuidance.warnings.length > 0 && (
            <div>
              <h4 className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Important Warnings
              </h4>
              <ul className="space-y-2">
                {result.aiGuidance.warnings.map((warning, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
                    {warning}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Transparency Section */}
      <Collapsible open={isExplanationOpen} onOpenChange={setIsExplanationOpen}>
        <Card className="border-border bg-card">
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-secondary/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Info className="h-4 w-4 text-muted-foreground" />
                  <CardTitle className="text-sm font-medium text-card-foreground">
                    How This Decision Was Made
                  </CardTitle>
                </div>
                {isExplanationOpen ? (
                  <ChevronUp className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-4 border-t border-border pt-4">
              <div>
                <h4 className="mb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Decision Rule
                </h4>
                <p className="text-sm text-foreground">{result.decisionExplanation.rule}</p>
              </div>

              <div>
                <h4 className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Factors Considered
                </h4>
                <ul className="space-y-1">
                  {result.decisionExplanation.factors.map((factor, i) => (
                    <li key={i} className="text-sm text-muted-foreground">
                      • {factor}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="mb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Data Source
                </h4>
                <p className="text-sm text-foreground">{result.decisionExplanation.source}</p>
              </div>

              <div className="rounded-lg bg-secondary p-4">
                <h4 className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Kenya-Specific Assumptions & Limitations
                </h4>
                <ul className="space-y-1">
                  {result.limitations.map((limitation, i) => (
                    <li key={i} className="text-sm text-muted-foreground">
                      • {limitation}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Footer */}
      <div className="flex justify-center pt-4">
        <Button variant="outline" onClick={onReset} className="gap-2 bg-transparent">
          <ArrowLeft className="h-4 w-4" />
          Search Another Service
        </Button>
      </div>
    </div>
  )
}
