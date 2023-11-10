<script>
  import { BranchInfoStore } from "$lib/stores/BranchInfoStore"

  import TileLink from "$lib/components/TileLink.svelte";
  // branchData from +layout.server.js
  export let data

  
  BranchInfoStore.set(data.branchData)

  let quickLinks = [
    { title: 'exam', subTitle: 'compute', href: "/report",  icon: 'lni-printer' },
    { title: 'mid-term', subTitle: 'compute', href: "#/report",  icon: 'lni-printer' },
    { title: 'student', subTitle: 'view', href: '#/students', icon: 'lni-graduation' },
    { title: 'profile', subTitle: 'my', href: '#/profile', icon: 'lni-user' }
  ]
</script>

<article>
  <header class="sch-logo-sec">
    <div class="sch-logo">
      <img src="/imgs/AFSSLogo.png" alt="AFSS school logo" width="130" height="auto">
    </div>
    <h2 class="title">Dashboard</h2>
  </header>

  <!-- links title -->
  <section class="app-features-sec">
    <section class="quick-nav">
      {#each quickLinks as link}
        <TileLink linkObj={link} />
      {/each}
    </section>

    <!-- logout btn -->
    <div class="logout-container">
      <a href="/auth/logout"  class="auth-cta-btn">
        logout
      </a>
    </div>
  </section>
</article>

<style>
  .sch-logo-sec {
    margin-bottom: 0.5em;
    text-align: center;
  }
  .quick-nav {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1em;
  }
  .logout-container {
    margin-top: 3em;
  }
  .logout-container a {
    display: inline-block;
  }
  .auth-cta-btn {
    text-decoration: none;
    text-align: center;
    letter-spacing: 1px;
    text-transform: capitalize;
    font-size: 16px;
    font-family: var(--font-quicksand);
    background-color: var(--clr-off-white);
    color: var(--clr-sec);
    padding: 10px 12px;
    border-radius: 21px;
    width: 100%;
    appearance: none;
    outline: none;
    transition: background-color 0.5s ease;
  }
  .auth-cta-btn:hover {
    background-color: #dce1ec;
  }
</style>