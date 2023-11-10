

export async function load({ locals }) {
    let user = await locals.user
    console.log(locals)

    return { user }
};