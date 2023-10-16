<script lang="ts">
  import type { DrieZesNegenState } from "de-slimste-common/src/models/Rounds/DrieZesNegenState";
  import { correctAnswer, nextQuestion } from "@lib/localServer";

  export let currentQuestionIndex: number;
  export let questions: DrieZesNegenState["questions"];

  let question = "";
  let answer = "";

  if (currentQuestionIndex >= 0 && currentQuestionIndex < questions.length) {
    question = questions[currentQuestionIndex].question;
    answer = questions[currentQuestionIndex].answer;
  }
</script>

<div>
  <button on:click={() => nextQuestion()}>Next Question</button>
  <button on:click={() => correctAnswer()}>Correct Answer</button>
  <div>{question}</div>
  <div>{answer}</div>
</div>
