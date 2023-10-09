import { EpisodeModel } from "de-slimste-common/src/models/EpisodeModel";
import { PlayerState } from "de-slimste-common/src/models/PlayerState";
import { RoundName } from "de-slimste-common/src/models/RoundName";
import { OpenDeurState } from "de-slimste-common/src/models/Rounds/OpenDeurState";
import { ViewType } from "de-slimste-common/src/models/ViewType";
import { LowestTimeRound } from "./LowestTimeRound";

export class OpenDeur extends LowestTimeRound {
  private state: OpenDeurState;

  constructor(players: PlayerState[], questions: EpisodeModel["openDeur"]) {
    super(players);
    this.state = {
      roundName: RoundName.OpenDeur,
      currentQuestionIndex: 0,
      currentView: ViewType.Videos,
      questions: questions.map((
        question: {
          question: string;
          answers: [string, string, string, string];
        },
      ) => ({
        question: question.question,
        answers: question.answers.map((answer: string) => ({
          text: answer,
          found: false,
        })),
      })),
    };
  }

  public correctAnswer(foundIndex: number) {
    this.state.questions[this.state.currentQuestionIndex].answers[foundIndex]
      .found = true;
    const answersFound =
      this.state.questions[this.state.currentQuestionIndex].answers.filter(
        (answer) => answer.found,
      ).length;
    const allAnswersFound = answersFound === 4;
    return { scoreForPlayer: 20, allAnswersFound };
  }

  public getState() {
    return this.state;
  }

  public setCurrentQuestion(questionIndex: number): void {
    this.state.currentQuestionIndex = questionIndex;
  }

  public setView(view: ViewType) {
    this.state.currentView = view;
  }

  public nextQuestion(): void {
    this.state.currentQuestionIndex++;
  }

  public showAllAnswers(): void {
    this.state.questions[this.state.currentQuestionIndex].answers.forEach(
      (answer) => {
        answer.found = true;
      },
    );
  }
}
