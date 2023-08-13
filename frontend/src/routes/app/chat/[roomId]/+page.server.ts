import { redirect, error } from "@sveltejs/kit";

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
					return response;
			})
			.catch((err) => {
				throw error(err.status, {
					message: err.message});
	});

	if (members.status)
		throw error(members.status, { message: members.statusText});

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
		.catch((err) => {
			throw error(err.status, {
				message: err.message});
	});

	if (status === null)
		throw error(401, { message: 'Unauthorized'});

	const messages = await fetch(url_api_message, {
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

	if (messages.status)
		throw error(messages.status, { message: messages.statusText});

	return {
		roomId,
		messages: messages, 
		members: members,
		status : status.status,
	}
}
