<script>
    import LoginView from './LoginView.svelte';
    import ConsentView from './ConsentView.svelte';

    export let view;
    export let viewProps;
    console.log(view, viewProps);
</script>

{#if view == 'login'}
<LoginView {...viewProps}/>
{:else if view == 'consent'}
<ConsentView {...viewProps}/>
{/if}
