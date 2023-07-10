import { hostname } from '$lib/hostname.js';
import { error, redirect } from '@sveltejs/kit'; 

	// @ts-ignore
	async function fetchAllRoomMembers(id42, roomName)
	{
		try
		{
			const response = await fetch(`http://${hostname}:8080/api/rooms/allMemberwithStatus/${id42}/${roomName}`);
			if (response.ok)
				return await response.json();
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
		throw redirect(307, "/");

	const id42 = cookies.get('id42');
	const roomName = params.salon;
	let ret = await fetchAllRoomMembers(id42, roomName)
	if (ret instanceof Response)
	{
		throw error(ret.status, {
			message: ret.statusText
		});
	};
	return {
		members: ret,
		room: params.salon
	}

	// try
	// {
	// 	let img_path;
	// 	const response = await fetch(`http://${hostname}:3000/dashboard/${id42}`, {
	// 			headers: { 'Authorization': `Bearer ${authToken}` }
	// 		});

	// 	if (response.ok)
	// 	{
	// 		const data = await response.json();
	// 		if (data.img !== "undefined")
	// 			img_path = data.img;
	// 		else
	// 			img_path = "";
	// 		return {
	// 			id: data.id,
	// 			userId42: id42,
	// 			resOk: true,
	// 			img_path: img_path,
	// 			members: ret,
	// 			room: params.salon
	// 		}
	// 	}
	// 	else {
	// 		throw redirect(307, "/login");
	// 	}
	// }
	// catch (error) {
	// 	throw redirect(307, "/login");
	// }
}

