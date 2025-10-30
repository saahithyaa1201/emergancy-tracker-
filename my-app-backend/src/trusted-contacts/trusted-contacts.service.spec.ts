
// ============================================
// 4. trusted-contacts.service.spec.ts (FIXED)
// ============================================
import { Test, TestingModule } from '@nestjs/testing';
import { TrustedContactsService } from './trusted-contacts.service';
import { PrismaService } from '../prisma/prisma.service';

describe('TrustedContactsService', () => {
  let service: TrustedContactsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TrustedContactsService,
        {
          provide: PrismaService,
          useValue: {
            trustedContact: {
              findMany: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
              findFirst: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<TrustedContactsService>(TrustedContactsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});