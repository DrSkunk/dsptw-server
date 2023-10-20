<script>
  import DrieZesNegen from "./rounds/Drie-zes-negen.svelte";
  import Players from "./components/Players.svelte";
  import state from "./lib/state.js";

  export let template;

  const templates = {
    "drie-zes-negen": DrieZesNegen,
    players: Players,
  };

  const Template = templates[template];

  let visible = false;

  function update(data) {
    const newState = JSON.parse(data);
    console.log("newState", newState);
    // Check the window.SPXGCTemplateDefinition datafields to parse numbers to numbers
    if (window?.SPXGCTemplateDefinition?.DataFields) {
      for (const [key, value] of Object.entries(newState)) {
        // if PlayerName, update the array
        // Format: playerName1, playerName2, playerName3
        if (key.startsWith("playerName")) {
          const playerNumber = key.replace("playerName", "");
          const playerIndex = Number(playerNumber) - 1;
          if (!newState.players) {
            newState.players = [...$state.players];
          }
          newState.players[playerIndex] = {
            ...newState.players[playerIndex],
            name: newState[key],
          };
          delete newState[key];
          continue;
        }
        if (key.startsWith["playerScore"]) {
          console.log("playerScore", key, value);
          const playerNumber = key.replace("playerScore", "");
          const playerIndex = Number(playerNumber) - 1;
          if (!newState.players) {
            newState.players = [...$state.players];
          }
          newState.players[playerIndex] = {
            ...newState.players[playerIndex],
            score: newState[key],
          };
          delete newState[key];
          continue;
        }

        const ftype = window?.SPXGCTemplateDefinition?.DataFields.find(
          ({ field }) => field === key,
        )?.ftype;
        if (ftype === "number") {
          newState[key] = Number(newState[key]);
        }
        if (ftype === "textarea") {
          newState[key] = newState[key].replaceAll("&lt;br&gt;", "\n");
        }
      }
    }
    state.update((previousState) => ({ ...previousState, ...newState }));
  }

  function play() {
    // Execute animation in
    visible = true;
  }

  function stop() {
    // Execute animation out
    visible = false;
  }

  state.subscribe((state) => {
    console.log("state", state);
  });

  window.update = update;
  window.play = play;
  window.stop = stop;

  if (import.meta.env.MODE === "development") {
    window.play();
    document.body.classList.add("bg-red-800");
  }
  $: opacity = visible ? 1 : 0;
</script>

<div
  class="h-full opacity-[--opacity] transition-all duration-1000"
  style={`--opacity:${opacity}`}
>
  <pre class="absolute text-white">
{JSON.stringify($state, null, 2)}
  </pre>
  {#if Template}
    <svelte:component this={Template} />
  {:else}
    <div class="text-6xl text-black">
      The supplied template "{template}" is invalid
    </div>
  {/if}
</div>
