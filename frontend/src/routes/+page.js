import { hostname } from '../hostname.js';
import { browser } from '$app/environment';
import { userId42, img_path, id} from '../stores.js';
import { redirect } from '@sveltejs/kit'; 

let isDFAActive;

async function fetchData()
{
		
	let headingElement = document.querySelector('jwt_cookie');
	
	if (!headingElement)
	{
		return {
			status: 307,
			redirect: '/login',
			resOk: false
		};
	}
	try
	{
		const cookieValue = headingElement
			.split('; ') 
			.find(cookie => cookie.startsWith('jwt_cookie'))
			.split('=')[1];
		
		const id42 = headingElement
			.split('; ')
			.find(cookie => cookie.startsWith('id42'))
			.split('=')[1];
		userId42.set(id42);
		const response = await fetch(`http://${hostname}:3000/dashboard/${id42}`, {
			headers: { 'Authorization': `Bearer ${cookieValue}` }
		});
		if (response.ok)
		{
			const data = await response.json();
			if (data.img !== "undefined")
			{
				img_path.set(data.img);
			}
			id.set(data.id);
			isDFAActive = data.Dfa;
			return {
				isDFAActive: isDFAActive,
				img_path: img_path,
				id: id,
				userId42: userId42,
				resOk: true
			}
		}
		else
		{
			throw new Error('Failed to fetch dashboard data');
		}
		}
	catch (error)
	{
		console.error(error);
	}
}

export async function load( event ){
	//const response = await fetchData();
	//return response;
}

