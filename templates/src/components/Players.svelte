<script>
  import state from "../lib/state.js";
</script>

<div
  class="text-emboss flex w-full justify-around pt-32 text-center text-white"
>
  {#each $state.players as { name, score }}
    <div>
      <div class="mb-12 w-96 text-7xl">{name}</div>
      <div
        class="text-emboss inline-flex h-28 w-28 items-center justify-center rounded-full bg-blue-800 text-6xl shadow-xl drop-shadow-lg"
      >
        {score}
      </div>
    </div>
  {/each}
</div>
