<script lang="ts">
  import { onMount } from "svelte";
  import { Router, Route } from "svelte-routing";
  import { openConnection, gameState } from "./lib/localServer";
  import PlayerView from "./routes/PlayerView.svelte";
  import PresenterView from "./routes/PresenterView.svelte";

  onMount(() => {
    openConnection();
  });
</script>

{#if $gameState}
  <Router>
    <Route path="/" component={PlayerView} />
    <Route path="/presenter" component={PresenterView} />
  </Router>
{:else}
  Not connected to server?
{/if}
