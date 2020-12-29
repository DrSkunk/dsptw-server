import fs from 'fs';
import { log } from './Log';

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
  numberOfPlayers: number;
};

function eqSet(a: Set<string>, b: Set<string>) {
  if (a.size !== b.size) return false;
  const aa = Array.from(a);
  const bb = Array.from(b);
  return (
    aa.filter(function (i) {
      return bb.indexOf(i) < 0;
    }).length == 0
  );
}

class Config {
  public config: ConfigFile;

  constructor() {
    const path = './config.json';
    if (!fs.existsSync(path)) {
      log.error(
        'Config file "config.json" does not exist. Please copy "config.json.example" to "config.json" and add your details.'
      );
      throw new Error('"config.json" invalid');
    }
    this.config = JSON.parse(fs.readFileSync(path).toString()) as ConfigFile;
    const keys = new Set([
      'port',
      'staticAssets',
      'staticClient',
      'episode',
      'presenterName',
      'presenterCamera',
      'juryName',
      'juryCamera',
      'grandFinaleMode',
      'numberOfPlayers',
    ]);
    if (!eqSet(keys, new Set(Object.keys(this.config)))) {
      throw new Error(
        'Settings file incomplete, the following settings must be set in config.json: ' +
          Array.from(keys).join(', ')
      );
    }
    const type = this.config.grandFinaleMode ? 'LOWEST' : 'HIGHEST';
    log.info(`Current mode: removing player with ${type} time`);
  }
}

export const config = new Config().config;
