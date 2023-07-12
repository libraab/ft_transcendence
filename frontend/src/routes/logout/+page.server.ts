/**
	load fonction ici va nous permettre de recuperer le cookie de lutilisateur.
	Le return permet de le recuperer en props dans page.svelte en route "/"
 */

export async function load({ cookies }) {
	cookies.set('jwt_cookie', null);
	cookies.set('id42', null);
	// cookies.set('_intra_42_session_production', null);
	// cookies.set('user.id', null);
}
