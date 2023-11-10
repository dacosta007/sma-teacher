<script>
  import { BranchInfoStore } from "$lib/stores/BranchInfoStore"
  import { enhance } from "$app/forms"
  import Button from "$lib/shared/Button.svelte"

  export let data
  export let form

  // branch info from the +layout.server.js page endpoint
  BranchInfoStore.set(data.branchData)

  let btnProps = {
    btnType: 'submit',
    pry: true,
    block: true,
    disableBtn: true
  }

  let errors = {}
  // check if input isn't ready
  function checkInpt(event) {
    let inpt = event.target.value
    // check if not empty
    if (inpt === '') {
      btnProps.disableBtn = true
    }
    btnProps.disableBtn = false
  }

  function loginFrm({ form }) {
    /* === execute before form submission === */
    // disable submit button
    btnProps.disableBtn = true

    /* === execute after form submission === */
    return async ({ result }) => {
      console.log(result)
      if (result.data) {
        if (result.data.errors) {
          console.log(result.data)
          errors = result.data.errors
          btnProps.disableBtn = false
        }
      }
      // console.log(result)
      // all is successful(redirect teacher to dashboard & enable button)
      if (result.location) {
        location.href = result.location
      }
    }
  }
</script>

<article>
  <header class="sch-logo-sec">
    <div class="sch-logo">
      <img src="/imgs/AFSSLogo.png" alt="AFSS school logo" width="130" height="auto">
    </div>
    <h2 class="title">login</h2>
  </header>

  <section>
    <form action="?/login" method="post" use:enhance={loginFrm}>
      <div class="input-field">
        <label for="teachId">teacher's ID</label>
        <input type="text" name="teachId" on:input={checkInpt} value={form?.teachId ?? ''} id="teachId" placeholder="22002T1230" required>
        {#if errors?.teachId}
          <div class="error-msg">{errors?.teachId[0]}</div>
        {/if}
      </div>

      <div class="input-field">
        <label for="password">password</label>
        <input type="password" name="password" on:input={checkInpt} id="password" placeholder="Password" required>
        {#if errors?.password}
          <div class="error-msg">{errors?.password[0]}</div>
        {/if}
      </div>

      <div class="btn-sec">
        <Button {...btnProps}>
          login
        </Button>
      </div>
    </form>
  </section>

  <!-- link to signup page -->
  <div class="nav-link-sec">
    <a href="/auth/signup" class="nav-link">
      Have not create an account?. Register
    </a>
  </div>
</article>

<style>
  .sch-logo-sec {
    margin-bottom: 0.5em;
    text-align: center;
  }
  .input-field {
    padding-left: 0;
    padding-right: 0;
  }
  .input-field label {
    color: var(--clr-off-white);
  }
  .btn-sec {
    margin-top: 1em;
  }
  .nav-link-sec {
    display: grid;
    margin-bottom: 1em;
    margin-top: 1.4em;
    min-width: 335px;
  }
  .nav-link {
    text-decoration: none;
    text-align: center;
    text-transform: capitalize;
    font-size: 14px;
    font-family: var(--font-quicksand);
    background-color: transparent;
    color: var(--clr-off-white);
    padding: 10px 12px;
    border-radius: 21px;
    width: 100%;
    appearance: none;
    outline: none;
    transition: background-color 0.5s ease;
  }
  .nav-link:hover {
    background-color: #eaf1ff6e;
    color: var(--clr-white);
  }
  .nav-link:active {
    animation: clickBtn 0.5s cubic-bezier(0.55, 0.055, 0.675, 0.19);
  }


  @media (max-width: 500px) {
    .nav-link-sec {
      width: 100%;
      min-width: auto;
    }
  }
</style>