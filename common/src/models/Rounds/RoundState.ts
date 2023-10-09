import { CollectiefGeheugenState } from "./CollectiefGeheugenState";
import { DrieZesNegenState } from "./DrieZesNegenState";
import { FinaleState } from "./FinaleState";
import { GalerijState } from "./GalerijState";
import { OpenDeurState } from "./OpenDeurState";
import { PuzzelState } from "./PuzzelState";
import { OverzichtState } from "./OverzichtState";

export type RoundState =
  | DrieZesNegenState
  | OpenDeurState
  | PuzzelState
  | GalerijState
  | CollectiefGeheugenState
  | FinaleState
  | OverzichtState;
