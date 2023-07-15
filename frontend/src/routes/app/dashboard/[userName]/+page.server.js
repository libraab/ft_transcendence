import { error, redirect } from '@sveltejs/kit'; 

async function fetchDataSupp(id42, targetName, fetch, authToken)
{
	try
	{
		const response = await fetch(`http://localhost:8080/api/dashboard/getTargetWithRelation/${targetName}`, {
			method: 'GET',
			headers: {
				'Authorization': `Bearer ${authToken}`
			}
		});
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

export async function load( {cookies, fetch, params, depends} ) {
	const authToken = cookies.get('jwt_cookie');
	
	if (authToken === undefined)
		throw redirect(307, "/login");

	const id42 = cookies.get('id42');
	let isClient = false;
	let supp = await fetchDataSupp(id42, params.userName, fetch, authToken); 
	if (supp instanceof Response)
	{
		throw error(supp.status, {
			message: supp.statusText
		});
	};

	if (Number(supp.id42) === Number(id42))
	{
		isClient = true;
		throw redirect(307, "/app/dashboard");
	}
	return {
		id42: id42,
		target: params.userName,
		targetMyself: isClient,
		supp: supp,
		authToken: authToken,
	}
}