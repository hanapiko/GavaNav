import type { ServiceRequest, ServiceResult } from "./types"

const SERVICE_DATA: Record<string, Partial<ServiceResult>> = {
  "national-id": {
    serviceName: "National ID (Huduma Namba)",
    cost: {
      amount: "KES 1,000",
      breakdown: [
        { item: "Application fee", cost: "KES 500" },
        { item: "Card production", cost: "KES 500" },
      ],
      isRuleBased: true,
    },
    processingTime: {
      standard: "30-60 working days",
      expedited: "14 working days (additional KES 3,000)",
      isRuleBased: true,
    },
    requiredDocuments: {
      items: [
        { name: "Original Birth Certificate", required: true },
        { name: "Parent's ID (if under 18)", required: false, note: "Required for minors" },
        { name: "School Leaving Certificate", required: false, note: "For those who attended school" },
        { name: "Chief's Letter", required: true, note: "Confirming your identity and residence" },
        { name: "Passport Photos (2)", required: true, note: "Passport-size, white background" },
      ],
      isRuleBased: true,
    },
    processSteps: {
      steps: [
        { step: 1, title: "Gather Documents", description: "Collect all required documents listed above" },
        { step: 2, title: "Visit Huduma Centre", description: "Go to your nearest Huduma Centre with all documents", location: "Huduma Centre" },
        { step: 3, title: "Fill Application Form", description: "Complete the ID application form at the centre" },
        { step: 4, title: "Biometric Capture", description: "Have your fingerprints and photo taken" },
        { step: 5, title: "Pay Fees", description: "Pay the required fees via M-Pesa or cash" },
        { step: 6, title: "Collect Receipt", description: "Keep your receipt for tracking and collection" },
        { step: 7, title: "Wait for SMS", description: "You'll receive an SMS when your ID is ready" },
        { step: 8, title: "Collect ID", description: "Return to the Huduma Centre to collect your ID" },
      ],
      isRuleBased: true,
    },
    aiGuidance: {
      explanation: "The National ID is your primary identification document in Kenya. It's required for voting, opening bank accounts, SIM card registration, and accessing most government services. The Huduma Namba integrates with the digital ID system.",
      tips: [
        "Apply early - processing can take longer during peak periods",
        "Ensure your birth certificate details match exactly what you'll provide",
        "Visit the Huduma Centre early in the morning to avoid long queues",
        "You can track your application status via the Huduma Kenya app",
      ],
      warnings: [
        "Incorrect information may delay your application significantly",
        "Lost receipt means you may have difficulty tracking or collecting your ID",
      ],
      isAIGenerated: true,
    },
    limitations: [
      "Processing times may vary based on demand and system availability",
      "Fees are subject to change by government directive",
      "Some documents may require additional verification",
    ],
  },
  "nhif": {
    serviceName: "NHIF Registration",
    cost: {
      amount: "KES 500/month (minimum)",
      breakdown: [
        { item: "Registration fee", cost: "Free" },
        { item: "Monthly contribution", cost: "KES 500-1,700 (based on income)" },
      ],
      isRuleBased: true,
    },
    processingTime: {
      standard: "Immediate registration, 60-day waiting period for coverage",
      isRuleBased: true,
    },
    requiredDocuments: {
      items: [
        { name: "National ID", required: true },
        { name: "Passport Photo (1)", required: true },
        { name: "KRA PIN Certificate", required: false, note: "For formal sector employees" },
        { name: "Pay Slip", required: false, note: "For formal sector employees" },
      ],
      isRuleBased: true,
    },
    processSteps: {
      steps: [
        { step: 1, title: "Gather Documents", description: "Collect your National ID and passport photo" },
        { step: 2, title: "Register Online or Visit Office", description: "Register at nhif.or.ke or visit nearest NHIF office" },
        { step: 3, title: "Fill Application Form", description: "Complete the member registration form" },
        { step: 4, title: "Make First Payment", description: "Pay your first month's contribution via M-Pesa" },
        { step: 5, title: "Receive Membership Card", description: "Your card will be sent to you or available for collection" },
      ],
      isRuleBased: true,
    },
    aiGuidance: {
      explanation: "NHIF provides health insurance coverage for Kenyans, covering inpatient and outpatient services at accredited facilities. As of 2024, NHIF is transitioning to SHIF (Social Health Insurance Fund) under the new healthcare reforms.",
      tips: [
        "You can register dependents (spouse and children under 25) at no extra cost",
        "Pay consistently to maintain active coverage",
        "Use USSD code *155# for easy registration and payments",
        "Check facility accreditation before seeking treatment",
      ],
      warnings: [
        "There's a 60-day waiting period before you can use benefits",
        "Late payments may result in penalties and coverage gaps",
      ],
      isAIGenerated: true,
    },
    limitations: [
      "NHIF is transitioning to SHIF - some processes may change",
      "Coverage limits apply to certain treatments",
      "Not all facilities accept NHIF",
    ],
  },
  "driving-license": {
    serviceName: "Driving License",
    cost: {
      amount: "KES 3,050",
      breakdown: [
        { item: "Interim license", cost: "KES 600" },
        { item: "Theory test", cost: "KES 400" },
        { item: "Practical test", cost: "KES 800" },
        { item: "Smart driving license", cost: "KES 1,250" },
      ],
      isRuleBased: true,
    },
    processingTime: {
      standard: "2-4 weeks after passing tests",
      isRuleBased: true,
    },
    requiredDocuments: {
      items: [
        { name: "National ID", required: true },
        { name: "KRA PIN Certificate", required: true },
        { name: "Passport Photos (2)", required: true },
        { name: "Medical Certificate", required: true, note: "From a registered medical practitioner" },
        { name: "Driving School Certificate", required: true, note: "From NTSA-approved driving school" },
      ],
      isRuleBased: true,
    },
    processSteps: {
      steps: [
        { step: 1, title: "Enroll in Driving School", description: "Join an NTSA-approved driving school for training" },
        { step: 2, title: "Get Medical Certificate", description: "Visit a registered clinic for medical examination" },
        { step: 3, title: "Apply via NTSA Portal", description: "Create account and apply at ntsa.go.ke/tims" },
        { step: 4, title: "Pay for Interim License", description: "Pay KES 600 for the interim driving license" },
        { step: 5, title: "Book Theory Test", description: "Schedule your theory test via TIMS portal" },
        { step: 6, title: "Pass Theory Test", description: "Score at least 50% on the road signs and rules test" },
        { step: 7, title: "Book Practical Test", description: "After passing theory, book your practical test" },
        { step: 8, title: "Pass Practical Test", description: "Demonstrate driving competency to the examiner" },
        { step: 9, title: "Apply for Smart DL", description: "Apply and pay for your smart driving license" },
        { step: 10, title: "Collect Smart DL", description: "Pick up from the NTSA office when ready" },
      ],
      isRuleBased: true,
    },
    aiGuidance: {
      explanation: "The driving license is issued by NTSA (National Transport and Safety Authority) and is required to legally operate motor vehicles in Kenya. The smart driving license has a 3-year validity for first issuance.",
      tips: [
        "Practice extensively before taking the practical test",
        "The theory test covers road signs, traffic rules, and basic vehicle knowledge",
        "Book tests early as slots fill up quickly",
        "You can track your license status on the TIMS portal",
      ],
      warnings: [
        "Driving without a valid license is a criminal offense",
        "Ensure your driving school is NTSA-approved to avoid issues",
        "The interim license is only valid for 6 months",
      ],
      isAIGenerated: true,
    },
    limitations: [
      "Test availability varies by location",
      "Processing times may be longer in busy periods",
      "Additional classes may be required before re-testing if you fail",
    ],
  },
  "passport": {
    serviceName: "Kenyan Passport",
    cost: {
      amount: "KES 4,550 (32 pages) / KES 6,050 (48 pages)",
      breakdown: [
        { item: "32-page passport", cost: "KES 4,550" },
        { item: "48-page passport", cost: "KES 6,050" },
        { item: "Express processing", cost: "+KES 5,000" },
        { item: "East African passport (optional)", cost: "KES 4,550" },
      ],
      isRuleBased: true,
    },
    processingTime: {
      standard: "10-15 working days",
      expedited: "3-5 working days (additional KES 5,000)",
      isRuleBased: true,
    },
    requiredDocuments: {
      items: [
        { name: "National ID (Original & Copy)", required: true },
        { name: "Birth Certificate (Original & Copy)", required: true },
        { name: "Passport Photos (2)", required: true, note: "Passport-size, white background" },
        { name: "Old Passport", required: false, note: "For renewals - must be returned" },
        { name: "Recommendation Letter", required: false, note: "For first-time applicants" },
      ],
      isRuleBased: true,
    },
    processSteps: {
      steps: [
        { step: 1, title: "Create eCitizen Account", description: "Register at ecitizen.go.ke if you don't have an account" },
        { step: 2, title: "Fill Application", description: "Complete the passport application form online" },
        { step: 3, title: "Pay Fees", description: "Pay via M-Pesa, bank, or card on eCitizen" },
        { step: 4, title: "Book Appointment", description: "Schedule your biometrics capture appointment" },
        { step: 5, title: "Visit Immigration Office", description: "Bring all documents for verification and biometrics" },
        { step: 6, title: "Track Application", description: "Monitor status via eCitizen portal" },
        { step: 7, title: "Collect Passport", description: "Pick up at the immigration office or selected Huduma Centre" },
      ],
      isRuleBased: true,
    },
    aiGuidance: {
      explanation: "The Kenyan e-Passport is a biometric travel document that meets international standards. It's valid for 10 years for adults and 5 years for children under 18.",
      tips: [
        "Apply at least 3 weeks before travel to allow for processing",
        "The 48-page passport is recommended for frequent travelers",
        "You can apply for East African passport for travel within EAC",
        "Keep a copy of your receipt for tracking",
      ],
      warnings: [
        "Passport photos must meet strict specifications",
        "Applications may be rejected for inconsistent information",
        "Old passports must be surrendered for renewal applications",
      ],
      isAIGenerated: true,
    },
    limitations: [
      "Express processing subject to availability",
      "Some Huduma Centres may not offer passport collection",
      "Peak travel seasons may result in longer processing times",
    ],
  },
  "birth-certificate": {
    serviceName: "Birth Certificate",
    cost: {
      amount: "KES 150 (first copy) / KES 500 (replacement)",
      breakdown: [
        { item: "First registration (within 6 months)", cost: "Free" },
        { item: "Late registration fee", cost: "KES 150" },
        { item: "Replacement copy", cost: "KES 500" },
      ],
      isRuleBased: true,
    },
    processingTime: {
      standard: "7-14 working days",
      isRuleBased: true,
    },
    requiredDocuments: {
      items: [
        { name: "Notification of Birth", required: true, note: "From hospital/midwife" },
        { name: "Parents' IDs", required: true },
        { name: "Parents' Birth Certificates", required: false },
        { name: "Marriage Certificate", required: false, note: "If parents are married" },
        { name: "Affidavit", required: false, note: "For late registration" },
      ],
      isRuleBased: true,
    },
    processSteps: {
      steps: [
        { step: 1, title: "Get Birth Notification", description: "Obtain from hospital, clinic, or midwife who attended the birth" },
        { step: 2, title: "Visit Civil Registration", description: "Go to county civil registration office" },
        { step: 3, title: "Complete Form B1", description: "Fill birth registration form with all details" },
        { step: 4, title: "Submit Documents", description: "Provide all required documents for verification" },
        { step: 5, title: "Pay Fees", description: "Pay applicable fees if late registration" },
        { step: 6, title: "Collect Certificate", description: "Return to collect the birth certificate" },
      ],
      isRuleBased: true,
    },
    aiGuidance: {
      explanation: "Birth registration is a constitutional right in Kenya. A birth certificate is essential for school enrollment, passport applications, and proving citizenship. Registration should be done within 6 months of birth.",
      tips: [
        "Register within 6 months to avoid late registration fees",
        "Ensure the birth notification has correct spelling of names",
        "Both parents should be present if possible",
        "You can now apply online via eCitizen for some services",
      ],
      warnings: [
        "Late registration (after 6 months) requires additional documentation",
        "Incorrect information may cause issues with other documents later",
      ],
      isAIGenerated: true,
    },
    limitations: [
      "Processing times vary by county",
      "Some counties may require additional local verification",
      "Online services may not be available in all regions",
    ],
  },
  "kra-pin": {
    serviceName: "KRA PIN Registration",
    cost: {
      amount: "Free",
      breakdown: [
        { item: "Individual PIN registration", cost: "Free" },
        { item: "PIN certificate printing", cost: "Free" },
      ],
      isRuleBased: true,
    },
    processingTime: {
      standard: "Immediate (online)",
      isRuleBased: true,
    },
    requiredDocuments: {
      items: [
        { name: "National ID", required: true },
        { name: "Email Address", required: true },
        { name: "Phone Number", required: true },
        { name: "Postal Address", required: true },
      ],
      isRuleBased: true,
    },
    processSteps: {
      steps: [
        { step: 1, title: "Visit iTax Portal", description: "Go to itax.kra.go.ke" },
        { step: 2, title: "Select New PIN Registration", description: "Click on 'New PIN Registration' option" },
        { step: 3, title: "Fill Application Form", description: "Complete all required fields accurately" },
        { step: 4, title: "Upload Documents", description: "Upload ID scan if required" },
        { step: 5, title: "Submit Application", description: "Review and submit your application" },
        { step: 6, title: "Receive PIN", description: "Download your PIN certificate immediately" },
      ],
      isRuleBased: true,
    },
    aiGuidance: {
      explanation: "The KRA PIN is required for all tax-related transactions in Kenya, including employment, business registration, importing goods, and property transactions. Every adult Kenyan should have one.",
      tips: [
        "Keep your PIN certificate safe - you'll need it often",
        "Update your details on iTax when they change",
        "File nil returns if you have no income to declare",
        "Use KRA's Telegram bot or USSD for quick services",
      ],
      warnings: [
        "Never share your iTax password with anyone",
        "File returns by June 30th each year to avoid penalties",
        "Dormant PINs may be deactivated",
      ],
      isAIGenerated: true,
    },
    limitations: [
      "Portal may experience downtime during peak filing periods",
      "Some corrections may require visiting a KRA office",
      "Foreigners may need additional documentation",
    ],
  },
}

