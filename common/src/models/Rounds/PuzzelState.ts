import { RoundName } from '../RoundName';

export type PuzzelState = {
    roundName: RoundName,
    currentPuzzleIndex: number,
    puzzles: {
        grid: {
            text: string,
            answerIndex: number,
        }[],
        answers: {
            text: string,
            found: boolean,
        }[],
    }[],
};
