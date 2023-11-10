<script>
  import { createEventDispatcher } from "svelte"
  import { gradeScore } from "$lib/utils/gradeScore"

  export let subj

  let dispatch = createEventDispatcher()

  function removeSubj() {
    dispatch('removeSubj', subj.subj)
  }
</script>

<div class="subj-sec">
  <!-- subj title -->
  <div>
    <span>{subj.subj}</span>
  </div>
  <!-- obtainable -->
  <div>
    <span>{subj.obtainable}</span>
  </div>
  <!-- CA total marks for the subject -->
  <div>
    <span>{subj.CA}</span>
  </div>
  <!-- Exam total marks for the subject -->
  <div>
    <span>{subj.exam}</span>
  </div>
  <!-- total marks -->
  <div>
    <span>{subj.totalMark}</span>
  </div>
  <!-- grade -->
  <div>
    <span style="color: {subj.gradeClr};">{subj.grade}</span>
  </div>
  <!-- delete btn -->
  <div class="remove-btn">
    <i class="ti ti-trash" on:click={removeSubj} on:keydown={removeSubj}></i>
  </div>
</div>

<style>
  .subj-sec {
    display: grid;
    grid-template-columns: 3fr 1fr 1fr 1fr 1fr 1fr 1fr;
    gap: 0.1em;
    padding: 0.5em 0.3em;
  }
  .subj-sec:hover {
    background-color: var(--clr-off-white);
    transition: background-color 0.5s ease;
  }
  .subj-sec div:not(:first-child) {
    font-size: 14px;
    display: flex;
    align-items: center;
  }
  .subj-sec div:last-child {
    justify-content: center;
    align-items: center;
  }
  .subj-sec div:last-child i {
    font-size: 18px;
    cursor: pointer;
    color: var(--accent-danger);
    padding: 0.3em;
    border-radius: 50%;
  }
  .subj-sec div:last-child i:hover {
    background-color: var(--accent-danger-lite);
    transition: background-color 0.5s;
  }
</style>