<script>
  export let reports

  let std = reports
</script>

<section class="notice-sec">
  <div class="notice-container">
    <h2 class="title center-text" style="text-transform: uppercase;">Permission Denied!...</h2>
    <p class="description">
      Hello!. Your are not allowed to view this student's<b>({std.meta.studtId})</b> examination report. 
      Make sure your are logged in with your appropriate teacher's identity to view report for your class. 
      You can follow this link to <a href="https://teacher.afssib.com">Login</a>
    </p>
  </div>
</section>

<style>
  .notice-sec {
    padding: 2em 5em;
    display: flex;
    justify-content: center;
  }
  .notice-container {
    width: 450px;
    background-color: var(--clr-white);
    padding: 0.8em;
  }
  @media (max-width: 600px) {
    .notice-sec {
      padding: 2em 1em;
      display: flex;
      justify-content: center;
    }
  }
</style>