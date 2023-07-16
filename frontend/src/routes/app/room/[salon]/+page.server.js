import { error, redirect } from '@sveltejs/kit'; 

// @ts-ignore
async function fetchAllRoomMembers(id42, roomName, fetch)
{
	try
	{
		const response = await fetch(`http://localhost:8080/api/rooms/allMemberwithStatus/${id42}/${roomName}`);
		if (response.ok) {
			return await response.json();
		}
		else {
			return response;
		}
	}
	catch (error) {
		console.error(error);
	}
}

export async function load( {cookies, fetch, params} ) {
	const authToken = cookies.get('jwt_cookie');
	
	if (authToken === undefined)
		throw redirect(307, "/login");

	const id42 = cookies.get('id42');
	const roomName = params.salon;
	let ret = await fetchAllRoomMembers(id42, roomName, fetch)
	if (ret instanceof Response)
	{
		throw error(ret.status, {
			message: ret.statusText
		});
	}

	return {
		members: ret,
		room: params.salon,
		authToken
	}
}
