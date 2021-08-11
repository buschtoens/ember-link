import { action } from '@ember/object';
import { guidFor } from '@ember/object/internals';
import Transition from '@ember/routing/-private/transition';
import { tracked } from '@glimmer/tracking';

import { LinkBase } from 'ember-link/-private/link-base';

export default class TestLink extends LinkBase {
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

    if (this.onTransitionTo) {
      this.onTransitionTo();
    }

    return this._createDummyTransition();
  }

  @action
  replaceWith(event?: Event): Transition {
    this._preventTransitionOut(event);

    if (this.onReplaceWith) {
      this.onReplaceWith();
    }

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
