import { hostname } from '../../hostname.js';
import { redirect } from '@sveltejs/kit'; 
import { clientName, img_path } from '../../stores.js';

// interface data {
// 	title: string,
// 	score: number,
// 	won: number,
// 	played: number,
// 	hf: string,
// 	Dfa: boolean,
// 	id: number,
// 	stats: any,
// 	fl: any[],
// }

export async function load( {cookies, fetch} ) {
	const authToken = cookies.get('jwt_cookie');
	
	if (authToken === undefined)
		throw redirect(307, "/");

	const id42 = cookies.get('id42');

	try
	{
		const response = await fetch(`http://${hostname}:8080/api/dashboard`, {
				headers: { 'Authorization': `Bearer ${authToken}` }
			});
		if (response.ok)
		{
			let vals = await response.json();
			// img_path.set(vals.img);
			// console.log("image path is : ", $img_path);
			// clientName.set(vals.name);
			return vals;
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
