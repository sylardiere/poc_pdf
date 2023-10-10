import { Test, TestingModule } from '@nestjs/testing';
import { PupeteerController } from './pupeteer.controller';

describe('PupeteerController', () => {
  let controller: PupeteerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PupeteerController],
    }).compile();

    controller = module.get<PupeteerController>(PupeteerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
