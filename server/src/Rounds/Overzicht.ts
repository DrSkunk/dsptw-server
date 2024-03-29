import { Round } from "./Round";
import { RoundName } from "de-slimste-common/src/models/RoundName";

export class Overzicht extends Round {
  public correctAnswer():
    | { scoreForPlayer: number }
    | {
        scoreForOtherPlayer: number;
        otherPlayerId: number;
      } {
    return { scoreForPlayer: 0 };
  }

  public nextQuestion(): void {}

  public getState() {
    return {
      roundName: RoundName.Overzicht,
    };
  }

  public calculateNextStartingPlayer(): void {}

  public calculateNextPlayerToComplete(): void {}

  public getCurrentPlayerId(): number {
    return -1;
  }

  public showAllAnswers(): void {}
}
