import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  // Ajoutez les méthodes et la logique spécifique à votre application ici

  getPlayerMessage(playerName: string): string {
    return `Hello, ${playerName}! Welcome to the game.`;
  }
}
