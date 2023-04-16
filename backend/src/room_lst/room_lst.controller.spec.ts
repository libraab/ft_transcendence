import { Test, TestingModule } from '@nestjs/testing';
import { RoomLstController } from './room_lst.controller';

describe('RoomLstController', () => {
  let controller: RoomLstController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoomLstController],
    }).compile();

    controller = module.get<RoomLstController>(RoomLstController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
