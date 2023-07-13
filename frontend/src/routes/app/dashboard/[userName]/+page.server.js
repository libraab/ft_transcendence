import { error, redirect } from '@sveltejs/kit'; 

// // @ts-ignore
// async function fetchDataSupp(id42, targetName)
// {
// 	try
// 	{
// 		const response = await fetch(`/api/dashboard/getTargetWithRelation/${id42}/${targetName}`)
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

export async function load( {cookies, fetch, params} ) {
	const authToken = cookies.get('jwt_cookie');
	
	if (authToken === undefined)
		throw redirect(307, "/");

	// let supp;
	// try
	// {
	// 	const response = await fetch(`/api/dashboard/getTargetWithRelation/${id42}/${params.userName}`)
	// 	if (response.ok)
	// 	{
	// 		const data = await response.json();
	// 		supp = data;
	// 	}
	// 	else {
	// 		console.log("no supp fetched");
	// 	}
	// }
	// catch (error)
	// {
	// 	console.error(error);
	// }

	return (
		{
			userName: params.userName,
			// supp: supp,
		}
	)

	// try
	// {
	// 	const response = await fetch(`/api/dashboard/${id42}`, {
	// 			headers: { 'Authorization': `Bearer ${authToken}` }
	// 		});

	// 	if (response.ok)
	// 	{
	// 		const data = await response.json();
	// 		if (data.name === params.userName)
	// 			isClient = true;
	// 		return {
	// 			id: data.id,
	// 			id42: id42,
	// 			resOk: true,
	// 			target: params.userName,
	// 			targetMyself: isClient,
	// 			supp: supp
	// 		}
	// 	}
	// 	else
	// 	{
	// 		console.error("smthing went wrong: cannot fetch data");
	// 		throw redirect(307, "/login");
	// 	}
	// }
	// catch (error)
	// {
	// 	console.error(error);
	// 	throw redirect(307, "/login");
	// }
}
