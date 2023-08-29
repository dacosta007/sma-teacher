// import { startDB } from "$db/mongo";

// // start db(to run ones whatn the server first loads)
// startDB().then(() => {
//   console.log('MongoDB started!')
// }).catch(err => {
//   console.error(err)
// })

// export const handle = async ({ event, resolve }) => {
//   // help set the logged in user
//   // event.locals.user = {}
//   // event.cookies.set('sessionId', '', { secure: false, path: '/' })
//   // console.log(event.cookies)

//   const response = await resolve(event)

//   // TODO: secure before production
//   // response.headers.set('set-cookies')
//   return response
// }