import { hostname } from '../../../hostname.js';
import { redirect } from '@sveltejs/kit'; 

	// @ts-ignore
	async function fetchAllRoomMembers(id42, roomName)
	{
		try
		{
			const response = await fetch(`http://${hostname}/allMemberwithStatus/${id42}/${roomName}`);
			if (response.ok)
				return await response.json();
			else
			{
				console.error("room server.js: couldn't fetch room members");
				return null;
			}
		}
		catch (error)
		{
			console.error(error);
		}
	}

export async function load( {cookies, fetch, params} ) {
	const authToken = cookies.get('jwt_cookie');
	
	if (authToken === undefined)
		throw redirect(307, "/login");

	const id42 = cookies.get('id42');

	try
	{
		let img_path;
		const response = await fetch(`http://${hostname}:3000/dashboard/${id42}`, {
				headers: { 'Authorization': `Bearer ${authToken}` }
			});

		if (response.ok)
		{
			const data = await response.json();
			if (data.img !== "undefined")
				img_path = data.img;
			else
				img_path = "";
			return {
				id: data.id,
				userId42: id42,
				resOk: true,
				img_path: img_path,
				members: await fetchAllRoomMembers(id42, params.salon)
			}
		}
		else
		{
			console.error("smthing went wrong: cannot fetch data");
			throw redirect(307, "/login");
		}
	}
	catch (error)
	{
		console.error(error);
		throw redirect(307, "/login");
	}
}

