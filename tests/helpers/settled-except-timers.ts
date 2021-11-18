// FIXME:: Use helper from Clark test helpers when available
import { waitUntil, getSettledState } from '@ember/test-helpers';

export function settledExceptTimers() {
  return waitUntil(() => {
    const { hasRunLoop, hasPendingRequests, hasPendingWaiters } =
      getSettledState();

    return !(hasRunLoop || hasPendingRequests || hasPendingWaiters);
  });
}
