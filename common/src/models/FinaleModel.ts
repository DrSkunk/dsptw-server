export type FinaleModel = {
  questionIndex: number;
  questions: {
    question: string;
    answers: [string, string, string, string, string];
  }[];
};
