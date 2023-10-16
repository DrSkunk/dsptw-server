import { log } from "./Log";
import fs from "fs";
import path from "path";

type ConfigFile = {
  port: number;
  staticAssets: string;
  staticClient: string;
  episode: number;
  presenterName: string;
  presenterCamera: string;
  juryName: string;
  juryCamera: string;
  grandFinaleMode: boolean;
};

function eqSet(a: Set<unknown>, b: Set<unknown>) {
  if (a.size !== b.size) {
    return false;
  }
  const aa = Array.from(a);
  const bb = Array.from(b);
  return aa.filter((i) => bb.indexOf(i) < 0).length == 0;
}

class Config {
  public config: ConfigFile;

  constructor() {
    try {
      this.config = JSON.parse(
        fs.readFileSync("./config.json").toString(),
      ) as ConfigFile;
    } catch (error) {
      throw new Error(
        `Could not read config file. Please make sure config.json exists at the location ${path.resolve(
          "./config.json",
        )} and is valid JSON.`,
      );
    }
    const keys = new Set([
      "port",
      "staticAssets",
      "staticClient",
      "episode",
      "presenterName",
      "presenterCamera",
      "juryName",
      "juryCamera",
      "grandFinaleMode",
    ]);
    if (!eqSet(keys, new Set(Object.keys(this.config)))) {
      throw new Error(
        `Settings file incomplete, the following settings must be set in config.json: ${Array.from(
          keys,
        ).join(", ")}`,
      );
    }
    const type = this.config.grandFinaleMode ? "LOWEST" : "HIGHEST";
    log.info(`Current mode: removing player with ${type} time`);
  }
}

export const { config } = new Config();
