import { getSettledState, waitUntil } from '@ember/test-helpers';

export function settledExceptTimers() {
  return waitUntil(() => {
    const { hasRunLoop, hasPendingRequests, hasPendingWaiters, isRenderPending } =
      getSettledState();

    return !(hasRunLoop || hasPendingRequests || hasPendingWaiters || isRenderPending);
  });
}
