import { branches } from "$db/collections/branches"
import { teachers } from "$db/collections/teachers"
import { redirect } from "@sveltejs/kit"

import z from "zod"
import * as bcrypt from "bcrypt"

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

// login Validation Schema
let loginSchema = z.object({
  teachId: z
    .string({ required_error: "Teacher's ID is required!" })
    .min(10, { message: "Teacher's ID length is invalid" })
    .max(10, { message: "Teacher's ID length is invalid" })
    .trim(),
  password: z
    .string({ required_error: "Password is required!" })
    .min(6, { message: "Invalid password length" })
    .max(32, { message: "Invalid password length" })
    .trim()
})

export const actions = {
  login: async ({ request, locals, cookies }) => {
    let loginFrm = await request.formData()
    let frmData = Object.fromEntries([...loginFrm])
    
    try {
      let user = loginSchema.parse(frmData)
      
      /* === get teacher's info === */
      // let hashPwd = await bcrypt.hash(user.password, 10)
      // 
      // '$2b$10$fqqQWqqoFNdouGcTFa10jO4EzeZklB1GO/NP/8GYx9jq5SncISdJG'
      let query = { teachId: user.teachId }
      let getTeacher = await teachers.findOne(query, { projection: { _id: 0 } })
      let userPwd = getTeacher.password
      let comparePwd = await bcrypt.compare(user.password, userPwd)
      if (comparePwd === false) {
        return {
          error: true,
          errors: { password: ['Invalid credentials'] }
        }
      }
      
      getTeacher = JSON.parse(JSON.stringify(getTeacher))
      
      /* 
        if all credential authenticated: 
        - set the 'locals'/headers/cookies with teacher's credentials
        - redirect teacher to dashboard 
      */
      // remove password and generate session ID token
      delete getTeacher.password
      let userToken = crypto.randomUUID()
      getTeacher.token = userToken

      // user info that will be requested in all protected routes
      locals.user = getTeacher
      cookies.set('sessionId', userToken, { secure: true, path: '/' })
      cookies.set('user', JSON.stringify(getTeacher), { secure: true, path: '/'})
      // redirect user to dashboard page
    } catch (err) {
      if (err.flatten) {
        // help hold all the required field validation schema errors
        const { fieldErrors: errors } = err.flatten()
        // send back the user's data(never send back password)
        const { teachId } = frmData
        
        return {
          error: true,
          errors,
          teachId
        }
      }

      // some error from server(i.e: from database connection)
      console.log(err)
    }
    
    throw redirect(303, '/auth/dashboard')
  }
}