import { error, redirect } from '@sveltejs/kit'; 

async function fetchDataSupp(id42, targetName, fetch)
{
	try
	{
		const response = await fetch(`api/dashboard/getTargetWithRelation/${id42}/${targetName}`)
		if (response.ok)
		{
			const data = await response.json();
			return data;
		}
		else {
			return response;
		}
	}
	catch (error)
	{
		console.error(error);
	}
	return null;
}

export async function load( {cookies, fetch, params} ) {
	const authToken = cookies.get('jwt_cookie');
	
	if (authToken === undefined)
		throw redirect(307, "/login");

	const id42 = cookies.get('id42');
	let isClient = false;
	let supp = await fetchDataSupp(id42, params.userName, fetch) 
	if (supp instanceof Response)
	{
		throw error(supp.status, {
			message: supp.statusText
		});
	};

	if (supp.name === id42)
		isClient = true;
	return {
		id42: id42,
		target: params.userName,
		targetMyself: isClient,
		supp: supp
	}
}