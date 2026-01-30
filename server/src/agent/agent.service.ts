import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface ChatRequest {
    message: string;
    userId: string;
    sessionId?: string;
}

export interface ChecklistItem {
    id: string;
    text: string;
    completed: boolean;
}

export interface ChatResponse {
    reply: string;
    checklist?: ChecklistItem[];
    explanation?: string;
    sessionId?: string;
}

export interface CreateSessionRequest {
    userId: string;
    title?: string;
}

// Mock response data for different government services
const MOCK_RESPONSES: Record<string, ChatResponse> = {
    passport: {
        reply: "To renew or apply for a Kenyan passport, you'll need to visit the nearest Immigration office or use the eCitizen portal. The process typically takes 10-14 working days for regular processing.",
        checklist: [
            { id: '1', text: 'Original and copy of current/old passport', completed: false },
            { id: '2', text: 'Copy of National ID (both sides)', completed: false },
            { id: '3', text: 'Two recent passport-size photos (white background)', completed: false },
            { id: '4', text: 'Completed application form from eCitizen', completed: false },
            { id: '5', text: 'Payment receipt (KES 4,550 for ordinary, KES 6,050 for East African)', completed: false },
        ],
        explanation: 'The passport renewal process in Kenya has been digitized through the eCitizen platform. You can start your application online, make payments via M-Pesa, and then visit the Immigration office for biometric capture. Processing time is 10-14 working days for regular service, or 2-3 days for express service at an additional fee.',
    },
    tax: {
        reply: "For tax filing in Kenya, you need to file your returns through the iTax portal by June 30th each year. Here's what you'll need to prepare for your annual tax return.",
        checklist: [
            { id: '1', text: 'KRA PIN Certificate', completed: false },
            { id: '2', text: 'P9 Form from employer (for employed individuals)', completed: false },
            { id: '3', text: 'Bank statements for interest income', completed: false },
            { id: '4', text: 'Rental income records (if applicable)', completed: false },
            { id: '5', text: 'Business income records (if self-employed)', completed: false },
            { id: '6', text: 'Insurance premium certificates for relief claims', completed: false },
        ],
        explanation: 'All Kenyan taxpayers must file annual returns by June 30th. Even if you have no taxable income (nil returns), you must still file. Late filing attracts penalties of KES 2,000 per month or 5% of tax due, whichever is higher. Use the iTax portal at itax.kra.go.ke to file online.',
    },
    driver: {
        reply: "To obtain or renew a Kenyan driving license, you'll need to apply through NTSA (National Transport and Safety Authority). New applicants must complete a driving course at a certified driving school.",
        checklist: [
            { id: '1', text: 'Original National ID', completed: false },
            { id: '2', text: 'Certificate from approved driving school (new applicants)', completed: false },
            { id: '3', text: 'Medical certificate from approved doctor', completed: false },
            { id: '4', text: 'Two passport-size photos', completed: false },
            { id: '5', text: 'Current license (for renewal)', completed: false },
            { id: '6', text: 'Payment of KES 600 (Class B) to KES 3,050 (multiple classes)', completed: false },
        ],
        explanation: 'The driving license application is done through TIMS (Transport Integrated Management System). First-time applicants must pass both theory and practical tests. Licenses are valid for 3 years. You can apply for renewal up to 6 months before expiry. Smart card licenses are now standard, replacing the old booklet format.',
    },
    business: {
        reply: "To register a business in Kenya, you can use the eCitizen portal for a seamless process. The type of registration depends on your business structure - sole proprietorship, partnership, or limited company.",
        checklist: [
            { id: '1', text: 'Reserve business name on eCitizen (KES 150)', completed: false },
            { id: '2', text: 'Prepare Memorandum and Articles of Association (for companies)', completed: false },
            { id: '3', text: 'Directors\' ID copies and passport photos', completed: false },
            { id: '4', text: 'KRA PIN for all directors/partners', completed: false },
            { id: '5', text: 'Physical address proof (utility bill or lease agreement)', completed: false },
            { id: '6', text: 'Pay registration fee (KES 10,650 for private limited company)', completed: false },
            { id: '7', text: 'Apply for business permit from county government', completed: false },
        ],
        explanation: 'Business registration in Kenya is done through the Business Registration Service (BRS) via eCitizen. A sole proprietorship is the simplest (KES 950), while a private limited company offers liability protection (KES 10,650). After registration, you\'ll need a KRA PIN for the business, NHIF and NSSF registration for employees, and a single business permit from your county.',
    },
    id: {
        reply: "To apply for a Kenyan National ID (for first-time applicants or replacements), you'll need to visit the Huduma Centre or your local registration office. The process has been streamlined with the introduction of Huduma Namba.",
        checklist: [
            { id: '1', text: 'Birth certificate (original and copy)', completed: false },
            { id: '2', text: 'Parents\' ID copies (both mother and father)', completed: false },
            { id: '3', text: 'School leaving certificate or letter', completed: false },
            { id: '4', text: 'Two passport-size photos (for replacement)', completed: false },
            { id: '5', text: 'Police abstract (for lost ID replacement)', completed: false },
            { id: '6', text: 'Waiting card/acknowledgment slip', completed: false },
        ],
        explanation: 'First-time ID applicants must be at least 18 years old (or 12 years for early registration). The application is free for first-time applicants. For replacements, a fee of KES 100 applies. Processing typically takes 2-4 weeks. You can track your ID status through the Huduma Kenya portal or by sending your waiting card number via SMS.',
    },
    huduma: {
        reply: "Huduma Centres are one-stop shops for government services in Kenya. You can access over 50 services including ID applications, passport services, KRA services, and more.",
        checklist: [
            { id: '1', text: 'Check operating hours (Mon-Fri 8am-5pm, Sat 8am-1pm)', completed: false },
            { id: '2', text: 'Book appointment online (optional but recommended)', completed: false },
            { id: '3', text: 'Bring all required documents for your service', completed: false },
            { id: '4', text: 'Carry cash or mobile money for any fees', completed: false },
        ],
        explanation: 'Huduma Centres have locations across all 47 counties. Major centres include GPO Nairobi, Mombasa, Kisumu, and Nakuru. Services include: ID applications, Birth/Death certificates, KRA PIN registration, NHIF/NSSF registration, Good conduct certificates, Passport applications, and more. Check hudumakenya.go.ke for the nearest location.',
    },
    default: {
        reply: "I can help you navigate various Kenyan government services. I have information about passports, national IDs, tax filing, driving licenses, business registration, and Huduma Centre services. What specific service would you like to know more about?",
        checklist: [
            { id: '1', text: 'Passport services (application, renewal)', completed: false },
            { id: '2', text: 'National ID (first-time, replacement)', completed: false },
            { id: '3', text: 'Tax filing (KRA iTax)', completed: false },
            { id: '4', text: 'Driving license (NTSA TIMS)', completed: false },
            { id: '5', text: 'Business registration (eCitizen)', completed: false },
            { id: '6', text: 'Huduma Centre services', completed: false },
        ],
        explanation: 'GavaNav is your AI assistant for navigating Kenyan government services. Most services are available online through platforms like eCitizen (ecitizen.go.ke), iTax (itax.kra.go.ke), and TIMS (tims.ntsa.go.ke). For in-person services, Huduma Centres provide a convenient one-stop experience.',
    },
};

