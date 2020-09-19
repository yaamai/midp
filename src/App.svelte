<script>
    import Textfield from '@smui/textfield'
    import Card, {Actions} from '@smui/card'
    import Button, {Label} from '@smui/button';
    import Checkbox from '@smui/checkbox';
    import FormField from '@smui/form-field';
    export let name;
    export let selected;
    export let csrf;
</script>

<style>
main.center {
    display: flex;
    justify-content: center;
    align-items: center;
    height: calc(100vh - 16px);
}

label.forms {
    margin-bottom: 1em;
}

form {
    display: flex;
    flex-direction: column;
}

</style>

<main class="center">
  <Card style="width: 360px" variant="outlined" padded>
    <h2>Login to AAA</h2>

    <form action="/login" method="post">
    <input type="hidden" value="{csrf}" name="_csrf"/>

    <Textfield input$name="username" type="text" style="margin-bottom: 1em;" variant="outlined" bind:value={name} label="Username" input$aria-controls="helper-text-outlined-a" input$aria-describedby="helper-text-outlined-a" />
    <Textfield input$name="password" type="password" style="margin-bottom: 1em;" variant="outlined" bind:value={name} label="Password" input$aria-controls="helper-text-outlined-a" input$aria-describedby="helper-text-outlined-a" />

    <FormField style="margin-top: -1em;">
      <Checkbox bind:checked={selected} />
      <span slot="label">Keep login session</span>
    </FormField>
    <Actions>
      <Button type="submit" on:click={() => true}>
        <Label>Login</Label>
      </Button>
    </Actions>
    </form>
  </Card>
</main>
