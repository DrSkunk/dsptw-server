import { writable } from "svelte/store";

const state = writable({
  players: [
    { name: "Player 1", score: 60 },
    { name: "Player 2", score: 60 },
    { name: "Player 3", score: 60 },
  ],
  question: "",
  questionNumber: 0,
});
export default state;
