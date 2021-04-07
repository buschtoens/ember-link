import { action } from '@ember/object';
import { guidFor } from '@ember/object/internals';
import Transition from '@ember/routing/-private/transition';
import { tracked } from '@glimmer/tracking';

import { Link } from 'ember-link';

export default class TestLink extends Link {
  // Overwritable properties
  @tracked isActive = false;
  @tracked isActiveWithoutQueryParams = false;
  @tracked isActiveWithoutModels = false;
  @tracked isEntering = false;
  @tracked isExiting = false;
  @tracked url = guidFor(this);

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
          // eslint-disable-next-line unicorn/no-useless-undefined
          return undefined;
        }
      },
      abort() {
        return this;
      },
      retry() {
        return this;
      }
    };
  }
}
