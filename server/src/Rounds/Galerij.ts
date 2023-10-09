import { PlayerState } from "de-slimste-common/src/models/PlayerState";
import { RoundName } from "de-slimste-common/src/models/RoundName";
import { GalerijState } from "de-slimste-common/src/models/Rounds/GalerijState";
import { LowestTimeRound } from "./LowestTimeRound";
import { log } from "../Log";
import { EpisodeModel } from "de-slimste-common/src/models/EpisodeModel";

export class Galerij extends LowestTimeRound {
  private state: GalerijState;

  constructor(players: PlayerState[], questions: EpisodeModel["galerij"]) {
    super(players);
    this.state = {
      roundName: RoundName.Galerij,
      currentImageIndex: -1,
      currentQuestionSeriesIndex: 0,
      questions: questions.map((series: string[]) =>
        series.map((answer: string) => ({ answer, found: false })),
      ),
    };
  }

  public correctAnswer(imageIndex: number) {
    this.state.questions[this.state.currentQuestionSeriesIndex][
      imageIndex
    ].found = true;
    const answersFound = this.state.questions[
      this.state.currentQuestionSeriesIndex
    ].filter((answer) => answer.found).length;
    const allAnswersFound = answersFound === 10;
    return { scoreForPlayer: 15, allAnswersFound };
  }

  public getState() {
    return this.state;
  }

  public nextQuestion() {
    if (this.state.currentQuestionSeriesIndex < 2) {
      this.state.currentQuestionSeriesIndex++;
      this.state.currentImageIndex = -1;
    }
  }

  public nextImage() {
    if (this.state.currentImageIndex < 9) {
      this.state.currentImageIndex++;
    } else {
      this.state.currentImageIndex = -1;
    }
  }

  public showAllAnswers(): void {
    log.error("Cannot show all answers on round DrieZesNegen");
  }
}
