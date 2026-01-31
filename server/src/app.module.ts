import { Module } from "@nestjs/common";
import { AgentModule } from "./agent/agent.module";
import { PrismaModule } from "./prisma/prisma.module";
import { GeminiModule } from "./gemini/gemini.module";
import { GeminiService } from "./gemini/gemini.service";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [
    PrismaModule,
    AgentModule,
    GeminiModule,
    ConfigModule.forRoot({
        isGlobal: true,
    }),
    ],
  providers: [GeminiService],
})
export class AppModule {}
