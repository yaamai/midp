<script>
    import Textfield from '@smui/textfield'
    import Card, {Actions} from '@smui/card'
    import Button, {Label} from '@smui/button';
    import Checkbox from '@smui/checkbox';
    import FormField from '@smui/form-field';

    export let username;
    export let password;
    export let remember;
    export let csrf;
    export let challenge;
</script>

<style>
main.center {
    display: flex;
    justify-content: center;
    align-items: center;
    height: calc(100vh - 16px);
}

form {
    display: flex;
    flex-direction: column;
}

* :global(div.mdc-card) {
    width: 360px;
}

* :global(.input-forms) {
    margin-bottom: 1em;
}
</style>

<template lang="pug">
main(class="center")
    Card(variant="outlined" padded)
        h2 Login to AAA

        form(action="/login" method="post")
            input(type="hidden" value="{csrf}" name="_csrf")
            input(type="hidden" value="{challenge}" name="challenge")

            Textfield(
                bind:value="{username}"
                label="Username"
                type="text"
                variant="outlined"
                class="input-forms"
                input$name="username"
                input$autocomplete="current-username"
                input$aria-controls="helper-text-outlined-a"
                input$aria-describedby="helper-text-outlined-a"
            )

            Textfield(
                bind:value="{password}"
                label="Password"
                type="password"
                variant="outlined"
                class="input-forms"
                input$name="password"
                input$autocomplete="password"
                input$aria-controls="helper-text-outlined-a"
                input$aria-describedby="helper-text-outlined-a"
            )

            FormField
                Checkbox(input$name="remember" input$value="true" bind:checked="{remember}")
                span(slot="label") Remember me

            Actions
                Button(name="action" value="login" type="submit" variant="raised")
                    Label Login
                Button(name="action" value="cancel" type="submit")
                    Label Cancel
</template>
