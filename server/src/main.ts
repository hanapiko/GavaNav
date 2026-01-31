import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Enable CORS for frontend communication
    app.enableCors({
        origin: ['http://localhost:3000'],
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        credentials: true,
    });

    // Enable validation pipes
    app.useGlobalPipes(new ValidationPipe());

    const port = process.env.PORT || 3001;
    await app.listen(port);
    console.log(`🚀 GavaNav Server running on http://localhost:${port}`);
}

bootstrap();
