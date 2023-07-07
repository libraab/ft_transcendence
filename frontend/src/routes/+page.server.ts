import { hostname } from '../hostname.js';
import { redirect } from '@sveltejs/kit'; 

export async function load( {cookies, fetch} ) {
	const authToken = cookies.get('jwt_cookie');
	
	if (authToken === undefined)
		throw redirect(307, "/login");

	console.log(authToken);

	const id42 = cookies.get('id42');
	
	console.log(id42);

	try
	{
		console.log(`http://${hostname}:3000/dashboard/${id42}`);
		let img_path;
		const response = await fetch(`http://${hostname}:3000/dashboard/${id42}`, {
				headers: { 'Authorization': `Bearer ${authToken}` }
			});

		console.log('-----------------------');
		console.log(response);
		console.log('-----------------------');

		if (response.ok)
		{
			const data = await response.json();
			if (data.img !== "undefined")
				img_path = data.img;
			else
				img_path = "";
			return {
				isDFAActive: data.Dfa,
				id: data.id,
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


