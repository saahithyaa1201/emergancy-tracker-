import { Test, TestingModule } from '@nestjs/testing';
import { PanicAlertsService } from './panic-alerts.service';

describe('PanicAlertsService', () => {
  let service: PanicAlertsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PanicAlertsService],
    }).compile();

    service = module.get<PanicAlertsService>(PanicAlertsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
