import { RoundName } from '../RoundName';

export type FinaleState = {
    roundName: RoundName,
    currentQuestionIndex: number,
    questions: {
        question: string,
        answers: {
            text: string,
            found: boolean,
        }[],
    }[],
};
