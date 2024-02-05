# `LinkManager` Service

The `LinkManager` service is used by the [`(link) helper`](./helper.md) and
to create a [`Link`](./api/ember-link/classes/Link.md) instances.

You can also use this service directly to programmatically create link
references.

## `createLink(linkParams: LinkParams): Link`

Will create a [`Link`](./api/ember-link/classes/Link.md)to pass around using
the same parameters as [`(link) helper`](./helper.md).

::: info
API Docs: [createLink](./api/ember-link/classes/LinkManagerService.md#createlink)
:::

## `getLinkParamsFromURL(url: string): LinkParams`

Use this method to derive `LinkParams` from a serialized, recognizable URL, that
you can then pass into `createLink`.

::: info
API Docs: [getLinkParamsFromURL](./api/ember-link/classes/LinkManagerService.md#getlinkparamsfromurl)
:::
