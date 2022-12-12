import { teachers } from "$db/collections/teachers"

import z from "zod"
import * as bcrypt from "bcrypt"
import { redirect } from "@sveltejs/kit"

const registerSchema = z.object({
  teachId: z
    .string({ required_error: "Teacher's ID is required!" })
    .min(10, { message: "Teacher's ID length is invalid" })
    .max(10, { message: "Teacher's ID length is invalid" })
    .trim(),
  email: z
    .string({ required_error: "Email is requied" })
    .max(64, {message: "Invalid email length"  })
    .email(),
  password: z
    .string({ required_error: "Password is required!" })
    .min(6, { message: "Invalid password length" })
    .max(32, { message: "Invalid password length" })
    .trim()
})

export const actions = {
  register: async ({ request, locals, cookies }) => {
    let signupFrm = await request.formData()
    let frmData = Object.fromEntries([...signupFrm])

    try {
      let user = registerSchema.parse(frmData)

      // hash password
      let hashPwd = await bcrypt.hash(frmData.password, 10)

      /* ---- get teacher's info ---- */
      let query = { teachId: user.teachId }
      let getTeach = await teachers.findOne(query)
      if (getTeach.teachId != user.teachId) {
        return {
          error: true,
          message: "Invalid user credentials"
        }
      }
      if (getTeach.verified || getTeach.verified === true) {
        return {
          error: true,
          message: "Already a registered teacher!"
        }
      }

      /* ---- update teacher's info ---- */
      let updtQuery = { $set: { password : hashPwd, verified: true } }
      let updateTeach = await teachers.updateOne({ teachId: getTeach.teachId }, updtQuery)

      if (updateTeach.modifiedCount != 1 && updateTeach.acknowledge != true) {
        return {
          error: true,
          message: 'Please try again later!'
        }
      }

      /* --- set the user to be granted access on protected pages --- */
      let teachData = JSON.parse(JSON.stringify(getTeach))
      
      // remove password from the object
      delete teachData.password

      // generate user session ID token
      let userToken = crypto.randomUUID()
      teachData.token = userToken

      // will be requested in all protected routes
      locals.user = teachData
      cookies.set('sessionId', userToken, { secure: false, path: '/' })
      cookies.set('user', JSON.stringify(teachData), { secure: false, path: '/' })
    } catch (err) {
      if (err.flatten) {
        // help hold all the required field validation schema errors
        const { fieldErrors: errors } = err.flatten()
        // send back the user's data(never send back password)
        const { teachId, email } = frmData

        return {
          error: true,
          errors,
          teachId,
          email
        }
      }

      // some error from server(i.e: from database connection)
      console.log(err)
    }

    // redirect user to protected route(i.e: dashboard page)
    throw redirect(303, '/auth/dashboard')
  }
}