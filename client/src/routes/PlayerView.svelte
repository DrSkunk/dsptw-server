<script lang="ts">
  import { GameEvent } from "de-slimste-common/src/models/GameEvent";
  import { RoundName } from "de-slimste-common/src/models/RoundName";
  import { gameState, events } from "../lib/localServer";
  import AudioPlayer from "../components/AudioPlayer.svelte";
  import TitleCard from "../components/TitleCard.svelte";

  let showTitleCard = false;

  events.subscribe((gameEvent: GameEvent | null) => {
    console.log("gameEvent", gameEvent);

    switch (gameEvent) {
      case GameEvent.NextRound:
        showTitleCard = true;
        setTimeout(() => (showTitleCard = false), 5000);
        break;
    }
  });

  let roundName = "";

  gameState.subscribe((gameState) => {
    if (!gameState) return;
    roundName = gameState.roundState.roundName;
  });
</script>

{roundName}

{#if roundName === RoundName.DrieZesNegen}
  3-6-9
{:else if roundName === RoundName.OpenDeur}
  opendeur
{:else if roundName === RoundName.Puzzel}
  puzzel
{:else if roundName === RoundName.Galerij}
  galerij
{:else if roundName === RoundName.CollectiefGeheugen}
  collectief geheugen
{:else if roundName === RoundName.Finale}
  finale
{/if}

<AudioPlayer />
{#if showTitleCard}
  <TitleCard>{roundName}</TitleCard>
{/if}
