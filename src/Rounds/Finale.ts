import { RoundName } from '../models/RoundName';
import { FinaleState } from '../models/Rounds/FinaleState';
import { Round } from './Round';

export class Finale extends Round {

    private state: FinaleState;

    constructor() {
        super(RoundName.Finale);
        this.state = {
            currentQuestionIndex: 0,
            questions: [
                {
                    answers: [
                        {
                            found: false,
                            text: 'Gebakken patatten',
                        },
                        {
                            found: false,
                            text: 'Gekookte patatten',
                        },
                        {
                            found: false,
                            text: 'Puree',
                        },
                        {
                            found: false,
                            text: 'Kroketten',
                        },
                        {
                            found: false,
                            text: 'Frietjes',
                        },
                    ],
                    question: 'aardappelen.mp4',
                },
                {
                    answers: [
                        {
                            found: false,
                            text: 'Gebakken patatten',
                        },
                        {
                            found: false,
                            text: 'Gekookte patatten',
                        },
                        {
                            found: false,
                            text: 'Puree',
                        },
                        {
                            found: false,
                            text: 'Kroketten',
                        },
                        {
                            found: false,
                            text: 'Frietjes',
                        },
                    ],
                    question: 'aardappelen.mp4',
                },
                {
                    answers: [
                        {
                            found: false,
                            text: 'Gebakken patatten',
                        },
                        {
                            found: false,
                            text: 'Gekookte patatten',
                        },
                        {
                            found: false,
                            text: 'Puree',
                        },
                        {
                            found: false,
                            text: 'Kroketten',
                        },
                        {
                            found: false,
                            text: 'Frietjes',
                        },
                    ],
                    question: 'aardappelen.mp4',
                },
                {
                    answers: [
                        {
                            found: false,
                            text: 'Gebakken patatten',
                        },
                        {
                            found: false,
                            text: 'Gekookte patatten',
                        },
                        {
                            found: false,
                            text: 'Puree',
                        },
                        {
                            found: false,
                            text: 'Kroketten',
                        },
                        {
                            found: false,
                            text: 'Frietjes',
                        },
                    ],
                    question: 'aardappelen.mp4',
                },
                {
                    answers: [
                        {
                            found: false,
                            text: 'Gebakken patatten',
                        },
                        {
                            found: false,
                            text: 'Gekookte patatten',
                        },
                        {
                            found: false,
                            text: 'Puree',
                        },
                        {
                            found: false,
                            text: 'Kroketten',
                        },
                        {
                            found: false,
                            text: 'Frietjes',
                        },
                    ],
                    question: 'aardappelen.mp4',
                },
                {
                    answers: [
                        {
                            found: false,
                            text: 'Gebakken patatten',
                        },
                        {
                            found: false,
                            text: 'Gekookte patatten',
                        },
                        {
                            found: false,
                            text: 'Puree',
                        },
                        {
                            found: false,
                            text: 'Kroketten',
                        },
                        {
                            found: false,
                            text: 'Frietjes',
                        },
                    ],
                    question: 'aardappelen.mp4',
                },
            ],
        };
    }

    public correctAnswer(answerIndex: number) {
        this.state.questions[this.state.currentQuestionIndex].answers[answerIndex].found = true;
        // TODO misschien penalty ipv score?
        return { scoreForOtherPlayer: 20 };
    }

    public getState() {
        return this.state;
    }

    public nextQuestion() {
        this.state.currentQuestionIndex++;
    }
}
