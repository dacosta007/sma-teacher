
export async function load({ request, locals }) {
  console.log(request.headers)
  let userReq = request.headers
  return { userReq: JSON.parse(JSON.stringify(userReq)) }
}