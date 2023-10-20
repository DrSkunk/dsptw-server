import { version } from "../package.json";
import ApiServer from "./ApiServer";
import { Game } from "./Game";
import { GameEmitType } from "./GameEmitType";
import { log } from "./Log";
import { GameEvent } from "de-slimste-common/src/models/GameEvent";
import { GameState } from "de-slimste-common/src/models/GameState";
import { SocketCommand } from "de-slimste-common/src/models/SocketCommand";
import { SocketEvent } from "de-slimste-common/src/models/SocketEvent";

export { version };

log.info("Starting De slimste Persoon server version " + version);

const game = new Game();
const apiServer = new ApiServer();

apiServer.on("connection", (socket) => {
  const data = JSON.stringify({
    event: SocketEvent.GameStateUpdate,
    data: game.getState(),
  });
  socket.send(data);
});

game.on(GameEmitType.GameStateUpdate, (gameState: GameState) => {
  apiServer.broadcast(SocketEvent.GameStateUpdate, gameState);
});

game.on(GameEmitType.GameEvent, (gameEvent: GameEvent) => {
  apiServer.broadcast(SocketEvent.GameEvent, gameEvent);
});

apiServer.on(SocketCommand.StartTime, () => game.startTime());
apiServer.on(SocketCommand.StopTime, () => game.stopTime());
apiServer.on(SocketCommand.CorrectAnswer, (data) =>
  game.correctAnswer(data.foundIndex, data.playerIndex),
);
apiServer.on(SocketCommand.NextQuestion, () => game.nextQuestion());
apiServer.on(SocketCommand.SetCurrentQuestion, (data) =>
  game.setCurrentQuestion(data.currentQuestion),
);
apiServer.on(SocketCommand.ShowAllAnswers, () => game.showAllAnswers());
apiServer.on(SocketCommand.NextImage, () => game.nextImage());
apiServer.on(SocketCommand.SetView, (data) => game.setView(data.view));
apiServer.on(SocketCommand.PreviousRound, () => game.previousRound());
apiServer.on(SocketCommand.NextRound, () => game.nextRound());
apiServer.on(SocketCommand.NextStartingPlayer, () => game.nextStartingPlayer());
apiServer.on(SocketCommand.NextPlayerToComplete, () =>
  game.nextPlayerToComplete(),
);
apiServer.on(SocketCommand.SetPlayerName, (data) =>
  game.setPlayerName(data.playerIndex, data.name),
);
apiServer.on(SocketCommand.SetPlayerTime, (data) =>
  game.setPlayerTime(data.playerIndex, data.time),
);
apiServer.on(SocketCommand.SetPlayerCameraLink, (data) =>
  game.setPlayerCameraLink(data.playerIndex, data.cameraLink),
);
apiServer.on(SocketCommand.ShowJury, () => game.showJury());
apiServer.on(SocketCommand.HideJury, () => game.hideJury());
apiServer.on(SocketCommand.PlayVideo, (data) =>
  apiServer.broadcast(SocketEvent.PlayVideo, data.videoIndex),
);
apiServer.on(SocketCommand.playApplause, () =>
  apiServer.broadcast(SocketEvent.GameEvent, GameEvent.Applause),
);

apiServer.start();
