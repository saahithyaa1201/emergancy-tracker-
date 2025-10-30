import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AlertStatus } from '@prisma/client'; // Import the generated enum/union

@Injectable()
export class PanicAlertsService {
  constructor(private prisma: PrismaService) {}

  async createPanicAlert(data: { 
    userId: string; 
    latitude: number; 
    longitude: number;
  }) {
    try {
      // Create the panic alert in database
      const alert = await this.prisma.panicAlert.create({
        data: {
          userId: data.userId,
          latitude: data.latitude,
          longitude: data.longitude,
          status: AlertStatus.ACTIVE, // Direct enum reference (value: 'active')
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              fullName: true,
            },
          },
        },
      });

      // TODO: Send notifications to trusted contacts
      // await this.notifyTrustedContacts(alert);

      // TODO: Send SMS/Email notifications
      // await this.sendEmergencyNotifications(alert);

      return {
        success: true,
        message: 'Panic alert triggered successfully',
        alert,
      };
    } catch (error) {
      console.error('Error creating panic alert:', error);
      throw error;
    }
  }

  async getAlertById(alertId: string) {
    const alert = await this.prisma.panicAlert.findUnique({
      where: { id: alertId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
          },
        },
      },
    });

    if (!alert) {
      throw new NotFoundException(`Panic alert with ID ${alertId} not found`);
    }

    return alert;
  }

  async getAllAlerts(userId?: string) {
    const where = userId ? { userId } : {}; // Simplified (Prisma infers type)
    
    return this.prisma.panicAlert.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getUserAlerts(userId: string) {
    return this.prisma.panicAlert.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateAlertStatus(alertId: string, status: AlertStatus) { // Typed with Prisma's union
    const alert = await this.prisma.panicAlert.update({
      where: { id: alertId },
      data: { status }, // Accepts 'active', 'resolved', or 'false-alarm'
      include: {
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
          },
        },
      },
    });

    return {
      success: true,
      message: 'Alert status updated successfully',
      alert,
    };
  }

  async deleteAlert(alertId: string) {
    await this.prisma.panicAlert.delete({
      where: { id: alertId },
    });

    return {
      success: true,
      message: 'Alert deleted successfully',
    };
  }

  // TODO: Implement notification logic
  private async notifyTrustedContacts(alert: any) {
    const contacts = await this.prisma.trustedContact.findMany({
      where: { userId: alert.userId },
    });
    console.log('Notifying trusted contacts:', contacts);
  }

  // TODO: Implement emergency notification
  private async sendEmergencyNotifications(alert: any) {
    console.log('Sending emergency notifications for alert:', alert.id);
  }
}