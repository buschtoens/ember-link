// FIXME:: Merge this helper with identical helper in
// `transition-class-provider` addon in separate addon
import { waitUntil, getSettledState } from '@ember/test-helpers';

export function settledExceptTimers() {
  return waitUntil(() => {
    const {
      hasRunLoop,
      hasPendingRequests,
      hasPendingWaiters
    } = getSettledState();

    return !(hasRunLoop || hasPendingRequests || hasPendingWaiters);
  });
}
