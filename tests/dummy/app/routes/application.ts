import Route from '@ember/routing/route';
import LinkManagerService from 'ember-link/services/link-manager';
import { inject as service } from '@ember/service';
import RouterService from '@ember/routing/router-service';

export default class ApplicationRoute extends Route {
  @service linkManager!: LinkManagerService;
  @service router!: RouterService;

  constructor() {
    super(...arguments);
    window.linkManager = this.linkManager;
    window.router = this.router;
  }
}