@Injectable()
export class AgentService {
    private readonly logger = new Logger(AgentService.name);

    constructor(private readonly prisma: PrismaService) { }

    /**
     * Generate a mock response based on the user's message
     */
    private generateMockResponse(message: string): ChatResponse {
        const lowerMessage = message.toLowerCase();

        if (lowerMessage.includes('passport')) {
            return MOCK_RESPONSES.passport;
        }
        if (lowerMessage.includes('tax') || lowerMessage.includes('kra') || lowerMessage.includes('itax') || lowerMessage.includes('filing')) {
            return MOCK_RESPONSES.tax;
        }
        if (lowerMessage.includes('driver') || lowerMessage.includes('license') || lowerMessage.includes('driving') || lowerMessage.includes('ntsa')) {
            return MOCK_RESPONSES.driver;
        }
        if (lowerMessage.includes('business') || lowerMessage.includes('register') || lowerMessage.includes('company') || lowerMessage.includes('incorporation')) {
            return MOCK_RESPONSES.business;
        }
        if (lowerMessage.includes('id') || lowerMessage.includes('national id') || lowerMessage.includes('identity')) {
            return MOCK_RESPONSES.id;
        }
        if (lowerMessage.includes('huduma') || lowerMessage.includes('one stop') || lowerMessage.includes('government office')) {
            return MOCK_RESPONSES.huduma;
        }

        return MOCK_RESPONSES.default;
    }

