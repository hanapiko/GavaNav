import { Controller, Post, Get, Delete, Body, Query, Param, HttpException, HttpStatus } from '@nestjs/common';
import { AgentService, ChatRequest, ChatResponse, CreateSessionRequest } from './agent.service';

class ChatDto {
    message: string;
    userId: string;
    sessionId?: string;
}

class CreateSessionDto {
    userId: string;
    title?: string;
}

@Controller()
export class AgentController {
    constructor(private readonly agentService: AgentService) { }

    @Post('chat')
    async chat(@Body() chatDto: ChatDto): Promise<ChatResponse> {
        const { message, userId, sessionId } = chatDto;

        if (!message || !userId) {
            throw new HttpException(
                'Both message and userId are required',
                HttpStatus.BAD_REQUEST,
            );
        }

        return this.agentService.chat({ message, userId, sessionId });
    }

    @Get('chat/history')
    async getChatHistory(@Query('userId') userId: string) {
        if (!userId) {
            throw new HttpException('userId is required', HttpStatus.BAD_REQUEST);
        }

        return this.agentService.getChatHistory(userId);
    }

    // Session Management Endpoints

    @Get('sessions')
    async getSessions(@Query('userId') userId: string) {
        if (!userId) {
            throw new HttpException('userId is required', HttpStatus.BAD_REQUEST);
        }

        const sessions = await this.agentService.getSessions(userId);

        // Transform to include preview from last message
        return sessions.map(session => ({
            id: session.id,
            title: session.title,
            preview: session.messages[0]?.content?.substring(0, 50) + '...' || 'No messages yet',
            createdAt: session.createdAt,
            updatedAt: session.updatedAt,
        }));
    }

    @Post('sessions')
    async createSession(@Body() createSessionDto: CreateSessionDto) {
        const { userId, title } = createSessionDto;

        if (!userId) {
            throw new HttpException('userId is required', HttpStatus.BAD_REQUEST);
        }

        return this.agentService.createSession({ userId, title });
    }

    @Get('sessions/:id')
    async getSession(@Param('id') sessionId: string) {
        if (!sessionId) {
            throw new HttpException('sessionId is required', HttpStatus.BAD_REQUEST);
        }

        const session = await this.agentService.getSession(sessionId);

        if (!session) {
            throw new HttpException('Session not found', HttpStatus.NOT_FOUND);
        }

        return session;
    }

    @Get('sessions/:id/messages')
    async getSessionMessages(@Param('id') sessionId: string) {
        if (!sessionId) {
            throw new HttpException('sessionId is required', HttpStatus.BAD_REQUEST);
        }

        return this.agentService.getSessionMessages(sessionId);
    }

    @Delete('sessions/:id')
    async deleteSession(@Param('id') sessionId: string) {
        if (!sessionId) {
            throw new HttpException('sessionId is required', HttpStatus.BAD_REQUEST);
        }

        try {
            await this.agentService.deleteSession(sessionId);
            return { success: true, message: 'Session deleted successfully' };
        } catch (error) {
            throw new HttpException('Failed to delete session', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}

