import App from './App.svelte';

const SERVER_DATA = {};
const app = new App({
	target: document.body,
	props: SERVER_DATA
});

export default app;
