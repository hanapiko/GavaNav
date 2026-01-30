import { Controller, Post, Get, Body, Query, HttpException, HttpStatus } from '@nestjs/common';
import { AgentService, ChatRequest, ChatResponse } from './agent.service';

class ChatDto {
    message: string;
    userId: string;
}

@Controller()
export class AgentController {
    constructor(private readonly agentService: AgentService) { }

    @Post('chat')
    async chat(@Body() chatDto: ChatDto): Promise<ChatResponse> {
        const { message, userId } = chatDto;

        if (!message || !userId) {
            throw new HttpException(
                'Both message and userId are required',
                HttpStatus.BAD_REQUEST,
            );
        }

        return this.agentService.chat({ message, userId });
    }

    @Get('chat/history')
    async getChatHistory(@Query('userId') userId: string) {
        if (!userId) {
            throw new HttpException('userId is required', HttpStatus.BAD_REQUEST);
        }

        return this.agentService.getChatHistory(userId);
    }
}
