import {hostname} from '$lib/hostname';
import { redirect } from '@sveltejs/kit'; 

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

// export async function load( {cookies, fetch} ) {
// 	const authToken = cookies.get('jwt_cookie');
	
// 	if (authToken === undefined)
// 		throw redirect(307, "/");

// 	try
// 	{
// 		const response = await fetch(`/api/dashboard`, {
// 				headers: { 'Authorization': `Bearer ${authToken}` }
// 			});
// 		if (response.status === 200)
// 		{
// 			let vals = await response.json();
// 			return vals;
// 		}
// 		else
// 		{
// 			console.error("seems like you dont have acces, go away");
// 			console.error(response.status);
// 			throw redirect(307, "/");
// 		}
// 	}
// 	catch (error)
// 	{
// 		console.error(error);
// 		throw redirect(307, "/");
// 	}
// }
