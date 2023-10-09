import { EpisodeModel } from "de-slimste-common/src/models/EpisodeModel";
import { PlayerState } from "de-slimste-common/src/models/PlayerState";
import { RoundName } from "de-slimste-common/src/models/RoundName";
import { PuzzelState } from "de-slimste-common/src/models/Rounds/PuzzelState";
import { LowestTimeRound } from "./LowestTimeRound";
import shuffleSeed from "shuffle-seed";

export class Puzzel extends LowestTimeRound {
  private state: PuzzelState;

  constructor(players: PlayerState[], puzzles: EpisodeModel["puzzel"]) {
    super(players);

    const allPuzzles = puzzles.map(
      (
        puzzle: {
          answer: string;
          words: [string, string, string, string];
        }[],
      ) => {
        const answers = puzzle.map((group: { answer: string }) => ({
          text: group.answer,
          found: false,
        }));
        const grid: { text: string; answerIndex: number }[] = [];
        puzzle.forEach((group: { words: string[] }, answerIndex: number) => {
          group.words.forEach((word) => {
            grid.push({
              text: word,
              answerIndex,
            });
          });
        });
        return {
          grid: shuffleSeed.shuffle(grid, grid[0].text),
          answers,
        };
      },
    );

    this.state = {
      roundName: RoundName.Puzzel,
      currentPuzzleIndex: -1,
      puzzles: allPuzzles,
    };
  }

  public correctAnswer(foundIndex: number) {
    this.state.puzzles[this.state.currentPuzzleIndex].answers[
      foundIndex
    ].found = true;
    const answersFound = this.state.puzzles[
      this.state.currentPuzzleIndex
    ].answers.filter((answer) => answer.found).length;
    const allAnswersFound = answersFound === 3;
    return { scoreForPlayer: 30, allAnswersFound };
  }

  public getState() {
    return this.state;
  }

  public nextQuestion(): void {
    if (this.state.currentPuzzleIndex < 2) {
      this.state.currentPuzzleIndex++;
    }
  }

  public showAllAnswers(): void {
    this.state.puzzles[this.state.currentPuzzleIndex].answers.forEach(
      (answer) => {
        answer.found = true;
      },
    );
  }
}
