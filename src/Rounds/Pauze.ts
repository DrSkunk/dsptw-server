import { RoundName } from '../../../dsptw-client/src/models/RoundName';
import { Overzicht } from './Overzicht';

export class Pauze extends Overzicht {
  private _text: string;
  constructor(text: string) {
    super();
    this._text = text;
  }
  private _targetTime: Date = new Date();

  public set targetTime(targetTime: Date) {
    this._targetTime = targetTime;
  }

  public getState(): { roundName: RoundName; targetTime: Date; text: string } {
    return {
      roundName: RoundName.Pauze,
      targetTime: this._targetTime,
      text: this._text,
    };
  }
}
