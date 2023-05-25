/* eslint-disable @typescript-eslint/no-invalid-this */
import EmberRouter from '@ember/routing/router';

import config from './config/environment';

export default class DummyRouter extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

DummyRouter.map(function () {
  this.route('foo');
  this.route('bar');

  this.route('with-model', { path: 'with-model/:id' });

  this.route('parent', { path: 'parent/:parent_id' }, function () {
    this.route('child', { path: 'child/:child_id' });
    this.route('second-child');
  });
});
