// import { error, redirect } from '@sveltejs/kit'; 

// async function fetchDataSupp(id42, targetName, fetch, authToken)
// {
// 	try
// 	{
// 		const response = await fetch(`http://localhost:8080/api/dashboard/getTargetWithRelation/${targetName}`, {
// 			method: 'GET',
// 			headers: {
// 				'Authorization': `Bearer ${authToken}`
// 			}
// 		});
// 		if (response.ok)
// 		{
// 			const data = await response.json();
// 			return data;
// 		}
// 		else {
// 			return response;
// 		}
// 	}
// 	catch (error)
// 	{
// 		console.error(error);
// 	}
// 	return null;
// }

// export async function load( {cookies, fetch, params, depends} ) {
// 	const authToken = cookies.get('jwt_cookie');
	
// 	if (authToken === undefined)
// 		throw redirect(307, "/");

// 	const id42 = cookies.get('id42');
// 	let isClient = false;
// 	let supp = await fetchDataSupp(id42, params.userName, fetch, authToken); 
// 	if (supp instanceof Response)
// 	{
// 		throw error(supp.status, {
// 			message: supp.statusText
// 		});
// 	};

// 	if (Number(supp.id42) === Number(id42))
// 	{
// 		isClient = true;
// 		throw redirect(307, "/app/dashboard");
// 	}
// 	return {
// 		id42: id42,
// 		target: params.userName,
// 		targetMyself: isClient,
// 		supp: supp,
// 		authToken: authToken,
// 	}
// }

import { error, redirect } from "@sveltejs/kit";

export async function load({ cookies, fetch, params }) {
	const authToken = cookies.get('jwt_cookie');
	const id42 = cookies.get('id42');
	console.log("LOAD CALLED");

	const url_api_target = `http://localhost:8080/api/dashboard/getTargetWithRelation/${params.userName}`;
	
	if (authToken === undefined) throw redirect(307, "/");
	
	const target =  await fetch(url_api_target, {
		method: "GET",
		headers: {
			'Authorization': `Bearer ${authToken}`
		}
	}).then(async (res) => {
		if (res.ok)
			return await res.json();
		else
			return res;
	}).catch((err) => {
		throw error(err.status, {
			message: err.message});
	});
	
	//if fetch failed
	if (target.status)
		throw error(target.status, { message: target.statusText});
		
	if (Number(target.id42) === Number(id42))
		throw redirect(307, "/app/dashboard");
	
	if ((target.client1.length != 0 && target.client1[0].status == 1) 
		|| (target.client2.length != 0 && target.client2[0].status == 1))
		throw redirect(307, "/app/dashboard");

	const url_api_history = `http://localhost:8080/api/dashboard/history/${target.id42}`;
	const url_api_stats = `http://localhost:8080/api/dashboard/stats/${target.id42}`;
		
	const history = await fetch(url_api_history, {
				method: 'GET',
				headers: {
					'Authorization': `Bearer ${authToken}`
				}
			})
			.then(async (response) => {
				if (response.ok)
					return await response.json();
				else
					return response;
			})
			.catch((err) => {
				throw error(err.status, {
					message: err.message});
	});

	if (history.status)
		throw error(history.status, { message: history.statusText});

	const stats = await fetch(url_api_stats, {
			method: "GET",
			headers: {
				'Authorization': `Bearer ${authToken}`
			}
		}).then(async (res) => {
			if (res.ok)
				return await res.json();
			else
				return res;
		}).catch((err) => {
			throw error(err.status, {
				message: err.message});
	})

	if (stats.status)
		throw error(stats.status, { message: stats.statusText});

	return {
		target: target,
		stats: stats,
		history: history,
	}
}