import { getOwner, setOwner } from '@ember/application';
import { action } from '@ember/object';
import { guidFor } from '@ember/object/internals';
import { tracked } from '@glimmer/tracking';

import { LinkParams } from 'ember-link/link';

import TestInstrumentedLinkManagerService from './-private/services/test-instrumented-link-manager';

export default class TestLink {
  private _params: LinkParams;

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

  constructor(
    linkManager: TestInstrumentedLinkManagerService,
    params: LinkParams
  ) {
    setOwner(this, getOwner(linkManager));
    this._params = params;
  }

  get routeName() {
    return this._params.route;
  }

  get qualifiedRouteName() {
    return this.routeName;
  }

  get models() {
    return this._params.models;
  }

  get queryParams() {
    return this._params.query;
  }

  @action
  transitionTo(event: Event) {
    this._preventTransitionOut(event);

    if (this.onTransitionTo) {
      this.onTransitionTo();
    }
  }

  @action
  replaceWith(event: Event) {
    this._preventTransitionOut(event);

    if (this.onReplaceWith) {
      this.onReplaceWith();
    }
  }

  private _preventTransitionOut(event: Event) {
    // Make sure we don't transition out of the testing page
    event?.preventDefault();
  }
}
