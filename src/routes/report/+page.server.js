import { results } from "$db/collections/results"
import { resultPreferences } from "$db/collections/resultPreferences"
import { redirect } from "@sveltejs/kit"


export async function load({ locals, cookies }) {
  if (cookies.get('sessionId') === undefined || cookies.get('sessionId') === null) {
    throw redirect(302, '/auth/login')
  }

  let sessionId = cookies.get('sessionId')
  let user = JSON.parse(cookies.get('user'))

  /* --- classes handled by teacher & subjects he/she teaches --- */
  let teachClasses = [...new Set(user.subjects.map(ele => ele.class))]
  let teachSubjs = user.subjects
  console.log(teachClasses)
  let levels = teachClasses.map(ele => ele.match(/\d/)[0])
  let categories = teachClasses.map(ele => ele.slice(0, 3))
  let subLevels = teachClasses.map(ele => ele.slice(ele.length - 1))

  // console.log({ categories, levels, subLevels })
  let totRept = []
  try {
    // get reports from db
    let queryOpt = { projection: { _id: 0 } }
    let reports = await results.find({}, queryOpt).toArray()
    
    /* --- filter out the students for teacher's class --- */
    
    
    return {
      results: reports,
      classes: teachClasses,
      teachSubjs: teachSubjs
    }
  } catch (error) {
    console.log(error)
  }
}