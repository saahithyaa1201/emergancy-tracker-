import { Test, TestingModule } from '@nestjs/testing';
import { TrustedContactsController } from './trusted-contacts.controller';

describe('TrustedContactsController', () => {
  let controller: TrustedContactsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TrustedContactsController],
    }).compile();

    controller = module.get<TrustedContactsController>(TrustedContactsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
