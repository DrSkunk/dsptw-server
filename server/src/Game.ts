import { config } from "./Config";
import { GameEmitType } from "./GameEmitType";
import { log } from "./Log";
import { CollectiefGeheugen } from "./Rounds/CollectiefGeheugen";
import { DrieZesNegen } from "./Rounds/DrieZesNegen";
import { Finale } from "./Rounds/Finale";
import { Galerij } from "./Rounds/Galerij";
import { LowestTimeRound } from "./Rounds/LowestTimeRound";
import { OpenDeur } from "./Rounds/OpenDeur";
import { Overzicht } from "./Rounds/Overzicht";
import { Puzzel } from "./Rounds/Puzzel";
import { Round } from "./Rounds/Round";
import emptyEpisode from "./emptyEpisode.json";
import emptyFinale from "./emptyFinale.json";
import { EpisodeModel } from "de-slimste-common/src/models/EpisodeModel";
import { GameEvent } from "de-slimste-common/src/models/GameEvent";
import { GameState } from "de-slimste-common/src/models/GameState";
import { PlayerState } from "de-slimste-common/src/models/PlayerState";
import { ViewType } from "de-slimste-common/src/models/ViewType";
import { EventEmitter } from "events";
import fs from "fs";

export class Game extends EventEmitter {
  private players: PlayerState[];

  private roundIndex: number = 0;

  private rounds = Array<Round>();

  private timerIsRunning: boolean = false;

  private timerInterval?: NodeJS.Timeout;

  private juryStatus: boolean = false;

  private showAnswers: boolean = false;

  constructor() {
    super();

    this.players = [
      {
        time: 60000,
        name: "player 1",
      },
      {
        time: 60000,
        name: "player 2",
      },
      {
        time: 60000,
        name: "player 3",
      },
    ];
    this.rounds = [new Overzicht(), new DrieZesNegen()];
  }

  public async loadEpisode(episodeNumber: number) {
    try {
      log.info(
        `Loading episode from ${config.staticAssets}/aflevering${episodeNumber}`,
      );
      let episode: EpisodeModel;
      let finale;
      try {
        episode = JSON.parse(
          fs
            .readFileSync(
              `${config.staticAssets}/aflevering${episodeNumber}/questions.json`,
            )
            .toString(),
        ) as EpisodeModel;
      } catch (error) {
        log.error(
          `Error loading episode at location ${config.staticAssets}/aflevering${episodeNumber}/questions.json. Loading empty episode instead`,
        );
        episode = emptyEpisode as EpisodeModel;
      }

      try {
        finale = JSON.parse(
          fs.readFileSync(`${config.staticAssets}/finale.json`).toString(),
        );
      } catch (error) {
        log.error(
          `Error loading finale at location ${config.staticAssets}/finale.json. Loading empty finale instead`,
        );
        finale = emptyFinale;
      }

      this.players = [
        {
          time: 60000,
          name: "player 1",
        },
        {
          time: 60000,
          name: "player 2",
        },
        {
          time: 60000,
          name: "player 3",
        },
      ];
      this.rounds = [
        new Overzicht(),
        new DrieZesNegen(episode.drieZesNegen),
        new Overzicht(),
        new OpenDeur(this.players, episode.openDeur),
        new Overzicht(),
        new Puzzel(this.players, episode.puzzel),
        new Overzicht(),
        new Galerij(this.players, episode.galerij),
        new Overzicht(),
        new CollectiefGeheugen(this.players, episode.collectiefGeheugen),
        new Overzicht(),
        new Finale(this.players, finale),
        new Overzicht(),
      ];
      log.info(`Episode ${episodeNumber} loaded successfully`);
      log.info(
        `First Finale question is "${
          finale.questions.splice(finale.questionIndex)[0].question
        }"`,
      );
    } catch (error) {
      log.error(error);
      throw "Invalid episode selected.";
    }
  }

  public startTime() {
    if (!(this.getCurrentRound() instanceof Overzicht)) {
      log.debug("startTime");
      this.emit(GameEmitType.GameEvent, GameEvent.StartTime);
      this.timerIsRunning = true;
      // this.timerStarted = Date.now();
      // this.timerTimeout = setTimeout(this.stopTime.bind(this), this.getCurrentPlayer().time);
      this.timerInterval = setInterval(() => {
        const newTime = (this.getCurrentPlayer().time -= 200);
        if (newTime <= 0) {
          this.getCurrentPlayer().time = 0;
          this.stopTime();
          if (this.getCurrentRound() instanceof Finale) {
            this.emit(GameEmitType.GameEvent, GameEvent.ItHasHappened);
          }
        } else {
          this.getCurrentPlayer().time = newTime;
        }
        this.emitGameStateUpdate();
      }, 200);
    }
  }

