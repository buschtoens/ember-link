/**
 * Create links as primitives, pass them around and attach them to elements.
 *
 * @see https://buschtoens.github.io/ember-link
 * @module ember-link
 */

export type { Behavior } from './-behavior.ts';
export { prevent } from './-behavior.ts';
export type { LinkParams, QueryParams } from './-params.ts';
// `NamedParams` breaks vitepress when parsing the markdown ... :(
export type { LinkSignature, /* NamedParams, */ PositionalParams } from './helpers/link.ts';
export { default as link } from './helpers/link.ts';
export { default as Link } from './link.ts';
export { default as LinkManagerService } from './services/link-manager.ts';
