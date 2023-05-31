// FIXME:: Use helper from Clark test helpers when available
import { getSettledState, waitUntil } from '@ember/test-helpers';

export function settledExceptTimers() {
  return waitUntil(() => {
    const { hasRunLoop, hasPendingRequests, hasPendingWaiters } = getSettledState();

    return !(hasRunLoop || hasPendingRequests || hasPendingWaiters);
  });
}
