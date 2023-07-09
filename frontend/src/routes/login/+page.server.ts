export function load({ cookies }) {
	const myJwtCookie = cookies.get('jwt_cookie');

	return {
		myJwtCookie
	};
}
