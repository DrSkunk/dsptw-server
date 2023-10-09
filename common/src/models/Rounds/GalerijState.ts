import { RoundName } from '../RoundName';

export type GalerijState = {
    roundName: RoundName,
    currentImageIndex: number,
    currentQuestionSeriesIndex: number,
    questions: {
        imageUrl?: string,
        answer: string,
        found: boolean,
    }[][],
};
