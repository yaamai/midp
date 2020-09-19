<script>
    import Textfield from '@smui/textfield'
    import Card, {Actions} from '@smui/card'
    import Button, {Label} from '@smui/button';
    import Checkbox from '@smui/checkbox';
    import FormField from '@smui/form-field';

    export let username;
    export let password;
    export let remeberMe;
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

</style>

<main class="center">
  <Card style="width: 360px" variant="outlined" padded>
    <h2>Login to AAA</h2>

    <form action="/login" method="post">
    <input type="hidden" value="{csrf}" name="_csrf"/>
    <input type="hidden" value="{challenge}" name="challenge"/>

    <Textfield input$name="username" type="text" style="margin-bottom: 1em;" variant="outlined" bind:value={username} label="Username" input$aria-controls="helper-text-outlined-a" input$aria-describedby="helper-text-outlined-a" />
    <Textfield input$name="password" type="password" style="margin-bottom: 1em;" variant="outlined" bind:value={password} label="Password" input$aria-controls="helper-text-outlined-a" input$aria-describedby="helper-text-outlined-a" />

    <FormField style="margin-top: -1em;">
      <Checkbox bind:checked={remeberMe} />
      <span slot="label">Remember me</span>
    </FormField>
    <Actions>
      <Button name="action" value="login" type="submit">
        <Label>Login</Label>
      </Button>
      <Button name="action" value="cancel" type="submit">
        <Label>Cancel</Label>
      </Button>
    </Actions>
    </form>
  </Card>
</main>

