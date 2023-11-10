<script>
  import { BranchInfoStore } from "$lib/stores/BranchInfoStore"
  import { AuthStore } from "$lib/stores/AuthStore"
  import { enhance } from "$app/forms"
  import Button from "$lib/shared/Button.svelte"

  export let data
  export let form

  BranchInfoStore.set(data.branchData)

  let btnProps = {
    btnType: 'submit',
    pry: true,
    block: true,
    disableBtn: true
  }

  function checkInpt(event) {
    let inpt = event.target.value
    
    // check if not empty
    if (inpt === '') {
      btnProps.disableBtn = true
      return
    }

    btnProps.disableBtn = false
  }

  let errors = {}

  let password = '', errPwd = false, errMsgPwd = ''
  function checkPwdMatch(event) {
    let inpt = event.target.value
    
    if (inpt != password) {
      errPwd = true
      errMsgPwd = "Password do not match"
      btnProps.disableBtn = true
      return
    }

    errPwd = false
    btnProps.disableBtn = false
  }

  function signupFrm({ form }) {
    /* === execute before form submission === */
    // disable submit button
    btnProps.disableBtn = true
    
    /* === execute after form submission === */
    return async ({ result }) => {
      console.log(result)
      if (result.data) {
        if (result.data.errors) {
          console.log(result)
          errors = result.data.errors
          btnProps.disableBtn = false
          return
        }
        
        if (result.data.error) {
          alert(`🛑 ${result.data.message}`)
          btnProps.disableBtn = false
          return
        }
      }

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
    <h2 class="title">register</h2>
  </header>

  <section>
    <form action="?/register" method="post" use:enhance={signupFrm}>
      <!-- teacher's registerd ID -->
      <div class="input-field">
        <label for="teachId">teacher's ID</label>
        <input type="text" name="teachId" value={form?.teachId ?? ""} on:input={checkInpt} id="teachId" placeholder="22002T1230" required>
        {#if errors?.teachId}
          <div class="error-msg">{errors?.teachId[0]}</div>
        {/if}
      </div>
      <!-- registered email -->
      <div class="input-field">
        <label for="email">email</label>
        <input type="email" name="email" value={form?.email ?? ""} on:input={checkInpt} id="email" placeholder="Email" required>
        {#if errors?.email}
          <div class="error-msg">{form?.email[0]}</div>
        {/if}
      </div>
      <!-- prefered password -->
      <div class="input-field">
        <label for="password">password</label>
        <input type="password" name="password" bind:value={password}  id="password" placeholder="Password" required>
        {#if errors?.password}
          <div class="error-msg">{errors?.password[0]}</div>
        {/if}
      </div>
      <!-- confirm password -->
      <div class="input-field">
        <label for="conPwd">confirm password</label>
        <input type="password" name="conPassword" on:input={checkPwdMatch} id="conPwd" placeholder="Confirm Password">
        {#if errPwd === true}
          <div class="error-msg">{errMsgPwd}</div>
        {/if}
      </div>

      <!-- submit button -->
      <div class="btn-sec">
        <Button {...btnProps}>
          register
        </Button>
      </div>
    </form>
  </section>

  <!-- link to login page -->
  <div class="nav-link-sec">
    <a href="/auth/login" class="nav-link">
      account already creates?. Login
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