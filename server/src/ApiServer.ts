import { config } from "./Config";
import { log } from "./Log";
import { SocketCommand } from "de-slimste-common/src/models/SocketCommand";
import { EventEmitter } from "events";
import express from "express";
import http from "http";
import WebSocket, { AddressInfo } from "ws";

export default class HttpServer extends EventEmitter {
  #server: http.Server;

  #app: express.Express;

  #port: number;

  #socketServer: WebSocket.Server;

  #sockets: WebSocket[] = [];

  constructor() {
    super();
    this.#app = express();
    this.#server = http.createServer(this.#app);
    this.#port = config.port;
    this.#app.use(express.json());
    this.#app.use("/static", express.static(config.staticAssets));
    this.#app.use(express.static(config.staticClient));

    this.#app.get("/api/:command/", (req, res) => {
      // check if valid command
      const command = req.params.command;

      if (!this.#isValidCommand(command)) {
        res.status(400);
        res.send("not a valid socket command");
        log.warn("not a valid socket command");
        return;
      }

      this.emit(command);

      res.send("ok");
    });

    this.#app.post("/api/:command/", (req, res) => {
      const command = req.params.command;

      if (!this.#isValidCommand(command)) {
        res.status(400);
        res.send("not a valid socket command");
        log.warn("not a valid socket command");
        return;
      }

      const data = req.body;
      console.log(data);

      this.emit(command, data);

      res.send("ok");
    });

    this.#socketServer = new WebSocket.Server({ server: this.#server });

    this.#socketServer.on("connection", (socket) => {
      log.debug("New socket connection incoming");
      socket.on("message", (rawData) => {
        log.debug(`received from a client: ${rawData}`);

        let data: { command: SocketCommand; data: unknown };
        try {
          data = JSON.parse(rawData.toString());
        } catch (e) {
          log.warn("Received invalid JSON");
          return;
        }
        // check if valid SocketCommand
        if (!Object.values(SocketCommand).includes(data.command)) {
          log.warn("not a valid socket command");
          return;
        }
        this.emit(data.command, data.data);
      });

      // socket.send(
      //   JSON.stringify({
      //     event: SocketEvent.Version,
      //     data: version,
      //   }),
      // );
      // socket.send(
      //   JSON.stringify({
      //     event: SocketEvent.GameStateUpdate,
      //     data: game.getState(),
      //   }),
      // );
      socket.on("close", () => {
        log.debug("Socket connection closed");
        this.#sockets.splice(this.#sockets.indexOf(socket), 1);
      });
      this.#sockets.push(socket);
    });
  }

  #isValidCommand(command: string): command is SocketCommand {
    return Object.values(SocketCommand).includes(command as SocketCommand);
  }

  start() {
    this.#server.listen(this.#port, () => {
      const address = this.#server.address() as AddressInfo;
      if (!address) {
        log.error("Error creating server");
        process.exit(-1);
      } else {
        log.info(
          `De slimste persoon server with players view started on http://localhost:${address.port}`,
        );
        log.info(
          `Presenter view available on http://localhost:${address.port}/?presenter=true`,
        );
        log.info(`Websocket available on ws://localhost:${address.port}`);
      }
    });
  }

  broadcast(event: string, data: unknown) {
    for (const socket of this.#sockets) {
      socket.send(
        JSON.stringify({
          event,
          data,
        }),
      );
    }
  }
}
