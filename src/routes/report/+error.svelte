<script>
  import { page } from '$app/stores';
</script>

<section>
  <h1>{$page.status}: {$page.error.message}</h1>
  <div>
    <a href="/auth/dashboard">back to dashboard</a>
  </div>
</section>