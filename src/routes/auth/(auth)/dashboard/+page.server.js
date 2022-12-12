import { redirect } from "@sveltejs/kit"

export async function load({ locals, cookies }) {
  let sessionId = cookies.get('sessionId')
  let user = JSON.parse(cookies.get('user'))
  
  if (sessionId === undefined || sessionId === null) {
    throw redirect(302, '/auth/login')
  }
  
  return {}
}