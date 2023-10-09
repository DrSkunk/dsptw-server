export type EpisodeModel = {
  drieZesNegen: [
    { question: string; answer: string },
    { question: string; answer: string },
    { question: string; answer: string },
    { question: string; answer: string },
    { question: string; answer: string },
    { question: string; answer: string },
    { question: string; answer: string },
    { question: string; answer: string },
    { question: string; answer: string },
    { question: string; answer: string },
    { question: string; answer: string },
    { question: string; answer: string },
  ];
  openDeur: [
    { question: string; answers: [string, string, string, string] },
    { question: string; answers: [string, string, string, string] },
    { question: string; answers: [string, string, string, string] },
  ];
  puzzel: [
    [
      { answer: string; words: [string, string, string, string] },
      { answer: string; words: [string, string, string, string] },
      { answer: string; words: [string, string, string, string] },
    ],
    [
      { answer: string; words: [string, string, string, string] },
      { answer: string; words: [string, string, string, string] },
      { answer: string; words: [string, string, string, string] },
    ],
    [
      { answer: string; words: [string, string, string, string] },
      { answer: string; words: [string, string, string, string] },
      { answer: string; words: [string, string, string, string] },
    ],
  ];
  galerij: [
    [
      string,
      string,
      string,
      string,
      string,
      string,
      string,
      string,
      string,
      string,
      string,
      string,
    ],
    [
      string,
      string,
      string,
      string,
      string,
      string,
      string,
      string,
      string,
      string,
      string,
      string,
    ],
    [
      string,
      string,
      string,
      string,
      string,
      string,
      string,
      string,
      string,
      string,
      string,
      string,
    ],
  ];
  collectiefGeheugen: [
    [string, string, string, string, string],
    [string, string, string, string, string],
    [string, string, string, string, string],
  ];
};
