import { redirect } from "@sveltejs/kit";

export async function load({ cookies, fetch }) {
	const authToken = cookies.get('jwt_cookie');

	const url_api_fl = `http://localhost:8080/api/dashboard/fl`;

	if (authToken === undefined) throw redirect(307, "/");
	
	return await fetch(url_api_fl, {
			method: "GET",
			headers: {
				'Authorization': `Bearer ${authToken}`
			}
		}).then(async (res) => {
			let resjson = await res.json();
			return {
				fl: resjson,
			}
		}).catch(() => {
			return {
				fl: [],
			}
	})
}