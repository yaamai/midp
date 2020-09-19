<script>
    import Card, {Actions} from '@smui/card'
    import List, {Group, Item, Meta, Label as ListLabel, Text, PrimaryText, SecondaryText} from '@smui/list';
    import Checkbox from '@smui/checkbox';
    import Button, {Label as ButtonLabel} from '@smui/button';

    export let list = [
        {label: "hoge", description: "long long long description", value: "fuga"},
        {label: "hoge2", description: "long long long description", value: "fuga2"},
        {label: "hoge3", description: "long long long description", value: "fuga3"}
    ];
    export let selected = [];
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
</style>

<main class="center">
  <Card style="width: 360px" variant="outlined" padded>
    <h2>Review scopes</h2>

    <form action="/consent" method="post">
    <input type="hidden" value="{csrf}" name="_csrf"/>
    <input type="hidden" value="{challenge}" name="challenge"/>

    <List class="demo-list" twoLine checklist>
      {#each list as item}
        <Item>
          <Text>
            <PrimaryText><ListLabel>{item.label}</ListLabel></PrimaryText>
            <SecondaryText>{item.description}</SecondaryText>
          </Text>
          <Meta>
            <Checkbox input$name="scopes" bind:group={selected} value={item.value} />
          </Meta>
        </Item>
      {/each}
    </List>

    <Actions>
      <Button type="submit">
        <ButtonLabel>Accept</ButtonLabel>
      </Button>
      <Button type="submit">
        <ButtonLabel>Reject</ButtonLabel>
      </Button>
    </Actions>
    </form>
  </Card>
</main>
