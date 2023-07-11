/**
	load fonction ici va nous permettre de recuperer le cookie de lutilisateur.
	Le return permet de le recuperer en props dans page.svelte en route "/"
 */

export function load({ cookies }) {
	const myJwtCookie = cookies.get('jwt_cookie');
	const myid42 = cookies.get('id42');

	return {
		myJwtCookie,
		myid42
	};
}
