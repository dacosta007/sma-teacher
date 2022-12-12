import { results } from "$db/collections/results"
import { resultPreferences } from "$db/collections/resultPreferences"
import { redirect } from "@sveltejs/kit"


export async function load({ locals, cookies }) {
  if (cookies.get('sessionId') === undefined || cookies.get('sessionId') === null) {
    throw redirect(302, '/auth/login')
  }

  let sessionId = cookies.get('sessionId')
  let user = JSON.parse(cookies.get('user'))

  let teachClasses = user.classes
  let levels = teachClasses.map(ele => ele.match(/\d/)[0])
  let categories = teachClasses.map(ele => ele.slice(0, 3))
  let subLevels = teachClasses.map(ele => ele.slice(ele.length - 1))

  // console.log({ categories, levels, subLevels })
  let totRept = []
  try {
    let queryOpt = { projection: { _id: 0 } }
    let reports = await results.find({}, queryOpt).toArray()
    
    /* --- filter out the students for teacher's class --- */
    let rept1 = reports.filter(ele => {
      let query = 
        ele.meta.class.category === categories[0] 
        && ele.meta.class.level === levels[0] 
        && ele.meta.class.subLevel === subLevels[0]
  
      return query
    })
    totRept = totRept.concat(rept1)
    
    // TODO: update logic in future development
    if (teachClasses.length > 1) {
      let rept2 = reports.filter(ele => {
        let query = 
          ele.meta.class.category === categories[1] 
          && ele.meta.class.level === levels[1] 
          && ele.meta.class.subLevel === subLevels[1]
    
        return query
      })
  
      totRept = totRept.concat(rept2)
    }
    if (teachClasses.length > 2) {
      let rept3 = reports.filter(ele => {
        let query = 
          ele.meta.class.category === categories[2] 
          && ele.meta.class.level === levels[2] 
          && ele.meta.class.subLevel === subLevels[2]
    
        return query
      })
  
      totRept = totRept.concat(rept3)
    }
    if (teachClasses.length > 3) {
      let rept4 = reports.filter(ele => {
        let query = 
          ele.meta.class.category === categories[3] 
          && ele.meta.class.level === levels[3] 
          && ele.meta.class.subLevel === subLevels[3]
    
        return query
      })
  
      totRept = totRept.concat(rept4)
    }
  
    return {
      results: totRept,
      classes: teachClasses
    }
  } catch (error) {
    console.log(error)
  }


}