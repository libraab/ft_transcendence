import { hostname } from '../../hostname.js';
import { redirect } from '@sveltejs/kit'; 

export async function load( {cookies, fetch} ) {
	const authToken = cookies.get('jwt_cookie');
	
	if (authToken === undefined)
		throw redirect(307, "/");

	const id42 = cookies.get('id42');

	try
	{
		let img_path;
		const response = await fetch(`http://${hostname}:8080/api/dashboard`, {
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
				img_path: img_path,
				id: data.id,
				userId42: id42,
			}
		}
		else
		{
			console.error("smthing went wrong: cannot fetch data");
			throw redirect(307, "/");
		}
	}
	catch (error)
	{
		console.error(error);
		throw redirect(307, "/");
	}
}
