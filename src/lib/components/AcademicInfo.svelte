<script>
  import Card from "$lib/shared/Card.svelte"
  export let academicInfo = {}

  const { session:currentSession, currentTerm, } = academicInfo
  const { currentTermBegins, currentTermEnds, } = academicInfo

  let sessionFormat = `${(currentSession.split('/')[0]).slice(2)}/${(currentSession.split('/')[1]).slice(2)}`

  const listArr = [
    { title: 'session', val: sessionFormat },
    { title: 'term', val: currentTerm },
    { title: 'begins', val: (new Date(currentTermBegins).toDateString()).substring(4) },
    { title: 'ends', val: (new Date(currentTermEnds).toDateString()).substring(4) }
  ]
</script>

<div class="academic-info-container">
  <Card>
    <header class="academic-info-header center-text">
      <h3 class="title">academic year</h3>
    </header>

    <div class="academic-info">
      {#each listArr as info}
        <div class="info">
          <div class="info-val">
            {#if info.title === 'term'}
              {@html `<span style="color: var(--accent-info); letter-spacing: 0.5px;">${info.val}</span>`}
            {:else}
              {@html (info.title === 'session') ? `<b style="letter-spacing: 0.5px;">${info.val}</b>` : info.val}
            {/if}
          </div>
          <div class="info-title">{info.title}</div>
        </div>
      {/each}
    </div>
  </Card>
</div>


<style>
  .academic-info-container {
    margin-bottom: 1em;
  }
  .academic-info {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    color: var(--clr-txt);
    padding: 0.3em 0.4em 1em;
  }
  .academic-info-header {
    padding-top: 0.6em;
  }
  .academic-info-header h3 {
    color: var(--clr-txt);
    margin-bottom: 0.2em;
  }
  .info {
    line-height: 1.5;
  }
  .info-val {
    font-size: 13px;
    text-transform: capitalize;
  }
  .info-title {
    font-variant: all-small-caps;
    color: #a4a8b9;
  }
</style>