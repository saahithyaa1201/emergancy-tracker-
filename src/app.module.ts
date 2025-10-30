import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { TrustedContactsModule } from './trusted-contacts/trusted-contacts.module';
import { PanicAlertsModule } from './panic-alerts/panic-alerts.module';

@Module({
  imports: [
     PrismaModule,
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    TrustedContactsModule,
    PanicAlertsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}