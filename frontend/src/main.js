import App from './App.svelte';
// import apiClient from './api';
// import dotenv from 'dotenv';
// dotenv.config();


const app = new App({
	target: document.body,
	/*	props: {
		name: 'world'
	}*/
});
	// props: {
	// 	apiClient // ceci passe l'instance axios au components svelte
	//   }
	// });

export default app;