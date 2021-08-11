import { action } from '@ember/object';
import Transition from '@ember/routing/-private/transition';
import { tracked } from '@glimmer/tracking';

import { Link, LinkParams } from './link';

const MAIN_BUTTON = 0;

function isUnmodifiedLeftClick(event: MouseEvent): boolean {
  return event.button === MAIN_BUTTON && !event.ctrlKey && !event.metaKey;
}

function isMouseEvent(event: unknown): event is MouseEvent {
  return typeof event === 'object' && event !== null && 'button' in event;
}

export interface UILinkParams {
  /**
   * Whether or not to call `event.preventDefault()`, if the first parameter to
   * the `transitionTo` or `replaceWith` action is an `Event`. This is useful to
   * prevent links from accidentally triggering real browser navigation or
   * buttons from submitting a form.
   *
   * Defaults to `true`.
   */
  preventDefault?: boolean;
}

export class UILink extends Link {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  @tracked protected _params!: LinkParams & UILinkParams;

  private preventDefault(event?: Event | unknown) {
    if (
      (this._params.preventDefault ?? true) &&
      typeof (event as Event)?.preventDefault === 'function'
    ) {
      (event as Event).preventDefault();
    }
  }

  /**
   * Transition into the target route.
   *
   * Optionally call `preventDefault()`, if an `Event` is passed in.
   */
  @action
  transitionTo(event?: Event | unknown): Transition | undefined {
    if (isMouseEvent(event) && !isUnmodifiedLeftClick(event)) return;

    // Intentionally putting this *before* the assertion to prevent navigating
    // away in case of a failed assertion.
    this.preventDefault(event);

    return super.transitionTo();
  }

  /**
   * Transition into the target route while replacing the current URL, if
   * possible.
   *
   * Optionally call `preventDefault()`, if an `Event` is passed in.
   */
  @action
  replaceWith(event?: Event | unknown): Transition | undefined {
    if (isMouseEvent(event) && !isUnmodifiedLeftClick(event)) return;

    // Intentionally putting this *before* the assertion to prevent navigating
    // away in case of a failed assertion.
    this.preventDefault(event);

    return super.replaceWith();
  }
}
