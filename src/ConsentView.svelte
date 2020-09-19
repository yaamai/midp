<script>
    import Card, {Actions} from '@smui/card'
    import List, {Group, Item, Meta, Label as ListLabel, Text, PrimaryText, SecondaryText} from '@smui/list';
    import Checkbox from '@smui/checkbox';
    import Button, {Label as ButtonLabel} from '@smui/button';
    import FormField from '@smui/form-field';

    export let list = [];
    export let selected = [];
    export let csrf;
    export let challenge;
    export let remember;
</script>

<style>
main.center {
    display: flex;
    justify-content: center;
    align-items: center;
    height: calc(100vh - 16px);
}

* :global(div.mdc-card) {
    width: 360px;
}

* :global(ul.scope-list > li) {
    border-bottom: solid 1px #e0e0e0;
    border-right: solid 1px #e0e0e0;
    border-left: solid 1px #e0e0e0;
}
* :global(ul.scope-list > li:first-child) {
    border-top: solid 1px #e0e0e0;
}
* :global(ul.scope-list > li:last-child) {
    border-bottom: solid 1px #e0e0e0;
}
</style>

<template lang="pug">
main(class="center")
    Card(variant="outlined" padded)
        h2 Review scopes

        form(action="/consent" method="post")
            input(type="hidden" value="{csrf}" name="_csrf")
            input(type="hidden" value="{challenge}" name="challenge")

            List(class="scope-list" twoLine checklist)
                +each("list as item")
                    Item
                        Text
                            PrimaryText
                                ListLabel {item.label}
                            SecondaryText {item.description}
                        Meta
                            Checkbox(input$name="scopes" bind:group="{selected}" value="{item.value}")

            FormField
                Checkbox(input$name="remember" input$value="true" bind:checked="{remember}")
                span(slot="label") Remember me
            Actions
                Button(name="action" value="accept" type="submit" variant="raised")
                    ButtonLabel Accept
                Button(name="action" value="reject" type="submit")
                    ButtonLabel Reject
</template>
