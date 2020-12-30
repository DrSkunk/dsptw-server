import { PlayerState } from '../../../dsptw-client/src/models/PlayerState';
import { RoundName } from '../../../dsptw-client/src/models/RoundName';
import { FinaleState } from '../../../dsptw-client/src/models/Rounds/FinaleState';
import { log } from '../Log';
import { Round } from './Round';
import { config } from '../Config';

export class Finale extends Round {
  private state: FinaleState;
  private currentAnsweringPlayerIdIndex = 0;
  private players: PlayerState[];
  private currentFinaleIndex = 0;
  private finalePlayerIds: number[][] = [];

  constructor(players: PlayerState[], finale: any) {
    super();
    this.players = players;
    this.state = {
      roundName: RoundName.Finale,
      currentQuestionIndex: 0,
      questions: finale.questions
        .slice(finale.questionIndex)
        .map((question: { question: any; answers: any[] }) => ({
          question: question.question,
          answers: question.answers.map((answer: any) => ({
            text: answer,
            found: false,
          })),
        })),
    };
  }

  public init(): void {
    this.selectFinalPlayers();
  }

  public correctAnswer(
    answerIndex: number
  ):
    | { scoreForOtherPlayer: number; otherPlayerId: number }
    | {
        scoreForOtherPlayer: number;
        otherPlayerId: number;
        allAnswersFound: boolean;
      } {
    if (
      this.state.questions[this.state.currentQuestionIndex].answers[answerIndex]
        .found
    ) {
      return { scoreForOtherPlayer: 0, otherPlayerId: this.getOtherPlayerId() };
    }
    this.state.questions[this.state.currentQuestionIndex].answers[
      answerIndex
    ].found = true;
    const answersFound = this.state.questions[
      this.state.currentQuestionIndex
    ].answers.filter((answer) => answer.found).length;
    const allAnswersFound = answersFound === 5;
    return {
      scoreForOtherPlayer: -20,
      otherPlayerId: this.getOtherPlayerId(),
      allAnswersFound,
    };
  }

  public getState(): FinaleState {
    return this.state;
  }

  public nextQuestion(): void {
    this.state.currentQuestionIndex++;
    log.info(
      'Current Finale question index: ' + this.state.currentQuestionIndex
    );
  }

  public calculateNextStartingPlayer(): void {
    this.currentAnsweringPlayerIdIndex = 1 - this.currentAnsweringPlayerIdIndex;
  }

  public calculateNextPlayerToComplete(): void {
    this.currentAnsweringPlayerIdIndex = 1 - this.currentAnsweringPlayerIdIndex;
  }

  public getCurrentPlayerId(): number {
    return this.finalePlayerIds[this.currentFinaleIndex][
      this.currentAnsweringPlayerIdIndex
    ];
  }

  public showAllAnswers(): void {
    this.state.questions[this.state.currentQuestionIndex].answers.forEach(
      (answer) => {
        answer.found = true;
      }
    );
  }

  private selectFinalPlayers() {
    // TODO re-enable grand-finale mode setting
    if (config.numberOfPlayers === 3) {
      const type = config.grandFinaleMode ? 'LOWEST' : 'HIGHEST';
      log.debug(`Selecting final players, removing player with ${type} time`);
      let playerToBeRemovedId = 0;
      if (config.grandFinaleMode) {
        for (let i = 1; i < this.players.length; i++) {
          if (this.players[i].time < this.players[playerToBeRemovedId].time) {
            playerToBeRemovedId = i;
          }
        }
      } else {
        for (let i = 1; i < this.players.length; i++) {
          if (this.players[i].time > this.players[playerToBeRemovedId].time) {
            playerToBeRemovedId = i;
          }
        }
      }
      this.finalePlayerIds[0] = [0, 1, 2].filter(
        (playerId) => playerId !== playerToBeRemovedId
      );
      const removedPlayer = this.players[playerToBeRemovedId];
      log.info(
        'player',
        removedPlayer.name,
        'removed with a time of',
        removedPlayer.time
      );
    } else {
      // sort so that lowest scores are first in the array
      const sortedPlayers = this.players
        .map((player, id) => ({
          ...player,
          id,
        }))
        .sort((player1, player2) => (player1.time > player2.time ? 1 : -1));
      log.debug('sortedPlayers', sortedPlayers);

      if (sortedPlayers.length % 2 === 1) {
        // TODO test this out
        log.info('Odd number of players, highest score is the winner');
        const winner = sortedPlayers[sortedPlayers.length - 1];
        log.info(`${winner.name} won!`);
        this.finalePlayerIds = this.chunk(sortedPlayers.slice(0, -1));
      } else {
        this.finalePlayerIds = this.chunk(sortedPlayers);
      }
    }
  }

  public nextFinale(): void {
    if (this.currentFinaleIndex + 1 < this.finalePlayerIds.length) {
      this.currentFinaleIndex++;
    }
  }

  public getCurrentPlayerIds(): number[] {
    return this.finalePlayerIds[this.currentFinaleIndex];
  }
  private chunk(array: any[]) {
    return Array(Math.ceil(array.length / 2))
      .fill(0)
      .map((_, index) => index * 2)
      .map((begin) => array.map((player) => player.id).slice(begin, begin + 2));
  }
  /**
   * Only to be called in the final round when there are two players left.
   */
  private getOtherPlayerId() {
    return this.getCurrentPlayerIds()[1 - this.currentAnsweringPlayerIdIndex];
  }
}
