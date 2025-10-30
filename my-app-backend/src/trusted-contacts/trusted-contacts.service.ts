
// ============================================
// 5. trusted-contacts.service.ts (NEW - was missing!)
// ============================================
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTrustedContactDto } from './dto/create-trusted-contact.dto';
import { UpdateTrustedContactDto } from './dto/update-trusted-contact.dto';
@Injectable()
export class TrustedContactsService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string) {
    return this.prisma.trustedContact.findMany({
      where: { userId, isActive: true },
      orderBy: { priority: 'asc' },
    });
  }

  async create(userId: string, data: CreateTrustedContactDto) {
    return this.prisma.trustedContact.create({
      data: {
        ...data,
        userId,
        priority: data.priority || 1,
      },
    });
  }

  async update(id: string, userId: string, data: any) {
    const contact = await this.prisma.trustedContact.findFirst({
      where: { id, userId },
    });

    if (!contact) {
      throw new NotFoundException('Contact not found');
    }

    return this.prisma.trustedContact.update({
      where: { id },
      data,
    });
  }

  async delete(id: string, userId: string) {
    const contact = await this.prisma.trustedContact.findFirst({
      where: { id, userId },
    });

    if (!contact) {
      throw new NotFoundException('Contact not found');
    }

    return this.prisma.trustedContact.delete({
      where: { id },
    });
  }

  async getActiveContacts(userId: string) {
    return this.prisma.trustedContact.findMany({
      where: {
        userId,
        isActive: true,
      },
      orderBy: { priority: 'asc' },
    });
  }
}
