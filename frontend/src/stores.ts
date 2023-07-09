import { writable } from 'svelte/store';
import { browser } from '$app/environment';

interface Room {
	roomId: number;
	roomName: String;
	newMsgCount: number;
  }
export let rooms = writable<Room[]>([]);

/*
	pour set la value il faudras juste faire imgUser.set(value); au moment voulus
	bon site qui explique un peut la chose: https://rodneylab.com/using-local-storage-sveltekit/
*/
//----------------------------------------------------------------//
const persitedImg_path: string = browser ? localStorage.getItem('img_path') ?? "/il_794xN.3892173164_egqv.avif" : "/il_794xN.3892173164_egqv.avif";
export const img_path = writable(persitedImg_path);

img_path.subscribe((value: string) => {
	if (browser) {
		window.localStorage.setItem('img_path', value);
	}
})
//----------------------------------------------------------------//
const persitedUserId42: number = browser ? parseInt(localStorage.getItem('userId42') ?? 0, 10) : 0;
export const userId42 = writable(persitedUserId42);

userId42.subscribe((value: number) => {
    if (browser) {
        window.localStorage.setItem('userId42', value.toString());
	}
})
//----------------------------------------------------------------//
const persitedPage_shown: string = browser ? localStorage.getItem('page_shown') ?? "/" : "/";
export const page_shown = writable(persitedPage_shown);

page_shown.subscribe((value: string) => {
    if (browser) {
        window.localStorage.setItem('page_shown', value);
	}
})
//----------------------------------------------------------------//
const persitedClientName: string = browser ? localStorage.getItem('clientName') ?? "" : "";
export const clientName = writable(persitedClientName);

clientName.subscribe((value: string) => {
    if (browser) {
        window.localStorage.setItem('clientName', value);
	}
})
//----------------------------------------------------------------//
const persitedJwt_cookie: string = browser ? localStorage.getItem('jwt_cookie') ?? "" : "";
export const jwt_cookie = writable(persitedJwt_cookie);

jwt_cookie.subscribe((value: string) => {
    if (browser) {
        window.localStorage.setItem('jwt_cookie', value);
	}
})