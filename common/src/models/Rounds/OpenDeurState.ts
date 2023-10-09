import { RoundName } from '../RoundName';
import { ViewType } from '../ViewType';

export type OpenDeurState = {
    roundName: RoundName,
    questions: {
        videoUrl?: string,
        question: string,
        answers: {
            text: string,
            found: boolean,
        }[],
    }[],
    currentQuestionIndex: number,
    currentView: ViewType,
};
