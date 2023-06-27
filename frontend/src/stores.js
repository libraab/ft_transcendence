import { writable } from "svelte/store";

export const userId42 = writable(0);
export let page_shown = writable("/")
export let img_path = writable("");
export let clientName = writable("")
