
// ============================================
// 3. trusted-contacts.module.ts (FIXED)
// ============================================
import { Module } from '@nestjs/common';
import { TrustedContactsService } from './trusted-contacts.service';
import { TrustedContactsController } from './trusted-contacts.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TrustedContactsController],
  providers: [TrustedContactsService],
  exports: [TrustedContactsService],
})
export class TrustedContactsModule {}
