import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    const playerName = 'wannis'; // Remplacez par le nom du joueur approprié
    return this.appService.getPlayerMessage(playerName);
  }
}