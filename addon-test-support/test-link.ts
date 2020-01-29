import { getOwner, setOwner } from '@ember/application';
import { action } from '@ember/object';
import { guidFor } from '@ember/object/internals';

import { LinkParams } from 'ember-link/link';

import LinkManagerService from 'dummy/services/link-manager';

export default class TestLink {
  private _params: LinkParams;

  // Overwritable properties
  isActive = false;
  isActiveWithoutQueryParams = false;
  isActiveWithoutModels = false;
  isEntering = false;
  isExiting = false;
  url = guidFor(this);

  // Event handlers
  onTransitionTo?(): void;
  onReplaceWith?(): void;

  constructor(linkManager: LinkManagerService, params: LinkParams) {
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

    this.onTransitionTo && this.onTransitionTo();
  }

  @action
  replaceWith(event: Event) {
    this._preventTransitionOut(event);

    this.onReplaceWith && this.onReplaceWith();
  }

  private _preventTransitionOut(event: Event) {
    // Make sure we don't transition out of the testing page
    event && event.preventDefault();
  }
}
