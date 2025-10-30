// src/app.controller.ts (or create a test endpoint)

import { Controller, Get } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Controller()
export class AppController {
  constructor(private prisma: PrismaService) {}

  @Get('test-db')
  async testDatabase() {
    const userCount = await this.prisma.user.count();
    return { 
      message: 'Database connected!', 
      userCount 
    };
  }
}