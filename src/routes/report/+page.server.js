import { results } from "$db/collections/results"
import { branches } from "$db/collections/branches"
import { resultPreferences } from "$db/collections/resultPreferences"
import { redirect, error } from "@sveltejs/kit"


export async function load({ locals, cookies }) {
  // redirect user to login page if not signed-in
  if (cookies.get('sessionId') === undefined || cookies.get('sessionId') === null) {
    throw redirect(302, '/auth/login')
  }

  // get user's required info & credentials
  let sessionId = cookies.get('sessionId')
  let user = JSON.parse(cookies.get('user'))

  /* --- classes handled by teacher & subjects he/she teaches --- */
  let teachClasses = [...new Set(user.subjects.map(ele => ele.class))]
  let teachSubjs = user.subjects
  
  try {
    /* --- get the sch branch --- */
    let branchData = await branches.findOne({ 'branch.code': '002' }, { _id: 0, academicYear: 1 })
    
    // get reports for the current session from db
    async function resultDataForCurrentSession() {
      const branchCurrentSession = branchData?.academicYear?.session
      const queryParams = { 'meta.session': branchCurrentSession }
      let resultData = await results.find(queryParams, { projection: { _id: 0 } }).toArray()
      return resultData
    }
    
    /* --- filter out the students for teacher's class --- */

    return {
      results: resultDataForCurrentSession(),
      classes: teachClasses,
      teachSubjs: teachSubjs
    }
  } catch (err) {
    throw error((err.status ?? 500), 'Something went wrong, and able to load student data. Please try again in a little while')
  }
}