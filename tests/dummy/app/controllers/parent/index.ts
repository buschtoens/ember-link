import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import LinkManagerService from 'ember-link/services/link-manager';

export default class ApplicationController extends Controller {
  @service declare linkManager: LinkManagerService;

  queryParams = [
    {
      parent: 'parentIndexCategory',
    },
    'parentIndexColor',
  ];

  @tracked parent = 'all';
  @tracked parentColor = 'red';

  @tracked noneLink;
  @tracked knownLink;
  @tracked allLink;
  @tracked trackedAllLink;
  @tracked trackedKnownLink;

  @tracked links = [];

  constructor() {
    super(...arguments);

    const noneLink = this.linkManager.createLink({
      route: 'parent.index',
      models: [1],
      query: {
        applicationColor: 'blue',
        parentColor: 'green',
        parentIndexColor: 'purple',
      },
      mode: 'none',
    });

    const knownLink = this.linkManager.createLink({
      route: 'parent.index',
      models: [1],
      query: {
        applicationColor: 'blue',
        parentColor: 'green',
        parentIndexColor: 'purple',
      },
      mode: 'known',
    });

    const allLink = this.linkManager.createLink({
      route: 'parent.index',
      models: [1],
      query: {
        applicationColor: 'blue',
        parentColor: 'green',
        parentIndexColor: 'purple',
      },
      mode: 'all',
    });

    const trackedAllLink = this.linkManager.createLink({
      route: 'parent.index',
      models: [1],
      query: {
        applicationColor: 'blue',
        parentColor: 'green',
        parentIndexColor: 'purple',
      },
      mode: 'tracked-all',
    });

    const trackedKnownLink = this.linkManager.createLink({
      route: 'parent.index',
      models: [1],
      query: {
        applicationColor: 'blue',
        parentColor: 'green',
        parentIndexColor: 'purple',
      },
      mode: 'tracked-known',
    });

    this.links = [
      {
        name: 'none',
        link: noneLink,
      },
      {
        name: 'known',
        link: knownLink,
      },
      {
        name: 'all',
        link: allLink,
      },
      {
        name: 'tracked-all',
        link: trackedAllLink,
      },
      {
        name: 'tracked-known',
        link: trackedKnownLink,
      },
    ];
  }
}
