<script>
  import { BranchInfoStore } from "$lib/stores/BranchInfoStore"
  import Stats from "./Stats.svelte"
  import ListReport from "./ListReport.svelte"
  
  export let data
  
  let currentStat = 0

  function getCurrentStat(evt) {
    currentStat = evt.detail
  }
</script>

<!-- in case redirected back from printing report document -->
<svelte:head>
  <title>Exam Report</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</svelte:head>

<article class="report-page">
  <header>
    <h1 class="title center-text">Compute Exam Reports</h1>
  </header>

  <section class="report-container">
    <!-- display all reports -->
    <div class="report-sec">
      <ListReport allStudts={data.results} classes={data.classes} teachSubjs={data.teachSubjs} on:addRptStat={getCurrentStat} />
    </div>

    <!-- show stats -->
    <div class="overall-stat-sec">
      <Stats allReports={data.results} {currentStat} />
    </div>
  </section>
</article>

<style>
  .report-page {
    padding: 2em 12em;
  }
  .report-container {
    display: grid;
    grid-template-columns: 3fr 2fr;
    /* width: 75%; */
  }
  .report-sec {
    padding: 0.5em 2em;
  }
</style>

