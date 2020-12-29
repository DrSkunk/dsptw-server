import { PlayerState } from '../../../dsptw-client/src/models/PlayerState';
import { config } from '../Config';
import { log } from '../Log';
import { Round } from './Round';

export abstract class LowestTimeRound extends Round {
  private playerStartingOrder: number[];
  private playerCompleteOrder: number[];
  private players: PlayerState[];

  constructor(players: PlayerState[]) {
    super();
    this.players = players;
    this.playerStartingOrder = Array.from(Array(config.numberOfPlayers).keys());
    this.playerCompleteOrder = Array.from(Array(config.numberOfPlayers).keys());
  }

  public calculateNextStartingPlayer(): void {
    log.debug('calculateNextStartingPlayer');
    log.debug('playerStartingOrder before', this.playerStartingOrder);
    log.debug('playerCompleteOrder before', this.playerCompleteOrder);
    if (this.playerStartingOrder.length >= 2) {
      // next player is the one who has the lowest score *now*
      this.playerStartingOrder.shift();
      this.playerStartingOrder.sort(
        (a, b) => this.players[a].time - this.players[b].time
      );
      const firstPlayer = this.playerStartingOrder[0];

      const otherPlayers = Array.from(Array(config.numberOfPlayers).keys())
        .filter((player) => player !== firstPlayer)
        .sort((a, b) => this.players[a].time - this.players[b].time);
      this.playerCompleteOrder = [firstPlayer, ...otherPlayers];
      log.debug('playerStartingOrder after', this.playerStartingOrder);
      log.debug('playerCompleteOrder after', this.playerCompleteOrder);
    }
  }

  public calculateNextPlayerToComplete(): void {
    if (this.playerCompleteOrder.length >= 2) {
      this.playerCompleteOrder.shift();
    }
  }

  public getCurrentPlayerId(): number {
    return this.playerCompleteOrder[0];
  }

  public init(): void {
    this.playerStartingOrder.sort(
      (a, b) => this.players[a].time - this.players[b].time
    );
    this.playerCompleteOrder.sort(
      (a, b) => this.players[a].time - this.players[b].time
    );
  }
}