    /**
     * Generate a session title from the first message
     */
    private generateSessionTitle(message: string): string {
        const lowerMessage = message.toLowerCase();

        if (lowerMessage.includes('passport')) return 'Passport Services';
        if (lowerMessage.includes('tax') || lowerMessage.includes('kra')) return 'Tax Filing Help';
        if (lowerMessage.includes('driver') || lowerMessage.includes('license')) return 'Driver\'s License';
        if (lowerMessage.includes('business') || lowerMessage.includes('company')) return 'Business Registration';
        if (lowerMessage.includes('id') || lowerMessage.includes('identity')) return 'National ID';
        if (lowerMessage.includes('huduma')) return 'Huduma Centre';

        // Truncate and use first part of message as title
        const words = message.split(' ').slice(0, 4).join(' ');
        return words.length > 30 ? words.substring(0, 30) + '...' : words;
    }

    async chat(request: ChatRequest): Promise<ChatResponse> {
        const { message, userId, sessionId } = request;

        try {
            // Ensure user exists or create one
            let user = await this.prisma.user.findUnique({
                where: { id: userId },
            });

            if (!user) {
                user = await this.prisma.user.create({
                    data: {
                        id: userId,
                        phoneNumber: `placeholder-${userId}`,
                    },
                });
            }

            // Create or get session
            let currentSessionId = sessionId;
            if (!currentSessionId) {
                // Create a new session with auto-generated title
                const session = await this.prisma.chatSession.create({
                    data: {
                        userId: user.id,
                        title: this.generateSessionTitle(message),
                    },
                });
                currentSessionId = session.id;
            }

            // Save user message
            await this.prisma.chatMessage.create({
                data: {
                    role: 'user',
                    content: message,
                    userId: user.id,
                    sessionId: currentSessionId,
                },
            });

            // Generate mock response
            const mockResponse = this.generateMockResponse(message);

            // Save assistant response with metadata
            await this.prisma.chatMessage.create({
                data: {
                    role: 'assistant',
                    content: mockResponse.reply,
                    metadata: JSON.stringify({
                        checklist: mockResponse.checklist || [],
                        explanation: mockResponse.explanation || null,
                    }),
                    userId: user.id,
                    sessionId: currentSessionId,
                },
            });

            this.logger.log(`Chat processed for user ${userId}, session ${currentSessionId}`);

            return {
                ...mockResponse,
                sessionId: currentSessionId,
            };
        } catch (error) {
            this.logger.error('Failed to process chat', error);
            throw error;
        }
    }

    async getChatHistory(userId: string) {
        return this.prisma.chatMessage.findMany({
            where: { userId },
            orderBy: { createdAt: 'asc' },
        });
    }

    // Session Management Methods

    async getSessions(userId: string) {
        return this.prisma.chatSession.findMany({
            where: { userId },
            orderBy: { updatedAt: 'desc' },
            include: {
                messages: {
                    take: 1,
                    orderBy: { createdAt: 'desc' },
                    select: { content: true },
                },
            },
        });
    }

    async createSession(request: CreateSessionRequest) {
        const { userId, title } = request;

        // Ensure user exists
        let user = await this.prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            user = await this.prisma.user.create({
                data: {
                    id: userId,
                    phoneNumber: `placeholder-${userId}`,
                },
            });
        }

        return this.prisma.chatSession.create({
            data: {
                userId,
                title: title || 'New Chat',
            },
        });
    }

    async deleteSession(sessionId: string) {
        // Messages will be cascade deleted due to schema relation
        return this.prisma.chatSession.delete({
            where: { id: sessionId },
        });
    }

    async getSessionMessages(sessionId: string) {
        return this.prisma.chatMessage.findMany({
            where: { sessionId },
            orderBy: { createdAt: 'asc' },
        });
    }

    async getSession(sessionId: string) {
        return this.prisma.chatSession.findUnique({
            where: { id: sessionId },
            include: {
                messages: {
                    orderBy: { createdAt: 'asc' },
                },
            },
        });
    }
}
