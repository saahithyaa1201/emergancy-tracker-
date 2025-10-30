import { Module } from '@nestjs/common';
import { PanicAlertsController } from './panic-alerts.controller';
import { PanicAlertsService } from './panic-alerts.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PanicAlertsController],
  providers: [PanicAlertsService],
  exports: [PanicAlertsService],
})
export class PanicAlertsModule {}