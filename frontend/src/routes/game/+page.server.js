import { hostname } from '../../hostname.js';
import { redirect } from '@sveltejs/kit'; 

export async function load( {cookies, fetch} ) {
	const authToken = cookies.get('jwt_cookie');
	
	if (authToken === undefined)
		throw redirect(307, "/login");

	const id42 = cookies.get('id42');

	try
	{
		let img_path;
		let id;
		let isDFAActive;
		const response = await fetch(`http://${hostname}:3000/dashboard/${id42}`, {
				headers: { 'Authorization': `Bearer ${authToken}` }
			});

		if (response.ok)
		{
			const data = await response.json();
			if (data.img !== "undefined")
				img_path = data.img;
			else
				img_path = "/il_794xN.3892173164_egqv.avif";
			isDFAActive = data.Dfa;
			return {
				isDFAActive: isDFAActive,
				id: id,
				userId42: id42,
				resOk: true,
				img_path: img_path,
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
