import App from './App.svelte';

console.log(SERVER_DATA);
const app = new App({
	target: document.body,
	props: SERVER_DATA
});

export default app;
