<script>
  import ResultSlip from "./ResultSlip.svelte";
  import ResultNotice from "./ResultNotice.svelte";

  export let data
  
  // help toggle page viewport type
  let chkDocType = data.error != undefined ? 1 : 0
</script>

<svelte:head>
  <title>Student Report</title>
  <meta name="viewport" content="width=device-width, initial-scale={chkDocType}.0">
</svelte:head>

<article>
  {#if data?.error}
    <ResultNotice reports={data.res} />
  {/if}

  {#if data.docId}
    <ResultSlip reportData={data.res} />
  {/if}
</article>

<style>
  
</style>