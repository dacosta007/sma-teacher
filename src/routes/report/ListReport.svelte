<script>
  import { createEventDispatcher } from "svelte"
  import { BranchInfoStore } from "$lib/stores/BranchInfoStore"
  import { gradeScore } from "$lib/utils/gradeScore"

  import Modal from "$lib/shared/Modal.svelte"
  import Button from "$lib/shared/Button.svelte"
  import AddSubj from "./AddSubj.svelte"
  import AddComment from "./AddComment.svelte"

  export let allStudts
  export let classes
  export let teachSubjs

  console.log(`classes: ${classes}`)
  let dispatch = createEventDispatcher()

  let studts = allStudts
  let listStudt = studts
  // holds records on clicked student
  let subjects = []

  // sch branch details
  let { academicYear } = $BranchInfoStore
  
  let btnProps = {
    btnType: 'button',
    success: true
  }

  let commentBtn = {
    btnType: 'button',
    sec: true
  }

  let stdDetail = studts[0] ?? {}
  let currentAddedSubj = []

  // hold exam records already computed for the present current term
  let allComputed = studts.some(ele => {
    if (ele.exam.report === undefined) {
      return false
    }
    return ele.exam?.report[academicYear.currentTerm] != undefined
  })
  
  // if there are no report already computed for the current term
  if (allComputed === false) {
    allComputed = []
  }

  // if there are any report computed for the current term
  if (allComputed) {
    switch (academicYear.currentTerm) {
      case 'first':
        allComputed = studts.filter(ele => ele.exam.report?.first)
      break;
  
      case 'second':
        allComputed = studts.filter(ele => ele.exam.report?.second)
      break;
  
      case 'third':
        allComputed = studts.filter(ele => ele.exam.report?.third)
      break;
    
      default:
        allComputed = []
      break;
    }
  }
  
  // filter out all teachers subject teaches
  let allTeachSubjs = [...new Set(teachSubjs.map(ele => (ele.subj).toLowerCase()))]
  // console.log(`All Teacher's Subjects: ${allTeachSubjs}`)

  // holds principal and teacher's comments
  let tComment = '', pComment = ''
  // marks obtained & obtainable
  let obtnd = currentAddedSubj.length > 0 ? currentAddedSubj.reduce((acc, ele) => ele.totalMark + acc, 0) : 0;
  let obtbl = 70 // (should be gotten from DB i.e: resultPref.exam.obtainable)
  let midTermObtbl = 30 // (should be gotten from DB i.e: resultPref.midTerm.obtainable)
  $:addedSubjs = currentAddedSubj

  // help get report subject CA score recorded for mid-term test
  let caScore = 0
  function getCAScore(event) {
    // check if subject CA for the midTerm, for the current term has been recorded(i.e: check if is a new session and nothing as been recorded)
    if (stdDetail?.midTerm === undefined || stdDetail?.midTerm?.report === undefined || stdDetail?.midTerm?.report[academicYear.currentTerm] === undefined) {
      caScore = 0
      return
    }
    let subjTitle = event.target.value
    let getSubj = stdDetail.midTerm.report[academicYear.currentTerm].find(ele => ele.subj === subjTitle)
    caScore = getSubj.totalMark
  }

  // handles adding subject 
  function addSubj(event) {
    let frm = event.target
    let totalMark = parseInt(frm.CA.value) + parseInt(frm.exam.value)
    let performanceAvg = ((totalMark / (obtbl + midTermObtbl)) * 100).toFixed(2)

    let frmData = {}
    frmData.obtainable = (obtbl + midTermObtbl)
    frmData.subj = frm.subj.value
    frmData.CA = parseInt(frm.CA.value)
    frmData.exam = parseInt(frm.exam.value)
    frmData.totalMark = totalMark
    frmData.performanceAvg = parseFloat(performanceAvg)
    let { grade, gradeClr } = gradeScore(parseFloat(performanceAvg))
    frmData.grade = grade
    frmData.gradeClr = gradeClr

    // when subject isn't part of what the subject teacher teaches
    // console.log(`Selected subject: ${frmData.subj}`)
    // if (allTeachSubjs.includes((frmData.subj).toLowerCase()) === false) {
    //   alert(`🛑 "${frmData.subj}" isn't part of your subject!`)
    //   // frm.reset()
    //   return
    // }

    if (currentAddedSubj.length <= 0) {
      currentAddedSubj = [frmData]
      frm.reset()
      return
    }

    // help remove duplicate
    if (currentAddedSubj.some(ele => ele.subj === frmData.subj)) {
      alert(`${frmData.subj} is all ready added`)
      // clear all form fields
      frm.reset()
      return
    }

    // currently added teacher's subject and other teachers subjects
    currentAddedSubj = [frmData, ...currentAddedSubj]
    // clear form fields
    frm.reset()
  }

  // add record into store
  function addRecord() {
    if (currentAddedSubj.length <= 0) {
      alert('No subject added yet!')
      return
    }

    // help calculate cummulative scores for exam
    let obtainable = (parseInt(midTermObtbl) + parseInt(obtbl)) * currentAddedSubj.length
    let obtained = currentAddedSubj.reduce((acc, ele) => ele.totalMark + acc, 0)
    let percentage = parseFloat(((obtained / obtainable) * 100).toFixed(2))
    let totalSubj = currentAddedSubj.length
    let cummulative = {obtainable, obtained, percentage, totalSubj}
    // console.log(stdDetail) 
    // first time of computing report for the current term(exam obj field property not set)
    if (stdDetail.exam.report === undefined) {
      stdDetail.exam = { report: {}, comments: {}}
    }
    stdDetail.exam.report[academicYear.currentTerm] = []
    stdDetail.exam.comments[academicYear.currentTerm] = { teacher: '', principal: '' }
    
    // stdDetail.cummulative.exam = { first: {}}
    stdDetail.exam['report'][`${academicYear.currentTerm}`] = currentAddedSubj
    stdDetail.exam['comments'][`${academicYear.currentTerm}`]['teacher'] = tComment
    stdDetail.exam['comments'][`${academicYear.currentTerm}`]['principal'] = pComment
    stdDetail.cummulative.exam[`${academicYear.currentTerm}`] = cummulative
    stdDetail.meta.updatedAt = new Date().toLocaleDateString()
    // TODO: term should be set automatically(by admin in his portal)/manually(by class teachers)
    stdDetail['term'] = academicYear.currentTerm
    stdDetail['reportType'] = 'exam'
    // console.log(stdDetail)
    
    fetch('/api/result/exam', {
      method: 'PUT',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(stdDetail)
    })
      .then(res => res.json())
      .then(res => {
        // console.log(res)

        // error on update
        if (res.error) {
          alert(`🚨 ${error.message}`)
          return
        }

        // update all records computed for exams ('allComputed' variable)
        let indx = allComputed.findIndex(ele => ele.meta.studtId === stdDetail.meta.studtId)
        if (indx === -1) {
          allComputed = [stdDetail, ...allComputed]
          // console.log(allComputed)
          // close compute modal & clear currentAddedSubj
          currentAddedSubj = []
          showModal = false

          // console.log('modal window closed!')
          alert('Report is successfully updated 😀')
        }
        if (indx > -1) {
          allComputed[indx] = stdDetail
          // console.log(allComputed)
          // close compute modal & clear currentAddedSubj
          currentAddedSubj = []
          showModal = false

          // console.log('modal window closed!')
          alert('Report is successfully updated 😀')
        }
        // update current added records statistics
        dispatch('addRptStat', allComputed.length)
      })
      .catch(err => console.log(err))
    
    return
  }

  function filterList(event) {
    // check if not empty value passed or selected
    if (event.target.value === '') { 
      listStudt = studts
      return
    }
    
    // show students of the first class the teacher handles
    let category = (event.target.value).slice(0, 3)
    let level = (event.target.value).match(/\d/g)[0]
    let subLevel = (event.target.value).slice(event.target.value.length - 1)

    if (category === '' & level === '') {
      listStudt = allStudts
      return
    }

    listStudt = allStudts.filter(items => items.meta.class.category === category && items.meta.class.level === level && items.meta.class.subLevel === subLevel)
  }

  // help remove added subj
  function removeSubj(evt) {
    let subjRemove = evt.detail
    // check if it is part of the teacher's handled subject
    // if (allTeachSubjs.includes((subjRemove).toLowerCase()) === false) {
    //   alert("🛑 You aren't permitted to remove this subject!")
    //   return
    // }
    currentAddedSubj = currentAddedSubj.filter(s => s.subj != subjRemove)
  }

  // open compute modal and set student's detail result is to be computed
  let showModal = false
  function computeModal(event) {
    let stdId = event.target.dataset.stdId
    let std = allStudts.find(s => s.meta.studtId === stdId)

    // console.log('All previously computed reports:', allComputed.length)

    if (allComputed.length > 0) {
      let getRept = allComputed.find(ele => ele.meta.studtId === stdId)
      // if no exam record is yet to recorded(i.e: at initial stage)
      if ( getRept === undefined ) {
        getRept = currentAddedSubj
        // get previously add computed subjects(from mid-term record of the same term)
        subjects = std.midTerm.report[academicYear.currentTerm].map(ele => ele.subj)
        stdDetail = std
        showModal = true
        return
      }
      
      // set teacher's and principal's comments if available
      tComment = getRept.exam.comments[`${academicYear.currentTerm}`].teacher ?? ''
      pComment = getRept.exam.comments[`${academicYear.currentTerm}`].principal ?? ''

      /* --- all subject and scores previously computed: --- */
      // records from exam record computed for the term(current term)
      let records = getRept.exam.report[`${academicYear.currentTerm}`]
      currentAddedSubj = records

      // recorded subjects from midTerm already computed(subject teacher teaches)
      let allExamSubjs = getRept.midTerm.report[academicYear.currentTerm].map(ele => ele.subj)
      // subjects = allExamSubjs.filter(ele => allTeachSubjs.includes(ele.subj))
      subjects = allExamSubjs

      // show current clicked student
      stdDetail = std
      showModal = true
      return
    }

    // get previously add computed subjects(which the teacher, teaches)
    subjects = std.midTerm.report[academicYear.currentTerm].map(ele => ele.subj)
    // subjects = subjects.filter(ele => allTeachSubjs.includes(ele.subj))

    // show current clicked student
    stdDetail = std
    showModal = true
  }

  // help close the modal window and clear compute records
  function closeComputeModal(evt) {
    // reset the compute form record & close modal window
    currentAddedSubj = []

    showModal = evt.detail
  }

  // help show result slip
  let disableLink = true;
  function veiwResult() {
    // check if result is saved before previewing 
    let chkRpt =  allComputed.findIndex(ele => ele.meta.studtId === stdDetail.meta.studtId)
    if (chkRpt === -1) {
      disableLink = true;
      alert(`Please save/add "${stdDetail.meta.name.first} ${stdDetail.meta.name.last}'s"  report record before previewing!`)
      return
    }
    disableLink = false;
  }

  let addReptComment = false
  // handles adding report comments
  function reportComments(evt) {
    tComment = evt.detail.tComment
    pComment = evt.detail.pComment
    
    addReptComment = false;
  }

  // show section for adding comments on report
  function showCommentSec() {
    // console.log(stdDetail)
    addReptComment = true
  }
