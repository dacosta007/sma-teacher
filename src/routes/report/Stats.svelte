<script>
  import { BranchInfoStore } from "$lib/stores/BranchInfoStore"
  import Card from "$lib/shared/Card.svelte"

  export let allReports
  export let currentStat

  // console.log(currentStat)
  const { academicYear } = $BranchInfoStore
  const currentTerm = academicYear.currentTerm

  // all report for the current session
  let totalRept = (allReports.length)
  // check report for the present current term(i.e: first, second, or third) within the current session
  let completed = 0
  if (currentTerm === 'first') {
    completed = (allReports.filter(ele => ele.exam.report?.first != undefined)).length ?? 0
  }
  if (currentTerm === 'second') {
    completed = (allReports.filter(ele => ele.exam.report?.second != undefined)).length ?? 0
  }
  if (currentTerm === 'third') {
    completed = (allReports.filter(ele => ele.exam.report?.third != undefined)).length ?? 0
  }

  // remaining to be completed
  let remaining = totalRept - completed

  if (currentStat > 0) {
    remaining = totalRept - currentStat
  }

  $:allStats = [
    { title: 'students', val: totalRept }, 
    { title: 'completed', val: completed }, 
    { title: 'remaining', val: remaining }
  ]
</script>

<Card>
  <header class="stat-header">
    <h2>quick stats</h2>
  </header>

  <article class="stat-sec">
    {#each allStats as stat}
      <div class="stat-info">
        <div class="stat">{stat.val}</div>
        <div class="s-info-title">{stat.title}</div>
      </div>
    {/each}
  </article>
</Card>

<style>
  .stat-header {
    padding: 1em 0.5em;
    border-bottom: 1px solid var(--clr-off-white);
    text-transform: capitalize;
    font-family: var(--font-quicksand);
  }
  .stat-sec {
    padding: 1em 0.5em;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.4em;
  }
  .stat-info {
    display: grid;
    line-height: 1.4;
  }
  .s-info-title {
    font-size: 12px;
    text-transform: capitalize;
  }
  .stat {
    font-size: 24px;
  }
</style>