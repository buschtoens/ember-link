# Migration

## From v2 to v3

- Search and replace `UILink` with `Link`
- `preventDefault` parameter for `(link)` helper has changed into:<br>
  `(link ".." behavior=(hash prevent=true))`
- `<Link>` component has been removed, use `(link)` helper instead
- Instead of `link.transitionTo` you want to switch to `link.open` to give
  control over how this should be opened to definition side of links
