# Commands

Sometimes, links are not enough to encode the information you want to pass down
as primitive, this leads to unelegant situations, such as:

```hbs
<CheckoutRewardScreen 
  @homeLink={{link "home"}} 
  @homeAction={{track "visit-home"}}
/>
```

Information is spread apart and _two_ primitives are passed down for _one_
action. This is where [`ember-command`](https://github.com/gossi/ember-command)
helps out. It can run any amount of arbitrary actions and take a link for
backpack. It is designed to work together with `ember-link`. The example from
above rewritten with `ember-command`:

```hbs
<CheckoutRewardScreen 
  @home={{command 
    (link "home")
    (track "visit-home")
  }}
/>
```

And `ember-command` provides `<CommandElement>` component to approprietly render
the command you pass in.

```hbs
{{! checkout-reward-screen.hbs}}

<h1>Congratulations on your Purchase</h1>

<CommandElement @command={{@home}}>
  Return to Home
</CommandElement>
```


