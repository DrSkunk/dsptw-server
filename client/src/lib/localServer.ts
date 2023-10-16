import { ConnectionState } from "de-slimste-common/src/models/ConnectionState";
import { SocketEvent } from "de-slimste-common/src/models/SocketEvent";
import { ViewType } from "de-slimste-common/src/models/ViewType";
import { SocketCommand } from "de-slimste-common/src/models/SocketCommand";
import { writable } from "svelte/store";
import type { Writable } from "svelte/store";
import type { GameState } from "de-slimste-common/src/models/GameState";
import { GameEvent } from "de-slimste-common/src/models/GameEvent";

export const gameState: Writable<GameState | null> = writable(null);
export const connection = writable(ConnectionState.Closed);
export const events = writable<GameEvent | null>(null);
export const playVideoSubject = writable(null);

let socket: WebSocket;

let baseUrl: string;

if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
  console.debug(
    "Running client in debug mode. Connecting to default localhost:8080",
  );
  baseUrl = "localhost:8080";
} else {
  console.debug(
    "Running client in production mode. Connecting to same hostname and port as the webpage",
  );
  baseUrl = window.location.host;
}

export function getBaseUrl() {
  return baseUrl;
}

export function openConnection() {
  socket = new WebSocket(`ws://${getBaseUrl()}`);
  socket.addEventListener("open", () => {
    console.log("opened connection");
    connection.set(ConnectionState.Open);
  });
  socket.addEventListener("close", () => {
    console.log("The connection was lost. Retrying in 1 second.");
    connection.set(ConnectionState.Closed);
    setTimeout(openConnection, 1000);
  });
  socket.addEventListener("message", (e) => {
    try {
      const data = JSON.parse(e.data);
      console.debug("received socket data", data);
      if (data.event === SocketEvent.GameStateUpdate) {
        gameState.set(data.data);
      } else if (data.event === SocketEvent.GameEvent) {
        events.set(data.data);
      } else if (data.event === SocketEvent.PlayVideo) {
        playVideoSubject.set(data.data);
      } else if (data.event === SocketEvent.Version) {
        console.info("Connected with DSPTW server version " + data.data);
      }
    } catch (e) {
      console.error("couldn't parse JSON");
    }
  });
}

export function startTime() {
  sendCommand(SocketCommand.StartTime);
}
export function stopTime() {
  sendCommand(SocketCommand.StopTime);
}
export function correctAnswer(foundIndex?: number, playerIndex?: number) {
  sendCommand(SocketCommand.CorrectAnswer, { foundIndex, playerIndex });
}
export function nextQuestion() {
  sendCommand(SocketCommand.NextQuestion);
}
export function setCurrentQuestion(currentQuestion: number) {
  sendCommand(SocketCommand.SetCurrentQuestion, { currentQuestion });
}
export function showAllAnsers() {
  sendCommand(SocketCommand.ShowAllAnswers);
}
export function nextImage() {
  sendCommand(SocketCommand.NextImage);
}
export function setView(view: ViewType) {
  sendCommand(SocketCommand.SetView, { view });
}
export function previousRound() {
  sendCommand(SocketCommand.PreviousRound);
}
export function nextRound() {
  sendCommand(SocketCommand.NextRound);
}
export function nextStartingPlayer() {
  sendCommand(SocketCommand.NextStartingPlayer);
}
export function nextPlayerToComplete() {
  sendCommand(SocketCommand.NextPlayerToComplete);
}
export function setPlayerName(playerIndex: number, name: string) {
  sendCommand(SocketCommand.SetPlayerName, { playerIndex, name });
}
export function setPlayerTime(playerIndex: number, time: number) {
  sendCommand(SocketCommand.SetPlayerTime, { playerIndex, time });
}
export function setPlayerCameraLink(playerIndex: number, cameraLink: string) {
  sendCommand(SocketCommand.SetPlayerCameraLink, { playerIndex, cameraLink });
}
export function showJury() {
  sendCommand(SocketCommand.ShowJury);
}
export function hideJury() {
  sendCommand(SocketCommand.HideJury);
}
export function playVideo(videoIndex: number) {
  sendCommand(SocketCommand.PlayVideo, { videoIndex });
}
export function playApplause() {
  sendCommand(SocketCommand.playApplause);
}

function sendCommand(command: string, extraData = {}) {
  socket.send(JSON.stringify({ command, ...extraData }));
}
