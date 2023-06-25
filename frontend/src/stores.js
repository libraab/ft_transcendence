import { writable } from "svelte/store";
import { browser } from '$app/environment';

let headingElement;
if (browser)
	headingElement = document.querySelector('jwt_cookie');

export const id = writable(0);
export const userId42 = writable(0);
export let page_shown = writable("/")
export let img_path = writable("/il_794xN.3892173164_egqv.avif");