const COUNTY_OFFICES: Record<string, { huduma: string; immigration: string; ntsa: string }> = {
  Nairobi: {
    huduma: "Huduma Centre, GPO Building, Kenyatta Avenue",
    immigration: "Nyayo House, Kenyatta Avenue",
    ntsa: "NTSA Times Tower, Haile Selassie Avenue",
  },
  Mombasa: {
    huduma: "Huduma Centre, Uhuru na Kazi Building, Moi Avenue",
    immigration: "Immigration Office, Treasury Square",
    ntsa: "NTSA Office, Mombasa",
  },
  Kisumu: {
    huduma: "Huduma Centre, Mega Plaza, Oginga Odinga Street",
    immigration: "Immigration Office, Kisumu",
    ntsa: "NTSA Office, Kisumu",
  },
  Nakuru: {
    huduma: "Huduma Centre, Nakuru",
    immigration: "Immigration Office, Nakuru",
    ntsa: "NTSA Office, Nakuru",
  },
}

function getOfficeForService(county: string, service: string): string {
  const offices = COUNTY_OFFICES[county] || COUNTY_OFFICES.Nairobi
  
  if (service === "passport") return offices.immigration
  if (service === "driving-license" || service === "vehicle-registration") return offices.ntsa
  return offices.huduma
}

