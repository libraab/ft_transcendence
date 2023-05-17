import { writable } from "svelte/store";

const id42 = document.cookie ? document.cookie
    .split('; ')
    .find(cookie => cookie.startsWith('id42'))
    .split('=')[1] : null;

export const userId42 = writable(id42);
export let page_shown = writable("/")
