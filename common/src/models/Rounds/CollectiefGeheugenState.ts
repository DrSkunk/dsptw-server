import { RoundName } from '../RoundName';
import { ViewType } from '../ViewType';

export type CollectiefGeheugenState = {
    currentView: ViewType,
    roundName: RoundName,
    currentQuestionIndex: number,
    questions:
    {
        videoUrl?: string,
        answers: {
            text: string,
            found: boolean,
            score?: number,
        }[],
    }[],
};