</script>


<Modal showModal={showModal} on:closeModal={closeComputeModal}>
  <!-- student's detail(i.e name, class, no_ of subjects added) -->
  <header class="rec-info-header">
    <div class="compute-info">
      <span>{stdDetail?.meta?.name.first} {stdDetail?.meta?.name.last}</span>
      <span>
        <span>{stdDetail?.meta?.class.category} {stdDetail?.meta?.class.level}</span><sup style="text-transform: uppercase;">{stdDetail?.meta?.class.subLevel}</sup>
      </span>
    </div>

    <!-- added subjects info -->
    <div class="subj-stat">
      <span>subjects added</span> <span>{addedSubjs.length}/{subjects.length}</span>
    </div>
  </header>

  <!-- help add subject -->
  <section class="addRec-container">
    <form class="addRec-sec" on:submit|preventDefault={addSubj}>
      <!-- Subject already recorded -->
      <div class="input-field">
        <label for="subj">subject</label>
        <select name="subj" id="subj" on:change={getCAScore}>
          <option value="" style="color: var(--clr-grey);">Add Subject</option>
          {#each subjects as subj}
            <option value="{subj}">{subj}</option>
          {/each}
        </select>
      </div>
      
      <!-- Mid-Term CA(total marks on subject selected) -->
      <div class="input-field">
        <label for="CA"><span>CA</span></label>
        <input type="number" name="CA" id="CA" min="0" bind:value={caScore} readonly>
      </div>

      <!-- Exam(not more than resultPref) -->
      <div class="input-field">
        <label for="exam"><span>Exam</span></label>
        <input type="number" name="exam" id="exam" min="0" max="{obtbl}" maxlength="2" required>
      </div>

      <!-- add button -->
      <Button btnType={"submit"} info={true} block={true}>add</Button>
    </form>
  </section>

  <!-- section for all added subjects/records -->
  <section class="show-add-rec">
    <!-- display where to add comments to records -->
    {#if addReptComment}
      <AddComment 
        on:reportComments={reportComments} 
        on:closeCommentSec={(evt) => addReptComment = evt.detail} 
        {addReptComment} 
        reportData={currentAddedSubj} 
        {tComment} 
        {pComment}
      />
    {/if}
    <!-- display added subjects -->
    {#each currentAddedSubj as subjs}
      <AddSubj subj={subjs} on:removeSubj={removeSubj} />
    {:else}
      <h2 class="center-text" style="color: var(--clr-grey); font-family: var(--font-quicksand); font-weight: 300;">
        There are no subjects added yet!
      </h2>
    {/each}
  </section>

  <!-- action button to close or save record -->
  <footer class="cta-footer">
    <a href="report/{stdDetail?.meta?.studtId ?? '#'}" rel="noreferrer" target="_blank" on:click={veiwResult} disabled={disableLink} style="text-decoration: none;">
      <Button btnType={'button'} sec={true} btnDisabled={disableLink}>
        <i class="ti ti-eye"></i> <span>preveiw</span>
      </Button>
    </a>

    <div class="save-cta">
      <Button {...btnProps} on:click={addRecord}>
        <i class="ti ti-save"></i> <span>add record</span>
      </Button>

      <Button {...commentBtn} on:click={showCommentSec}>
        <i class="ti ti-pencil"></i> <span>comment</span>
      </Button>
    </div>
  </footer>
</Modal>

<section>
  <header class="pg-header">
    <div class="input-field">
      <select placeholder=""  name="filterStudt" on:change={filterList} style="text-transform: uppercase;">
        <option value="">Filter Students By Classes</option>
        <option value="jss 1a">JSS 1A</option>
        <option value="jss 1b">JSS 1B</option>
        <option value="jss 2a">JSS 2A</option>
        <option value="jss 2b">JSS 2B</option>
        <option value="jss 3a">JSS 3A</option>
        <option value="jss 3b">JSS 3B</option>
        <option value="sss 1a">SSS 1A</option>
        <option value="sss 1b">SSS 1B</option>
        <option value="sss 2a">SSS 2A</option>
        <option value="sss 2b">SSS 2B</option>
        <option value="sss 3a">SSS 3A</option>
        <option value="sss 3b">SSS 3B</option>
      </select>
    </div>
  </header>

  <article class="studts-container">
    {#each listStudt as std}
      <div class="show-info-sec">
        <div class="std-info">
          <div class="std-avatar">
            <div class="img">
              {#if std.meta.passport === undefined || std.meta.passport === null}
                <i  class="ti ti-user avatar-placeholder"></i>
              {/if}
              {#if std.meta.passport != undefined || std.meta.passport != null}
                <img src={std.passport} alt="student_img">
              {/if}
            </div>
          </div>
        </div>

        <div class="info">
          <div class="std-cls"><span>{std.meta.class.category} {std.meta.class.level}</span><sup>{std.meta.class.subLevel}</sup></div>
          <div class="name">{std.meta.name.first} {std.meta.name.last}</div>
          <div class="std-id">{std.meta.studtId}</div>
        </div>

        <!-- check mark for computed result -->
        <div class="computed">
          <i class="ti ti-pencil-alt" on:click|self={computeModal} on:keypress|self={computeModal} data-std-id="{std.meta.studtId}"></i>
        </div>
      </div>
    {:else}
      <p style="color: var(--accent-danger); font-weight: bold; margin-bottom: 0.8em;">
        There are no records of students for the selected class yet. Please make sure all Mid-Term records 
        for the class has been successfully recorded or add first.
      </p>
      <div class="center-text">
        <a href="/auth/dashboard">Back to Dashboard</a>
      </div>
    {/each}
  </article>
</section>

<style>
  .pg-header .input-field {
    min-width: 424px;
  }
  .studts-container {
    padding: 0 1.5em;
  }
  .show-info-sec {
    border-radius: 5px;
    min-width: 360px;
    background-color: white;
    padding: 0.4em;
    margin-bottom: 1em;
    display: grid;
    grid-template-columns: auto 4fr 1fr;
  }
  .std-info {
    display: grid;
    grid-template-columns: 70px 3fr 1fr;
    gap: 0.5em;
  }
  .std-avatar {
    position: relative;
    width: 100%;
  }
  .std-avatar .img {
    width: 100%;
    position: relative;
    overflow: hidden;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-top: 0.2em;
    height: 70px;
    border-radius: 50%;
  }
  .std-avatar .img img {
    position: absolute;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    border-radius: 50%;
  }
  .std-avatar i {
    font-size: 28px;
    border-radius: 50%;
    padding: 0.6em;
    background-color: var(--accent-info-lite);
    color: var(--accent-info);
  }
  .info {
    padding: 0.1em;
    line-height: 1.4;
  }
  .info .name {
    text-transform: capitalize;
  }
  .std-cls {
    text-transform: uppercase;
    font-size: 14px;
  }
  .std-cls sup {
    color: var(--accent-info);
  }
  .std-id {
    color: var(--clr-grey);
    font-size: 14px;
  }
  .computed {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .computed i {
    font-size: 22px;
    z-index: 2;
    padding: 0.4em;
    border-radius: 50%;
  }
  .computed i:hover {
    background-color: rgb(227, 232, 248);
    transition: 0.5s ease;
    cursor: pointer;
  }
  .computed i:active {
    animation: clickBtn 500ms ease;
  }
  .rec-info-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 0.5em;
    background-color: var(--clr-sec);
    color: var(--clr-off-white);
    padding: 1em 0.5em;
    margin: 1em 0;
  }
  .compute-info {
    text-transform: capitalize;
  }
  .subj-stat {
    text-transform: capitalize;
    font-size: 15px;
  }
  .subj-stat span:nth-child(2) {
    background-color: var(--accent-info);
    padding: 3px;
    border-radius: 4px;
    font-family: var(--font-quicksand);
  }
  .addRec-sec {
    display: grid;
    grid-template-columns: 3fr 1fr 1fr 1fr;
    justify-content: center;
    align-items: center;
  }
  .show-add-rec {
    padding: 0.2em 0;
    border: 1px solid var(--clr-off-white);
    margin-bottom: 1em;
    height: 350px;
    overflow: auto;
    position: relative;
    isolation: isolate;
  }
  .show-add-rec::-webkit-scrollbar {
    width: 6px;
  }
  .show-add-rec::-webkit-scrollbar-thumb {
    border-radius: 5px;
    background-color: var(--clr-off-white);
  }
  .cta-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 0.4em;
    gap: 2em;
  }
  .save-cta {
    display: flex;
    gap: 2em;
    align-items: center;
  }
</style>