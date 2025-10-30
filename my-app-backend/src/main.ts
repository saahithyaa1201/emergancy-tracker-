import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS for React Native
  app.enableCors({
    origin: '*', // Allow all origins in development
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Enable validation
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3000);
  console.log('🚀 Server is running on http://localhost:3000');
  console.log('📡 API endpoints:');
  console.log('   POST http://localhost:3000/api/auth/signup');
  console.log('   POST http://localhost:3000/api/auth/signin');
}
bootstrap();