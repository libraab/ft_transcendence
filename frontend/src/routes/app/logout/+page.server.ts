/**
	load fonction ici va nous permettre de recuperer le cookie de lutilisateur.
	Le return permet de le recuperer en props dans page.svelte en route "/"
 */

export async function load({ cookies }) {
	cookies.delete('jwt_cookie'); //se delete pas
	return (
		{
			ok: true,
		}
	)
}
