import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { guidFor } from '@ember/object/internals';

import Link from '../link';

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

  @action
  transitionTo(event?: Event): Transition {
    this._preventTransitionOut(event);

    // Fire both the `onTransitionTo` event used for testing, as well as the
    // optional `onTransitionTo` event used by the code being tested
    this._params.onTransitionTo?.();
    this.onTransitionTo?.();

    return this._createDummyTransition();
  }

  @action
  replaceWith(event?: Event): Transition {
    this._preventTransitionOut(event);

    // Fire both the `onReplaceWith` event used for testing, as well as the
    // optional `onReplaceWith` event used by the code being tested
    this._params.onReplaceWith?.();
    this.onReplaceWith?.();

    return this._createDummyTransition();
  }

  private _preventTransitionOut(event?: Event) {
    // Make sure we don't transition out of the testing page
    event?.preventDefault();
  }

  private _createDummyTransition(): Transition {
    return {
      from: null,
      to: {
        child: null,
        localName: 'dummy',
        name: 'dummy',
        paramNames: [],
        params: {},
        parent: null,
        queryParams: {},
        find() {
          return undefined;
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
