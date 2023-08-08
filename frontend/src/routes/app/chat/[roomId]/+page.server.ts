import { redirect } from "@sveltejs/kit";

export async function load({ cookies, params, fetch }) {
	// const authToken = cookies.get('jwt_cookie');
	const roomId = params.roomId;
	return {roomId: roomId}
	// const url = `http://localhost:8080/api/chat/messages/${params.roomId}`;

	// if (authToken === undefined) throw redirect(307, "/");

	// return await fetch(url, {
	// 		method: "GET",
	// 		headers: {
	// 			'Authorization': `Bearer ${authToken}`
	// 		}
	// 	}).then(async (res) => {
	// 		return {
	// 			roomId,
	// 			messages: await res.json()
	// 		}
	// 	}).catch(() => {
	// 		return {
	// 			roomId,
	// 			messages: []
	// 		}
	// })
}
