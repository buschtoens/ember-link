import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import LinkManagerService from 'ember-link/services/link-manager';

export default class ApplicationController extends Controller {
  @service declare linkManager: LinkManagerService;

  queryParams = ['applicationCategory', 'applicationColor'];

  @tracked applicationCategory = 'all';
  @tracked applicationColor = 'red';

  @tracked noneLink;
  @tracked knownLink;
  @tracked allLink;
  @tracked trackedAllLink;
  @tracked trackedKnownLink;

  constructor() {
    super(...arguments);

    this.noneLink = this.linkManager.createLink({
      route: 'parent.index',
      models: [1],
      params: {
        applicationColor: 'blue',
        parentColor: 'green',
        parentIndexColor: 'purple',
      },
      mode: 'none',
    });

    this.knownLink = this.linkManager.createLink({
      route: 'parent.index',
      models: [1],
      params: {
        applicationColor: 'blue',
        parentColor: 'green',
        parentIndexColor: 'purple',
      },
      mode: 'known',
    });

    this.allLink = this.linkManager.createLink({
      route: 'parent.index',
      models: [1],
      params: {
        applicationColor: 'blue',
        parentColor: 'green',
        parentIndexColor: 'purple',
      },
      mode: 'all',
    });

    this.trackedAllLink = this.linkManager.createLink({
      route: 'parent.index',
      models: [1],
      params: {
        applicationColor: 'blue',
        parentColor: 'green',
        parentIndexColor: 'purple',
      },
      mode: 'tracked-all',
    });

    this.trackedKnownLink = this.linkManager.createLink({
      route: 'parent.index',
      models: [1],
      params: {
        applicationColor: 'blue',
        parentColor: 'green',
        parentIndexColor: 'purple',
      },
      mode: 'tracked-known',
    });
  }
}
