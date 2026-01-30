import { ServiceRequest, ServiceResult, PUBLIC_SERVICES } from "./types"

const API_URL = "http://localhost:8000/api/v1/agent"

export async function fetchServiceDetails(request: ServiceRequest): Promise<ServiceResult> {
    // 1. Map Frontend inputs to Backend strict types
    const serviceDef = PUBLIC_SERVICES.find(s => s.id === request.service) || PUBLIC_SERVICES[0]

    // Age mapping (heuristic)
    let age = 30 // Default
    if (request.age === "under-18") age = 16
    if (request.age === "18-35") age = 25
    if (request.age === "36-60") age = 45
    if (request.age === "over-60") age = 65

    // Citizenship mapping
    let citizenship = "kenyan_citizen"
    if (request.residency === "resident") citizenship = "resident"
    if (request.residency === "foreign") citizenship = "foreign_national"

    // App type mapping
    let appType = "first_time"
    if (request.applicationType === "renewal") appType = "renewal"
    if (request.applicationType === "replacement") appType = "replacement"

    const payload = {
        user_profile: {
            county: request.county,
            sub_county: "Central", // Default
            age: age,
            citizenship_status: citizenship,
            application_type: appType
        },
        service_request: {
            service_category: serviceDef.category.toLowerCase().replace(" ", "_"), // "Identity" -> "identity"
            service_name: serviceDef.name,
            urgency_level: "normal"
        },
        session_context: {
            language_preference: "en",
            device_type: "desktop",
            timestamp: new Date().toISOString()
        }
    }

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        })

        if (!response.ok) {
            const err = await response.json()
            throw new Error(err.detail || "API Error")
        }

        const data = await response.json()
        return mapBackendResponseToFrontend(data, request)

    } catch (error) {
        console.error("Agent API call failed:", error)
        throw error
    }
}

function mapBackendResponseToFrontend(data: any, originalReq: ServiceRequest): ServiceResult {
    // Map AgentResponse -> ServiceResult
    const sg = data.service_guidance.service_summary
    const sl = data.location_resolution.service_location.primary_office
    const ci = data.cost_and_time.cost_information
    const pt = data.cost_and_time.processing_time
    const re = data.requirements_and_eligibility.eligibility
    const docs = data.requirements_and_eligibility.required_documents
    const steps = data.application_steps.application_process.steps
    const ai = data.ai_guidance.ai_guidance
    const expl = data.explainability.decision_explanation

    return {
        serviceName: sg.service_name,
        county: sl.county,
        location: {
            office: sl.office_name,
            address: sl.address,
            hours: "8:00 AM - 5:00 PM", // Mock or default
            phone: "N/A",
            isRuleBased: true
        },
        cost: {
            amount: ci.official_fee_kes.toString(),
            breakdown: [{ item: "Official Fee", cost: ci.official_fee_kes.toString() }],
            isRuleBased: true
        },
        processingTime: {
            standard: `${pt.estimated_duration_days} days`,
            isRuleBased: true
        },
        requiredDocuments: {
            items: docs.map((d: any) => ({
                name: d.document_name,
                required: d.mandatory,
                note: d.notes
            })),
            isRuleBased: true
        },
        eligibility: {
            status: re.status,
            conditions: re.reasons,
            isRuleBased: true
        },
        processSteps: {
            steps: steps.map((s: any) => ({
                step: s.step_number,
                title: `Step ${s.step_number}`,
                description: s.instruction
            })),
            isRuleBased: true
        },
        aiGuidance: {
            explanation: ai.summary_explanation,
            tips: ai.tips_for_faster_processing,
            warnings: ai.common_mistakes,
            isAIGenerated: true
        },
        decisionExplanation: {
            rule: "Standard Procedure",
            factors: expl.rules_applied,
            source: expl.rule_sources[0] || "Government Data"
        },
        limitations: expl.limitations
    }
}
