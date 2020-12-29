import { RoundName } from '../../../dsptw-client/src/models/RoundName';
import { DrieZesNegenState } from '../../../dsptw-client/src/models/Rounds/DrieZesNegenState';
import { Round } from './Round';
import { log } from '../Log';
import { config } from '../Config';

export class DrieZesNegen extends Round {
  private state: DrieZesNegenState;
  private currentPlayerId = 0;

  constructor(questions: any) {
    super();
    this.state = {
      roundName: RoundName.DrieZesNegen,
      currentQuestionIndex: -1,
      questions,
    };
  }

  public correctAnswer(): { scoreForPlayer: number } {
    if (this.state.currentQuestionIndex % 3 === 2) {
      return { scoreForPlayer: 10 };
    }

    return { scoreForPlayer: 0 };
  }

  public calculateNextStartingPlayer(): void {
    this.currentPlayerId = (this.currentPlayerId + 1) % config.numberOfPlayers;
  }

  public calculateNextPlayerToComplete(): void {
    this.currentPlayerId = (this.currentPlayerId + 1) % config.numberOfPlayers;
  }

  public getCurrentPlayerId(): number {
    return this.currentPlayerId;
  }

  public getState(): DrieZesNegenState {
    return this.state;
  }

  public nextQuestion(): void {
    this.state.currentQuestionIndex++;
  }

  public showAllAnswers(): void {
    log.error('Cannot show all answers on round DrieZesNegen');
  }
}
