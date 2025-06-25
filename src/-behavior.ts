import type Link from './link.ts';

export const BEHAVIOR = Symbol('prevent');

export interface Behavior {
  /**
   * @defaultValue 'transition'
   */
  open: 'transition' | 'replace';

  /**
   * Prevent a link from being invoked. The default implementation is doing
   * two things:
   *
   * 1) allow links to open in new window/tab
   * 2) prevent default browser behavior on `<a>` tags (to use ember's routing
   *    system)
   *
   * @param event
   * @param link
   * @returns
   */
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  prevent: (event: Event | unknown, link?: Link) => boolean;
}

const MAIN_BUTTON = 0;

function isUnmodifiedLeftClick(event: MouseEvent): boolean {
  return event.button === MAIN_BUTTON && !event.ctrlKey && !event.metaKey;
}

function isMouseEvent(event: unknown): event is MouseEvent {
  return typeof event === 'object' && event !== null && 'button' in event;
}

export function isRegularOpening(event: unknown) {
  return isMouseEvent(event) && !isUnmodifiedLeftClick(event);
}

// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
export function preventDefault(event?: Event | unknown) {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (typeof (event as Event)?.preventDefault === 'function') {
    (event as Event).preventDefault();
  }
}

// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
export function prevent(event: Event | unknown): boolean {
  if (isRegularOpening(event)) {
    return true;
  }

  preventDefault(event);

  return false;
}
