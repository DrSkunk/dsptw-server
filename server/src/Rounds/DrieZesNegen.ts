import { RoundName } from "../../../common/src/models/RoundName";
import { DrieZesNegenState } from "../../../common/src/models/Rounds/DrieZesNegenState";
import { Round } from "./Round";
import { log } from "../Log";
import { EpisodeModel } from "../../../common/src/models/EpisodeModel";

export class DrieZesNegen extends Round {
  private state: DrieZesNegenState;
  private currentPlayerId = 0;

  constructor(questions: EpisodeModel["drieZesNegen"]) {
    super();
    this.state = {
      roundName: RoundName.DrieZesNegen,
      currentQuestionIndex: -1,
      questions,
    };
  }

  public correctAnswer() {
    if (this.state.currentQuestionIndex % 3 === 2) {
      return { scoreForPlayer: 10 };
    }

    return { scoreForPlayer: 0 };
  }

  public calculateNextStartingPlayer() {
    this.currentPlayerId = (this.currentPlayerId + 1) % 3;
  }

  public calculateNextPlayerToComplete() {
    this.currentPlayerId = (this.currentPlayerId + 1) % 3;
  }

  public getCurrentPlayerId(): number {
    return this.currentPlayerId;
  }

  public getState() {
    return this.state;
  }

  public nextQuestion() {
    this.state.currentQuestionIndex++;
  }

  public showAllAnswers(): void {
    log.error("Cannot show all answers on round DrieZesNegen");
  }
}
