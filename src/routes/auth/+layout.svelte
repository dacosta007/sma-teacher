<script>
  import { BranchInfoStore } from "$lib/stores/BranchInfoStore"
  import '$lib/css/home-layout.css'
  
  export let data
  
  BranchInfoStore.set(data.branchData)
  // console.log($BranchInfoStore)
</script>

<section class="layout-section">
  <div class="auth-container">
    <slot />
  </div>

  <footer class="copyright-sec">
    <small>Copyright &copy;2022 - {(new Date()).getFullYear()}. AFSS Ibadan<sup>&trade;</sup> All rights Reserved</small>
  </footer>
</section>

<style>
  .layout-section {
    width: 100%;
    height: 100vh;
    max-height: 100%;
    overflow: auto;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    align-items: center;
    background-color: var(--clr-sec);
    color: var(--clr-off-white);
    padding: 2em 0;
  }

  .auth-container {
    padding-top: 4em;
    gap: 2em;
    margin-bottom: 1em;
    min-width: 335px;
  }

  @media (max-width: 500px) {
    .auth-container {
      padding-left: 1em;
      padding-right: 1em;
      width: 100%;
      min-width: auto;
    }
    .copyright-sec {
      font-size: 12px;
    }
  }
</style>