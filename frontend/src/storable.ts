import { writable } from 'svelte/store';
import { browser } from '$app/environment';

/*
	Explication du ternaire plus bas:
		`browser ? localStorage.getItem('imgUser') ?? "" : ""`
		if (browser) {
			if (localStorage.getItem('imgUser') == null)
				return ""
			return (localStorage.getItem('imgUser'))
		} else {
			return ""
		}
	browser // le navigateur et dispo
	localStorage.getItem('imgUser') // en recupere dans le local storage
	dans les cas erreur si ya pas de donner on renvoie un string vide car `imgUser` et une string


	pour set la value il faudras juste faire imgUser.set(value); au moment voulus

	vous pouvez en cree autant que vous le voulez
	et meme faire des objet mais faudras faire des conversion

	bon site qui explique un peut la chose: https://rodneylab.com/using-local-storage-sveltekit/


	je vous es fait un example et implemantation pour imgUser mais vous devais quand meme faire le set
*/

const persitedImgUser: string = browser ? localStorage.getItem('imgUser') ?? "" : "";
export const imgUser = writable(persitedImgUser);

imgUser.subscribe((value: string) => {
	if (browser) {
		window.localStorage.setItem('imgUser', value);
	}
})
