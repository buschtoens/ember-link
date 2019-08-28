import { waitUntil } from '@ember/test-helpers';

import Ember from 'ember';

import { on, off } from 'rsvp';

/**
 * I would be using `ember-qunit-assert-helpers` here, but it does not work with
 * async rendering. :(
 *
 * Adapted from https://github.com/workmanw/ember-qunit-assert-helpers/issues/18#issuecomment-390003905
 */
export default async function waitForError(
  callback: () => Promise<unknown>,
  options?: Parameters<typeof waitUntil>[1]
) {
  const originalEmberListener = Ember.onerror;
  const originalWindowListener = window.onerror;

  let error: Error | undefined;
  Ember.onerror = uncaughtError => {
    error = uncaughtError;
  };
  window.onerror = (
    _message,
    _source,
    _lineNumber,
    _columnNumber,
    uncaughtError
  ) => {
    error = uncaughtError;
  };
  on('error', Ember.onerror);

  await Promise.all([
    waitUntil(() => error, options).finally(() => {
      Ember.onerror = originalEmberListener;
      window.onerror = originalWindowListener;
      off('error', Ember.onerror);
    }),
    callback()
  ]);

  if (!error) throw new Error('No Error was thrown.');

  return error;
}
