export interface ServiceRequest {
  county: string
  service: string
  age: string
  residency: string
  applicationType: string
}

export interface DocumentItem {
  name: string
  required: boolean
  note?: string
}

export interface ProcessStep {
  step: number
  title: string
  description: string
  location?: string
}

export interface DecisionExplanation {
  rule: string
  factors: string[]
  source: string
}

export interface ServiceResult {
  serviceName: string
  county: string
  location: {
    office: string
    address: string
    hours: string
    phone: string
    isRuleBased: true
  }
  cost: {
    amount: string
    breakdown: { item: string; cost: string }[]
    isRuleBased: true
  }
  processingTime: {
    standard: string
    expedited?: string
    isRuleBased: true
  }
  requiredDocuments: {
    items: DocumentItem[]
    isRuleBased: true
  }
  eligibility: {
    status: "eligible" | "conditionally_eligible" | "not_eligible"
    conditions: string[]
    isRuleBased: true
  }
  processSteps: {
    steps: ProcessStep[]
    isRuleBased: true
  }
  aiGuidance: {
    explanation: string
    tips: string[]
    warnings: string[]
    isAIGenerated: true
  }
  decisionExplanation: DecisionExplanation
  limitations: string[]
}

export const KENYA_COUNTIES = [
  "Nairobi",
  "Mombasa",
  "Kisumu",
  "Nakuru",
  "Kiambu",
  "Machakos",
  "Kajiado",
  "Uasin Gishu",
  "Kilifi",
  "Nyeri",
  "Kakamega",
  "Meru",
  "Kwale",
  "Migori",
  "Bungoma",
  "Kericho",
  "Trans Nzoia",
  "Nandi",
  "Narok",
  "Bomet",
  "Laikipia",
  "Turkana",
  "Garissa",
  "Mandera",
  "Wajir",
  "Marsabit",
  "Isiolo",
  "Samburu",
  "West Pokot",
  "Baringo",
  "Elgeyo Marakwet",
  "Tana River",
  "Lamu",
  "Taita Taveta",
  "Embu",
  "Tharaka Nithi",
  "Kitui",
  "Makueni",
  "Nyandarua",
  "Murang'a",
  "Kirinyaga",
  "Homa Bay",
  "Siaya",
  "Kisii",
  "Nyamira",
  "Vihiga",
  "Busia",
] as const

export const PUBLIC_SERVICES = [
  { id: "national-id", name: "National ID (Huduma Namba)", category: "Identity" },
  { id: "passport", name: "Kenyan Passport", category: "Identity" },
  { id: "birth-certificate", name: "Birth Certificate", category: "Civil Registration" },
  { id: "death-certificate", name: "Death Certificate", category: "Civil Registration" },
  { id: "nhif", name: "NHIF Registration", category: "Health" },
  { id: "nssf", name: "NSSF Registration", category: "Social Security" },
  { id: "driving-license", name: "Driving License", category: "Transport" },
  { id: "vehicle-registration", name: "Vehicle Registration", category: "Transport" },
  { id: "kra-pin", name: "KRA PIN Registration", category: "Tax" },
  { id: "business-permit", name: "Business Permit", category: "Business" },
  { id: "title-deed", name: "Title Deed", category: "Land" },
  { id: "marriage-certificate", name: "Marriage Certificate", category: "Civil Registration" },
] as const

export const AGE_RANGES = [
  { id: "under-18", label: "Under 18 years" },
  { id: "18-35", label: "18-35 years" },
  { id: "36-60", label: "36-60 years" },
  { id: "over-60", label: "Over 60 years" },
] as const

export const RESIDENCY_TYPES = [
  { id: "citizen", label: "Kenyan Citizen" },
  { id: "dual", label: "Dual Citizen" },
  { id: "resident", label: "Permanent Resident" },
  { id: "foreign", label: "Foreign National" },
] as const

export const APPLICATION_TYPES = [
  { id: "new", label: "New Application" },
  { id: "renewal", label: "Renewal" },
  { id: "replacement", label: "Replacement (Lost/Damaged)" },
  { id: "correction", label: "Correction/Amendment" },
] as const
