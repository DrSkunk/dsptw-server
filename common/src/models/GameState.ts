import type { PlayerState } from "./PlayerState";
import type { RoundState } from "./Rounds/RoundState";

export type GameState = {
  episode: number;
  currentPlayers: number[];
  currentPlayer: number;
  roundState: RoundState;
  players: PlayerState[];
  timerIsRunning: boolean;
  presenter: {
    name: string;
    cameraLink: string;
  };
  jury: {
    show: boolean;
    name: string;
    cameraLink: string;
  };
  showAnswers: boolean;
};
