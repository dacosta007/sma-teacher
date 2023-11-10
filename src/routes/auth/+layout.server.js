import { branches } from "$db/collections/branches"

export async function load() {
  try {
    let query = { "branch.code": "002" }
    let branchData = await branches.findOne(query, { projection: { _id: 0, academicYear: 1, contact: 1 } })

    return {
      branchData
    }
    
  } catch (err) {
    console.log(err)
  }
}