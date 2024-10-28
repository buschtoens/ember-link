/**
 * Create links as primitives, pass them around and attach them to elements.
 *
 * @see https://buschtoens.github.io/ember-link
 * @module ember-link
 */

export type { Behavior } from './-behavior';
export { prevent } from './-behavior';
export type { LinkParams, QueryParams } from './-params';
// `NamedParams` breaks vitepress when parsing the markdown ... :(
export type { LinkSignature, /*NamedParams,*/ PositionalParams } from './helpers/link';
export { default as link } from './helpers/link';
export { default as Link } from './link';
export type { default as LinkManagerService } from './services/link-manager';
