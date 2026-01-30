import { Module } from '@nestjs/common';
import { AgentModule } from './agent/agent.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
    imports: [PrismaModule, AgentModule],
})
export class AppModule { }
