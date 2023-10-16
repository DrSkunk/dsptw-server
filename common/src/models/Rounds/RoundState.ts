import type { CollectiefGeheugenState } from "./CollectiefGeheugenState";
import type { DrieZesNegenState } from "./DrieZesNegenState";
import type { FinaleState } from "./FinaleState";
import type { GalerijState } from "./GalerijState";
import type { OpenDeurState } from "./OpenDeurState";
import type { PuzzelState } from "./PuzzelState";
import type { OverzichtState } from "./OverzichtState";

export type RoundState =
  | DrieZesNegenState
  | OpenDeurState
  | PuzzelState
  | GalerijState
  | CollectiefGeheugenState
  | FinaleState
  | OverzichtState;
