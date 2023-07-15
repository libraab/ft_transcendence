/**
	load fonction ici va nous permettre de recuperer le cookie de lutilisateur.
	Le return permet de le recuperer en props dans page.svelte en route "/"
 */

import { error } from '@sveltejs/kit';

export function load({ cookies, fetch }) {
	const myJwtCookie = cookies.get('jwt_cookie');
	const myid42 = cookies.get('id42');

	let	PUBLIC_DOMAIN_BACK = process.env.PUBLIC_DOMAIN_BACK;
	let PUBLIC_API_42 = process.env.PUBLIC_API_42;

	if (!(PUBLIC_API_42 && PUBLIC_API_42))
		throw error(500, {
				message: "ENV variable error"
			});

		try {
                const connect = await fetch(`/api/dashboard`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${$jwt_cookie}`
                    }
                });
                if (connect.status == 200)
                {
                    goto('/app/dashboard');
                }
                else
                {
                    //connection refusee a cause dun mauvai/vieux/invalid/corrompu cookie
                    console.error("fetch failed in login page");
					jwt_cookie.set("null");
                }
            }
            catch (error) {
                console.error("fetching in '/' :" , error);
            }

	return {
		myJwtCookie,
		myid42,
		url : `https://api.intra.42.fr/oauth/authorize?client_id=${PUBLIC_API_42}&redirect_uri=${encodeURI(PUBLIC_DOMAIN_BACK)}&response_type=code`
	};
}
