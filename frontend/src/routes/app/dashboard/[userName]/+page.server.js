import { error, redirect } from '@sveltejs/kit'; 

export async function load( {cookies, fetch, params} ) {
	const authToken = cookies.get('jwt_cookie');
	
	if (authToken === undefined)
		throw redirect(307, "/");

	return (
		{
			userName: params.userName,
		}
	)
}
