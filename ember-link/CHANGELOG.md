# Changelog



## v3.1.0 (2023-08-08)

#### :bug: Bug Fix
* [#779](https://github.com/buschtoens/ember-link/pull/779) Allow v2 and v3 of `@ember/test-helpers` ([@gossi](https://github.com/gossi))
* [#778](https://github.com/buschtoens/ember-link/pull/778) Remove `href` ([@gossi](https://github.com/gossi))

#### :house: Internal
* [#783](https://github.com/buschtoens/ember-link/pull/783) Prepare Releasing from Github ([@gossi](https://github.com/gossi))
* [#781](https://github.com/buschtoens/ember-link/pull/781) Re-organize Releasing ([@gossi](https://github.com/gossi))

#### Committers: 1
- Thomas Gossmann ([@gossi](https://github.com/gossi))

## v3.0.0 (2023-07-07)

#### :boom: Breaking Change
* [#771](https://github.com/buschtoens/ember-link/pull/771) Remove `UILink` ([@gossi](https://github.com/gossi))
* [#752](https://github.com/buschtoens/ember-link/pull/752) Upgrade Node Version to v16 ([@gossi](https://github.com/gossi))
* [#747](https://github.com/buschtoens/ember-link/pull/747) Remove deprecated `<Link>` component ([@gossi](https://github.com/gossi))

#### :rocket: Enhancement
* [#772](https://github.com/buschtoens/ember-link/pull/772) Add glint support ([@gossi](https://github.com/gossi))
* [#770](https://github.com/buschtoens/ember-link/pull/770) Add behavior parameter to links ([@gossi](https://github.com/gossi))

#### :memo: Documentation
* [#773](https://github.com/buschtoens/ember-link/pull/773) Documentation for ember-link ([@gossi](https://github.com/gossi))

#### :house: Internal
* [#761](https://github.com/buschtoens/ember-link/pull/761) CI fixes ([@gossi](https://github.com/gossi))
* [#755](https://github.com/buschtoens/ember-link/pull/755) Upgrade Dependencies ([@gossi](https://github.com/gossi))
* [#748](https://github.com/buschtoens/ember-link/pull/748) Migrate into v2 addon ([@gossi](https://github.com/gossi))
* [#746](https://github.com/buschtoens/ember-link/pull/746) Deprecations and TS Fixes ([@gossi](https://github.com/gossi))

#### Committers: 1
- Thomas Gossmann ([@gossi](https://github.com/gossi))

## v2.1.0 (2023-05-25)

#### :house: Internal

* [#746](https://github.com/buschtoens/ember-link/pull/746) Deprecations and TS Fixes ([@gossi](https://github.com/gossi))

#### Committers: 1

- Thomas Gossmann ([@gossi](https://github.com/gossi))

## v2.0.1 (2022-12-23)

#### :bug: Bug Fix

* [#718](https://github.com/buschtoens/ember-link/pull/718) Fix exporting `LinkParams` and `UILinkParams` types ([@bertdeblock](https://github.com/bertdeblock))

#### :house: Internal

* [#711](https://github.com/buschtoens/ember-link/pull/711) Update `.npmignore` file ([@Turbo87](https://github.com/Turbo87))

#### Committers: 2

- Bert De Block ([@bertdeblock](https://github.com/bertdeblock))
* Tobias Bieniek ([@Turbo87](https://github.com/Turbo87))

## v2.0.0 (2022-04-06)

#### :boom: Breaking Change

* [#658](https://github.com/buschtoens/ember-link/pull/658) Remove link cache ([@Turbo87](https://github.com/Turbo87))
* [#656](https://github.com/buschtoens/ember-link/pull/656) Raise minimum Node to v12 ([@Turbo87](https://github.com/Turbo87))

#### :house: Internal

* [#678](https://github.com/buschtoens/ember-link/pull/678) Adjust `@glimmer/tracking` dependency to use semver ([@Turbo87](https://github.com/Turbo87))
* [#675](https://github.com/buschtoens/ember-link/pull/675) Use `pnpm` package manager ([@Turbo87](https://github.com/Turbo87))
* [#674](https://github.com/buschtoens/ember-link/pull/674) Release via CI ([@Turbo87](https://github.com/Turbo87))
* [#672](https://github.com/buschtoens/ember-link/pull/672) Update @types dependencies ([@Turbo87](https://github.com/Turbo87))
* [#668](https://github.com/buschtoens/ember-link/pull/668) Fix broken CSS selectors ([@Turbo87](https://github.com/Turbo87))
* [#667](https://github.com/buschtoens/ember-link/pull/667) Merge unnecessary duplicate imports ([@Turbo87](https://github.com/Turbo87))
* [#666](https://github.com/buschtoens/ember-link/pull/666) CI: Use `yarn` caching ([@Turbo87](https://github.com/Turbo87))
* [#662](https://github.com/buschtoens/ember-link/pull/662) Pin `prettier` to v2.2.1 ([@Turbo87](https://github.com/Turbo87))
* [#660](https://github.com/buschtoens/ember-link/pull/660) Use `@babel/eslint-parser` ([@Turbo87](https://github.com/Turbo87))
* [#625](https://github.com/buschtoens/ember-link/pull/625) Update dependency ember-qunit to v5 ([@renovate[bot]](https://github.com/apps/renovate))
* [#618](https://github.com/buschtoens/ember-link/pull/618) Fix CI issues ([@Turbo87](https://github.com/Turbo87))

#### Committers: 1

- Tobias Bieniek ([@Turbo87](https://github.com/Turbo87))

## v1.3.1 (2021-01-29)

#### :rocket: Enhancement

* [#518](https://github.com/buschtoens/ember-link/pull/518) fix(link-manager): Use private router API to query `currentURL` in a side-effect-free way ([@Turbo87](https://github.com/Turbo87))

#### Committers: 1

- Tobias Bieniek ([@Turbo87](https://github.com/Turbo87))

## v1.3.0 (2021-01-28)

#### :rocket: Enhancement

* [#507](https://github.com/buschtoens/ember-link/pull/507) Fix Ember 3.24 compatibility ([@Turbo87](https://github.com/Turbo87))

#### :bug: Bug Fix

* [#506](https://github.com/buschtoens/ember-link/pull/506) services/link-manager: Fix typo in `getLinkParamsFromURL()` method name ([@Turbo87](https://github.com/Turbo87))

#### :house: Internal

* [#505](https://github.com/buschtoens/ember-link/pull/505) tests/components: Run tests with and without the `setupLink()` test helper ([@Turbo87](https://github.com/Turbo87))
* [#504](https://github.com/buschtoens/ember-link/pull/504) Add `LinkTo` tests and `currentURL()` assertions ([@Turbo87](https://github.com/Turbo87))
* [#503](https://github.com/buschtoens/ember-link/pull/503) tests/components/link: Add "incomplete model" test ([@Turbo87](https://github.com/Turbo87))
* [#502](https://github.com/buschtoens/ember-link/pull/502) Adjust CI jobs ([@Turbo87](https://github.com/Turbo87))
* [#501](https://github.com/buschtoens/ember-link/pull/501) tests/acceptance: Avoid multiple `Router.map()` calls ([@Turbo87](https://github.com/Turbo87))

#### Committers: 1

- Tobias Bieniek ([@Turbo87](https://github.com/Turbo87))

## v1.2.1 (2020-11-16)

#### :bug: Bug Fix

* [#473](https://github.com/buschtoens/ember-link/pull/473) Check `button` property and modifier key states before calling `preventDefault()` ([@Turbo87](https://github.com/Turbo87))

#### Committers: 1

- Tobias Bieniek ([@Turbo87](https://github.com/Turbo87))

## v1.2.0 (2020-08-06)

* [#257](https://github.com/buschtoens/ember-link/issues/257) Testing API and support for render tests
* [#394](https://github.com/buschtoens/ember-link/pull/394) fix(Link): Use `currentTransitionStack` to enable auto-tracking
