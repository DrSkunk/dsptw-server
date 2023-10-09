import { RoundState } from "de-slimste-common/src/models/Rounds/RoundState";

export abstract class Round {
  // tslint:disable-next-line: max-line-length
  public abstract correctAnswer(
    foundIndex?: number,
  ): { scoreForPlayer: number; allAnswersFound?: boolean } | {
    scoreForOtherPlayer: number;
    otherPlayerId: number;
    allAnswersFound?: boolean;
  };

  public abstract nextQuestion(): void;

  public abstract getState(): RoundState;

  public abstract calculateNextStartingPlayer(): void;

  public abstract calculateNextPlayerToComplete(): void;

  public abstract getCurrentPlayerId(): number;

  public abstract showAllAnswers(): void;
}
