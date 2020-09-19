<script>
    import LoginView from './LoginView.svelte';
    import ConsentView from './ConsentView.svelte';

    export let view = 'consent';
    export let viewProps = {};
</script>

{#if view == 'login'}
<LoginView {...viewProps}/>
{:else if view == 'consent'}
<ConsentView {...viewProps}/>
{/if}
