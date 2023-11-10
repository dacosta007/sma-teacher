import { redirect } from "@sveltejs/kit";


export async function load({ cookies }) {
  // unset session ID cookies & redirect user to homepage
  cookies.set('sessionId', '', {
    path: '/',
    expires: new Date(0)
  })
  cookies.set('user', '', {
    path: '/',
    expires: new Date(0)
  })
  throw redirect(302, '/')
}

/** @type {import('./$types').Actions} */
export const actions = {
  default: async ({ cookies }) => {
    cookies.set('sessionId', '', {
      path: '/',
      expires: new Date(0)
    })
    cookies.set('user', '', {
      path: '/',
      expires: new Date(0)
    })

    // redirect to home page
    throw redirect(302, '/')
  }
}