import { readable } from "svelte/store";

const gameState = readable({
  episode: 1,
  currentPlayers: [0, 1, 2],
  currentPlayer: -1,
  players: [
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
  ],
  roundState: {
    roundName: "Overzicht",
  },
  timerIsRunning: false,
  presenter: {
    name: "Erica",
    cameraLink: "https://obs.ninja/?view=",
  },
  jury: {
    show: false,
    name: "Jerommeke",
    cameraLink: "https://obs.ninja/?view=",
  },
  showAnswers: false,
});