  public stopTime() {
    log.debug("stopTime");
    let playSound = true;
    this.players.forEach((player) => {
      if (player.time === 0) {
        playSound = false;
      }
    });

    this.timerIsRunning = false;
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    } else {
      playSound = false;
    }
    if (playSound) {
      this.emit(GameEmitType.GameEvent, GameEvent.StopTime);
    }
    this.emitGameStateUpdate();
  }

  public correctAnswer(
    foundIndex?: number,
    playerId = this.getCurrentRound().getCurrentPlayerId(),
  ) {
    log.debug("correctAnswer", { foundIndex, playerIndex: playerId });
    this.emit(GameEmitType.GameEvent, GameEvent.AnswerCorrect);
    const result = this.getCurrentRound().correctAnswer(foundIndex);
    if ("scoreForPlayer" in result && result.scoreForPlayer) {
      this.addTimeToPlayer(playerId, result.scoreForPlayer);
    }
    if ("scoreForOtherPlayer" in result && result.scoreForOtherPlayer) {
      this.addTimeToPlayer(result.otherPlayerId, result.scoreForOtherPlayer);
    }
    if (result.allAnswersFound) {
      this.stopTime();
    }
    this.emitGameStateUpdate();
  }

  public showAllAnswers() {
    log.debug("Showing all unanswered answers");
    this.showAnswers = true;
    this.emitGameStateUpdate();
  }

  public nextQuestion() {
    log.debug("nextQuestion");
    this.showAnswers = false;
    this.getCurrentRound().nextQuestion();
    this.emitGameStateUpdate();
  }

  public setCurrentQuestion(questionIndex: number) {
    log.debug("setCurrentQuestion", questionIndex);
    const currentRound = this.getCurrentRound();
    if (currentRound instanceof OpenDeur) {
      (currentRound as OpenDeur).setCurrentQuestion(questionIndex);
      this.emitGameStateUpdate();
    } else if (currentRound instanceof CollectiefGeheugen) {
      (currentRound as CollectiefGeheugen).setCurrentQuestion(questionIndex);
      this.emitGameStateUpdate();
    } else {
      log.warn(
        "Calling setCurrentQuestion not on round OpenDeur or Collectief Geheugen!",
      );
    }
  }

  public setView(view: ViewType) {
    log.debug("setView", view);
    this.showAnswers = false;
    const currentRound = this.getCurrentRound();
    if (currentRound instanceof OpenDeur) {
      (currentRound as OpenDeur).setView(view);
      this.emitGameStateUpdate();
    } else if (currentRound instanceof CollectiefGeheugen) {
      (currentRound as CollectiefGeheugen).setView(view);
      this.emitGameStateUpdate();
    } else {
      log.warn("Calling setView not on round OpenDeur!");
    }
  }

  public nextImage() {
    log.debug("nextImage");
    const currentRound = this.getCurrentRound();
    if (currentRound instanceof Galerij) {
      currentRound.nextImage();
    } else {
      log.warn('calling nextImage not on round "Galerij"');
    }
    this.emitGameStateUpdate();
  }

  public previousRound() {
    log.debug("previousRound");
    this.stopTime();
    if (this.roundIndex > 0) {
      this.roundIndex--;
      const currentRound = this.getCurrentRound();
      if (
        currentRound instanceof LowestTimeRound ||
        currentRound instanceof Finale
      ) {
        currentRound.init();
      }
    }
    this.emitGameStateUpdate();
  }

  public nextRound() {
    this.stopTime();
    log.debug("nextRound");
    this.showAnswers = false;
    this.hideJury();
    if (this.roundIndex + 1 < this.rounds.length) {
      this.roundIndex++;
      const currentRound = this.getCurrentRound();
      if (
        currentRound instanceof LowestTimeRound ||
        currentRound instanceof Finale
      ) {
        currentRound.init();
      }

      if (!(currentRound instanceof Overzicht)) {
        this.emit(GameEmitType.GameEvent, GameEvent.NextRound);
      }

      this.emitGameStateUpdate();
    }
  }

  public nextStartingPlayer() {
    const currentRound = this.getCurrentRound();
    currentRound.calculateNextStartingPlayer();

    this.emitGameStateUpdate();
  }

  public nextPlayerToComplete() {
    const currentRound = this.getCurrentRound();
    currentRound.calculateNextPlayerToComplete();
    this.emitGameStateUpdate();
  }

  public setPlayerName(playerId: number, name: string) {
    this.players[playerId].name = name;
    this.emitGameStateUpdate();
  }

  public setPlayerTime(playerId: number, time: number) {
    this.players[playerId].time = time;
    this.emitGameStateUpdate();
  }

  public setPlayerCameraLink(playerId: number, cameraLink: string) {
    this.players[playerId].cameraLink = cameraLink;
    this.emitGameStateUpdate();
  }

  public showJury() {
    this.juryStatus = true;
    this.emitGameStateUpdate();
  }

  public hideJury() {
    this.juryStatus = false;
    this.emitGameStateUpdate();
  }

  public getState(): GameState {
    const currentRound = this.getCurrentRound();
    return {
      episode: config.episode,
      currentPlayers:
        currentRound instanceof Finale
          ? currentRound.currentPlayerIds
          : [0, 1, 2],
      currentPlayer: currentRound.getCurrentPlayerId(),
      players: this.players,
      roundState: this.getCurrentRound().getState(),
      timerIsRunning: this.timerIsRunning,
      presenter: {
        name: config.presenterName,
        cameraLink: config.presenterCamera,
      },
      jury: {
        show: this.juryStatus,
        name: config.juryName,
        cameraLink: config.juryCamera,
      },
      showAnswers: this.showAnswers,
    };
  }

  private emitGameStateUpdate() {
    const gameState = this.getState();
    // log.debug(GameEmitType.GameStateUpdate);
    this.emit(GameEmitType.GameStateUpdate, gameState);
  }

  private getCurrentPlayer() {
    return this.players[this.getCurrentRound().getCurrentPlayerId()];
  }

  private addTimeToPlayer(player: number, time: number) {
    let newTime = this.players[player].time + time * 1000;
    if (newTime <= 0) {
      this.emit(GameEmitType.GameEvent, GameEvent.ItHasHappened);
      this.stopTime();
      newTime = 0;
    }
    this.players[player].time = newTime;
  }

  private getCurrentRound(): Round {
    return this.rounds[this.roundIndex];
  }
}
