import EmberRouter from '@ember/routing/router';

import config from './config/environment';

export default class DummyRouter extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

DummyRouter.map(function() {});