export function getServiceDetails(request: ServiceRequest): ServiceResult {
  const baseData = SERVICE_DATA[request.service] || SERVICE_DATA["national-id"]
  const officeAddress = getOfficeForService(request.county, request.service)
  
  // Determine eligibility based on request
  let eligibilityStatus: "eligible" | "conditionally_eligible" | "not_eligible" = "eligible"
  const conditions: string[] = []
  
  if (request.residency === "foreign") {
    eligibilityStatus = "not_eligible"
    conditions.push("This service is only available to Kenyan citizens and residents")
  } else if (request.residency === "resident") {
    eligibilityStatus = "conditionally_eligible"
    conditions.push("Additional documentation may be required for permanent residents")
  }
  
  if (request.age === "under-18" && ["driving-license", "passport", "kra-pin"].includes(request.service)) {
    if (request.service === "driving-license") {
      eligibilityStatus = "not_eligible"
      conditions.push("You must be at least 18 years old to apply for a driving license")
    } else {
      eligibilityStatus = "conditionally_eligible"
      conditions.push("Parental consent and accompanying documents required for minors")
    }
  }
  
  if (conditions.length === 0) {
    conditions.push("You meet the basic eligibility requirements for this service")
  }

  return {
    serviceName: baseData.serviceName!,
    county: request.county,
    location: {
      office: getOfficeNameForService(request.service),
      address: officeAddress,
      hours: "Monday - Friday, 8:00 AM - 5:00 PM",
      phone: "+254 20 222 2222",
      isRuleBased: true,
    },
    cost: baseData.cost!,
    processingTime: baseData.processingTime!,
    requiredDocuments: baseData.requiredDocuments!,
    eligibility: {
      status: eligibilityStatus,
      conditions,
      isRuleBased: true,
    },
    processSteps: baseData.processSteps!,
    aiGuidance: baseData.aiGuidance!,
    decisionExplanation: {
      rule: "Service requirements determined by Immigration and Registration of Persons Department guidelines",
      factors: [
        `County: ${request.county}`,
        `Age category: ${request.age}`,
        `Residency status: ${request.residency}`,
        `Application type: ${request.applicationType}`,
      ],
      source: "Kenya Government Services Directory 2024",
    },
    limitations: baseData.limitations!,
  }
}

function getOfficeNameForService(service: string): string {
  switch (service) {
    case "passport":
      return "Immigration Department"
    case "driving-license":
    case "vehicle-registration":
      return "NTSA Office"
    case "nhif":
      return "NHIF Office / Huduma Centre"
    case "kra-pin":
      return "Online (iTax Portal)"
    default:
      return "Huduma Centre"
  }
}
