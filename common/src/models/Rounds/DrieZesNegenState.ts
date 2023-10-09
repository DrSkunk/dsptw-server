import { RoundName } from '../RoundName';

export type DrieZesNegenState = {
    roundName: RoundName,
    questions: {
        question: string,
        answer: string,
    }[],
    currentQuestionIndex: number,
};
