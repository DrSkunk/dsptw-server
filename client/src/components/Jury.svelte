<script lang="ts">
  import Name from "./Name.svelte";

  export let show = false;
  export let cameraLink = "";
  export let name = "";
</script>

<div
  class:hidden={!show}
  class="absolute bottom-0 right-10 h-[400px] w-[480px] text-center"
>
  <iframe
    class="h-[280px] w-[480px] bg-slate-600"
    src={cameraLink}
    title="Jury video"
  />
  <Name>{name}</Name>
</div>
