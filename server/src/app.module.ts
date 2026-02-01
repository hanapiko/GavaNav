import { Module } from "@nestjs/common";
import { AgentModule } from "./agent/agent.module";
import { PrismaModule } from "./prisma/prisma.module";
import { GeminiModule } from "./gemini/gemini.module";
import { GeminiService } from "./gemini/gemini.service";
import { ConfigModule } from "@nestjs/config";
import { GrokController } from './grok/grok.controller';
import { GrokModule } from './grok/grok.module';

@Module({
  imports: [
    PrismaModule,
    AgentModule,
    GeminiModule,
    ConfigModule.forRoot({
        isGlobal: true,
    }),
    GrokModule,
    ],
  providers: [GeminiService],
  controllers: [GrokController],
})
export class AppModule {}
