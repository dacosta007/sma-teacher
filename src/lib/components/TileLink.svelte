<script>
  export let linkObj

</script>

<!-- in production use: 'data-sveltekit-prefetch' -->
<a href="{linkObj.href}" class="tile-link">
  <i class="lni {linkObj.icon} icon"></i>
  <div>
    <span class="tile-sub-title">{linkObj.subTitle}</span>
    <span class="tile-title">{linkObj.title}</span>
  </div>
</a>

<style>
  .tile-link {
    display: inline-block;
    text-decoration: none;
    background-color: var(--clr-white);
    border-radius: 3px;
    box-shadow: 0 3px 18px rgb(0 0 0 / 5%);
    padding: 0.4em;
    transition: background-color 0.5s ease;
  }
  .tile-link:hover {
    background-color: #dce1ec;
  }
  .tile-link:active {
    animation: clickBtn 0.5s cubic-bezier(0.55, 0.055, 0.675, 0.19);
  }
  .icon {
    text-decoration: none;
    font-size: 28px;
    padding: 0.3em;
    border-radius: 50%;
    background-color: var(--clr-off-white);
    color: var(--clr-txt);
  }
  .tile-link div {
    display: grid;
    line-height: 1.3;
  }
  .tile-sub-title {
    color: var(--clr-grey);
    font-size: 19px;
    font-variant: small-caps;
    font-family: var(--font-quicksand);
  }
  .tile-title {
    font-family: var(--font-nunito);
    font-size: 19px;
    text-transform: capitalize;
    letter-spacing: 1px;
  }
</style>