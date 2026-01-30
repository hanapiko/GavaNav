import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { PrismaService } from '../prisma/prisma.service';

export interface ChatRequest {
    message: string;
    userId: string;
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
}

@Injectable()
export class AgentService {
    private readonly logger = new Logger(AgentService.name);
    private readonly agentUrl = 'http://localhost:8000/chat';

    constructor(private readonly prisma: PrismaService) { }

    async chat(request: ChatRequest): Promise<ChatResponse> {
        const { message, userId } = request;

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

            // Save user message
            await this.prisma.chatMessage.create({
                data: {
                    role: 'user',
                    content: message,
                    userId: user.id,
                },
            });

            // Send request to AI agent
            const response = await axios.post<ChatResponse>(this.agentUrl, {
                message,
                userId,
            });

            const agentResponse = response.data;

            // Save assistant response with metadata
            await this.prisma.chatMessage.create({
                data: {
                    role: 'assistant',
                    content: agentResponse.reply,
                    metadata: {
                        checklist: agentResponse.checklist || [],
                        explanation: agentResponse.explanation || null,
                    },
                    userId: user.id,
                },
            });

            return agentResponse;
        } catch (error) {
            this.logger.error('Failed to communicate with AI agent', error);

            // Return a fallback response when AI agent is unavailable
            const fallbackResponse: ChatResponse = {
                reply: "I'm currently unable to process your request. The AI agent service is unavailable. Please try again later.",
                checklist: [
                    { id: '1', text: 'Check if the AI agent service is running on port 8000', completed: false },
                    { id: '2', text: 'Verify network connectivity', completed: false },
                ],
                explanation: 'This is a fallback response. The actual AI agent at http://localhost:8000/chat could not be reached.',
            };

            // Still save the user message even if AI fails
            try {
                await this.prisma.chatMessage.create({
                    data: {
                        role: 'user',
                        content: message,
                        userId,
                    },
                });

                await this.prisma.chatMessage.create({
                    data: {
                        role: 'assistant',
                        content: fallbackResponse.reply,
                        metadata: {
                            checklist: fallbackResponse.checklist,
                            explanation: fallbackResponse.explanation,
                        },
                        userId,
                    },
                });
            } catch (dbError) {
                this.logger.error('Failed to save messages to database', dbError);
            }

            return fallbackResponse;
        }
    }

    async getChatHistory(userId: string) {
        return this.prisma.chatMessage.findMany({
            where: { userId },
            orderBy: { createdAt: 'asc' },
        });
    }
}
