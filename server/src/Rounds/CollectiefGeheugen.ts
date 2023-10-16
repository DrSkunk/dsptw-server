import { LowestTimeRound } from "./LowestTimeRound";
import { EpisodeModel } from "de-slimste-common/src/models/EpisodeModel";
import { PlayerState } from "de-slimste-common/src/models/PlayerState";
import { RoundName } from "de-slimste-common/src/models/RoundName";
import { CollectiefGeheugenState } from "de-slimste-common/src/models/Rounds/CollectiefGeheugenState";
import { ViewType } from "de-slimste-common/src/models/ViewType";

export class CollectiefGeheugen extends LowestTimeRound {
  private state: CollectiefGeheugenState;

  constructor(
    players: PlayerState[],
    questions: EpisodeModel["collectiefGeheugen"],
  ) {
    super(players);
    this.state = {
      roundName: RoundName.CollectiefGeheugen,
      currentQuestionIndex: 0,
      currentView: ViewType.Videos,
      questions: questions.map((answers: string[]) => ({
        answers: answers.map((answer: string) => ({
          text: answer,
          found: false,
        })),
      })),
    };
  }

  public correctAnswer(answerIndex: number) {
    const { answers } = this.state.questions[this.state.currentQuestionIndex];

    let score = 10;
    answers.forEach((answer) => {
      if (answer.found) {
        score += 10;
      }
    });
    answers[answerIndex].found = true;
    answers[answerIndex].score = score;

    const answersFound = this.state.questions[
      this.state.currentQuestionIndex
    ].answers.filter((answer) => answer.found).length;
    const allAnswersFound = answersFound === 5;

    return { scoreForPlayer: score, allAnswersFound };
  }

  public getState() {
    return this.state;
  }

  public nextQuestion() {
    this.state.currentQuestionIndex++;
  }

  public setCurrentQuestion(questionIndex: number): void {
    this.state.currentQuestionIndex = questionIndex;
  }

  public setView(view: ViewType) {
    this.state.currentView = view;
  }

  public showAllAnswers(): void {
    this.state.questions[this.state.currentQuestionIndex].answers.forEach(
      (answer) => {
        answer.found = true;
      },
    );
  }
}
