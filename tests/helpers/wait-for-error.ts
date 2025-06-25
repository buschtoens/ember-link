import Ember from 'ember';
import { waitUntil } from '@ember/test-helpers';

import { off, on } from 'rsvp';

/**
 * I would be using `ember-qunit-assert-helpers` here, but it does not work with
 * async rendering. :(
 *
 * Adapted from https://github.com/workmanw/ember-qunit-assert-helpers/issues/18#issuecomment-390003905
 */
export default async function waitForError(
  callback: () => Promise<unknown>,
  options?: Parameters<typeof waitUntil>[1]
): Promise<Error> {
  const originalEmberListener = Ember.onerror;
  const originalWindowListener = globalThis.onerror;

  let error: Error | undefined = undefined;

  // eslint-disable-next-line unicorn/prefer-add-event-listener
  Ember.onerror = (uncaughtError) => {
    error = uncaughtError;
  };

  // eslint-disable-next-line unicorn/consistent-function-scoping
  const listener = (e: ErrorEvent) => {
    e.preventDefault();
  };

  // eslint-disable-next-line unicorn/prefer-add-event-listener
  globalThis.onerror = (_message, _source, _lineNumber, _columnNumber, uncaughtError) => {
    error = uncaughtError;
  };

  globalThis.addEventListener('error', listener);

  on('error', Ember.onerror);

  await Promise.all([
    waitUntil(() => error, options).finally(() => {
      // eslint-disable-next-line unicorn/prefer-add-event-listener
      Ember.onerror = originalEmberListener;

      // eslint-disable-next-line unicorn/prefer-add-event-listener
      globalThis.onerror = originalWindowListener;
      globalThis.removeEventListener('error', listener);

      off('error', Ember.onerror);
    }),
    callback()
  ]);

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!error) throw new Error('No Error was thrown.');

  return error;
}
