import { waitUntil } from '@ember/test-helpers';

import { off, on } from 'rsvp';

/**
 * `Ember.onerror` used to be needed here, but it can no longer be imported
 * from the `ember` barrel file since ember-source 7.0.0 (see
 * https://deprecations.emberjs.com/id/import-onerror-from-ember). Instead,
 * uncaught errors are observed via the global `onerror` property as well as
 * the window `error` event, and promise rejections via RSVP's `error` event.
 *
 * Adapted from
 * https://github.com/workmanw/ember-qunit-assert-helpers/issues/18#issuecomment-390003905
 *
 * Note that QUnit itself wraps `globalThis.onerror` and turns any uncaught error
 * into a "Global error" failure, which would end the entire test run. While
 * the handler is installed, it is therefore swapped out with our own, which
 * is why errors from the wrapped `callback` of this helper must always be
 * captured here.
 */
export default async function waitForError(
  callback: () => Promise<unknown>,
  options?: Parameters<typeof waitUntil>[1]
): Promise<Error> {
  const originalOnError = globalThis.onerror;

  let error: Error | undefined = undefined;

  const capture = (uncaughtError: unknown) => {
    error ??= uncaughtError instanceof Error ? uncaughtError : undefined;
  };

  const onError = (message: string, ...args: unknown[]) => {
    const errorObj = args[3] as Error | undefined;

    error ??= errorObj instanceof Error ? errorObj : new Error(message);

    // suppress default reporting (and QUnit's own global error handling)
    return true;
  };

  const listener = (e: ErrorEvent) => {
    capture(e.error);
    e.preventDefault();
  };

  const rsvpListener = (reason: unknown) => {
    capture(reason);
  };

  // eslint-disable-next-line unicorn/prefer-add-event-listener
  globalThis.onerror = onError as unknown as typeof globalThis.onerror;
  globalThis.addEventListener('error', listener);
  on('error', rsvpListener);

  await Promise.all([
    waitUntil(() => error, options).finally(() => {
      // eslint-disable-next-line unicorn/prefer-add-event-listener
      globalThis.onerror = originalOnError;

      globalThis.removeEventListener('error', listener);
      off('error', rsvpListener);
    }),
    callback()
  ]);

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!error) throw new Error('No Error was thrown.');

  return error;
}
