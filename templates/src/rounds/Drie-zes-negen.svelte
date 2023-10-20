<script>
  import state from "../lib/state.js";
  const numbers = new Array(12).fill(0).map((_, i) => i + 1);

  $: left = ($state.questionNumber - 1) * 7.75;
</script>

<div
  class="absolute bottom-36 left-0 right-0 flex flex-col items-center justify-center text-white"
>
  <div
    id="question"
    class="text-emboss mb-14 max-w-7xl whitespace-break-spaces text-center text-8xl"
  >
    {$state.question}
  </div>
  <div class="relative inline-flex gap-11">
    <div
      class="absolute left-0 h-20 w-20 translate-x-[--left] rounded-full bg-blue-800 shadow-xl drop-shadow-lg transition-all duration-1000"
      style={`--left:${left}rem`}
      class:opacity-0={$state.questionNumber <= 0 ||
        $state.questionNumber > numbers.length}
    ></div>
    {#each numbers as number, index}
      <div
        class="text-emboss z-10 inline-flex h-20 w-20 items-center justify-center text-6xl transition-all duration-1000"
        class:opacity-20={$state.questionNumber - 1 > index}
        class:opacity-80={$state.questionNumber - 1 < index}
      >
        {number}
      </div>
    {/each}
  </div>
</div>
