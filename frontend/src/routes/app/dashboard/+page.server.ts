// import { redirect } from "@sveltejs/kit";

// export async function load({ cookies, fetch }) {
// 	const authToken = cookies.get('jwt_cookie');
// 	console.log("LOAD CALLED");
// 	// return {roomId: roomId}
// 	const url_api_fl = `http://localhost:8080/api/dashboard/history/${id}`;

// 	if (authToken === undefined) throw redirect(307, "/");
	
// 	return await fetch(url_api_fl, {
// 			method: "GET",
// 			headers: {
// 				'Authorization': `Bearer ${authToken}`
// 			}
// 		}).then(async (res) => {
// 			let resjson = await res.json();
// 			console.log(resjson);
// 			return {
// 				fl: resjson,
// 			}
// 		}).catch(() => {
// 			return {
// 				fl: [],
// 			}
// 	})
// }

import { redirect } from "@sveltejs/kit";

export async function load({ cookies, params, fetch }) {
	const authToken = cookies.get('jwt_cookie');
	const id42 = cookies.get('id42');
	console.log("LOAD CALLED");
	// return {roomId: roomId}
	const url_api_history = `http://localhost:8080/api/dashboard/history/${id42}`;
	const url_api_stats = `http://localhost:8080/api/dashboard/stats/${id42}`;

	if (authToken === undefined) throw redirect(307, "/");
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
					return [];
			})
			.catch((error) => {
				return [];
	});

	return await fetch(url_api_stats, {
			method: "GET",
			headers: {
				'Authorization': `Bearer ${authToken}`
			}
		}).then(async (res) => {
			return {
				stats: await res.json(), 
				history: history,
			}
		}).catch(() => {
			return {
				stats: null,
				history: history,
			}
	})
}
