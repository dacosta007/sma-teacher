import { results } from "$db/collections/results"
import { students } from "$db/collections/students"
import { error } from "@sveltejs/kit"

export async function load({ params, cookies }) {
  /* --- TODO:
    check if teacher checking student's report is the handler of such student's class :
    - get teacher's classes handle info
    - cross reference student's class to the teacher's handle classes
    - if not match, throw/show error message('You are not permitted to view this report')
    - if all goes well display the student's report
  --- */

  // get the teacher's info
  let docId = params.docId
  let teacher = JSON.parse(cookies.get('user'))
  let teachClasses = teacher.classes
  let sessionId = cookies.get('sessionId')

  // check if not logged in
  if (sessionId === undefined || sessionId === null) {
    throw redirect(302, '/auth/login')
  }

  try {
    let query = { "meta.studtId": docId }
    let queryStd = { "studtId":  docId }
    let queryOpt = { projection: { _id: 0 } }
    
    let res = await results.findOne(query, queryOpt)
    let stdInfo = await students.findOne(queryStd, queryOpt)

    return { res, docId, stdInfo }
  } catch (err) {
    console.log(`Error Result Page: ${err}`)

    throw error('500', { message: 'Server Error: Please try again in a little while' })
  }
}