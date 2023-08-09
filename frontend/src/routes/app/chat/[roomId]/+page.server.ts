import { redirect } from "@sveltejs/kit";

export async function load({ cookies, params, fetch }) {
	const authToken = cookies.get('jwt_cookie');
	const roomId = params.roomId;
	console.log("LOAD CALLED");
	// return {roomId: roomId}
	const url_api_message = `http://localhost:8080/api/chat/messages/${params.roomId}`;
	const url_api_members = `http://localhost:8080/api/chat/room/${params.roomId}`;
	const url_api_status = `http://localhost:8080/api/chat/room/${params.roomId}/status`;

	if (authToken === undefined) throw redirect(307, "/");
	const members = await fetch(url_api_members, {
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

	const status = await fetch(url_api_status, {
			method: 'GET',
			headers: {
				'Authorization': `Bearer ${authToken}`
			}
		})
		.then(async (response) => {
			if (response.ok)
				return await response.json();
			else
				return null;
		})
		.catch((error) => {
			return null;
	});

	return await fetch(url_api_message, {
			method: "GET",
			headers: {
				'Authorization': `Bearer ${authToken}`
			}
		}).then(async (res) => {
			return {
				roomId,
				messages: await res.json(), 
				members: members,
				status : status,
			}
		}).catch(() => {
			return {
				roomId,
				messages: [],
				members: members,
				status: status,
			}
	})
}
