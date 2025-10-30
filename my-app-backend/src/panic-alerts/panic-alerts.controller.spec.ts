import { Test, TestingModule } from '@nestjs/testing';
import { PanicAlertsController } from './panic-alerts.controller';

describe('PanicAlertsController', () => {
  let controller: PanicAlertsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PanicAlertsController],
    }).compile();

    controller = module.get<PanicAlertsController>(PanicAlertsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
