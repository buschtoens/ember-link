import { tracked } from '@glimmer/tracking';
import { guidFor } from '@ember/object/internals';

import { preventDefault } from '../-behavior.ts';
import Link from '../link.ts';

import type Transition from '@ember/routing/transition';

export default class TestLink extends Link {
  // Overwritable properties
  @tracked private active = false;

  get isActive(): boolean {
    return this.active;
  }

  set isActive(active: boolean) {
    this.active = active;
  }

  @tracked private activeWithoutQueryParams = false;

  get isActiveWithoutQueryParams(): boolean {
    return this.activeWithoutQueryParams;
  }

  set isActiveWithoutQueryParams(active: boolean) {
    this.activeWithoutQueryParams = active;
  }

  @tracked private activeWithoutModels = false;

  get isActiveWithoutModels(): boolean {
    return this.activeWithoutModels;
  }

  set isActiveWithoutModels(active: boolean) {
    this.activeWithoutModels = active;
  }

  @tracked private entering = false;

  get isEntering(): boolean {
    return this.entering;
  }

  set isEntering(entering: boolean) {
    this.entering = entering;
  }

  @tracked private exiting = false;

  get isExiting(): boolean {
    return this.exiting;
  }

  set isExiting(exiting: boolean) {
    this.exiting = exiting;
  }

  @tracked private internalUrl = guidFor(this);

  get url(): string {
    if (this.isExternal) {
      return this._params.route;
    }

    return this.internalUrl;
  }

  set url(url: string) {
    this.internalUrl = url;
  }

  // Event handlers
  onTransitionTo?(): void;
  onReplaceWith?(): void;

  get qualifiedRouteName() {
    return this.routeName;
  }

  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  transitionTo = (event?: Event | unknown): Transition => {
    this._preventTransitionOut(event);

    // Fire both the `onTransitionTo` event used for testing, as well as the
    // optional `onTransitionTo` event used by the code being tested
    this._params.onTransitionTo?.();
    this.onTransitionTo?.();

    return this._createDummyTransition();
  };

  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  replaceWith = (event?: Event | unknown): Transition => {
    this._preventTransitionOut(event);

    // Fire both the `onReplaceWith` event used for testing, as well as the
    // optional `onReplaceWith` event used by the code being tested
    this._params.onReplaceWith?.();
    this.onReplaceWith?.();

    return this._createDummyTransition();
  };

  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  open = (event?: Event | unknown): Transition | undefined => {
    const method = this.behavior.open;

    if (method === 'replace') {
      return this.replaceWith(event);
    }

    return this.transitionTo(event);
  };

  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  private _preventTransitionOut(event?: Event | unknown) {
    // Make sure we don't transition out of the testing page
    preventDefault(event);
  }

  private _createDummyTransition(): Transition {
    return {
      from: undefined,
      to: {
        child: undefined,
        localName: 'dummy',
        name: 'dummy',
        paramNames: [],
        params: {},
        parent: undefined,
        queryParams: {},
        find() {
          return;
        }
      },
      abort() {
        return this;
      },
      retry() {
        return this;
      }
    } as unknown as Transition;
  }
}
