import EmberApp from '@ember/application';
import EmberRouter from '@ember/routing/router';

import Resolver from 'ember-resolver';

import { LinkManagerService } from '#src';

class Router extends EmberRouter {
  location = 'none';
  rootURL = '/';
}

Router.map(function () {
  /* eslint-disable @typescript-eslint/no-invalid-this */
  this.route('foo');
  this.route('bar');

  this.route('with-model', { path: 'with-model/:id' });

  this.route('parent', { path: 'parent/:parent_id' }, function () {
    this.route('child', { path: 'child/:child_id' });
    this.route('second-child');
  });
  /* eslint-enable @typescript-eslint/no-invalid-this */
});

const ApplicationTemplate = <template>
  <h2 id="title">Welcome to Ember</h2>

  {{outlet}}
</template>;

class TestApp extends EmberApp {
  modulePrefix = 'test-app';
  Resolver = Resolver.withModules({
    'test-app/router': { default: Router },
    'test-app/services/link-manager': LinkManagerService,
    'test-app/templates/application': ApplicationTemplate
  });
}

import { setApplication } from '@ember/test-helpers';
import * as QUnit from 'qunit';
import { setup } from 'qunit-dom';
import { setupEmberOnerrorValidation, start as qunitStart } from 'ember-qunit';

export function start() {
  setApplication(
    TestApp.create({
      autoboot: false,
      rootElement: '#ember-testing'
    })
  );

  // eslint-disable-next-line import-x/namespace
  setup(QUnit.assert);
  setupEmberOnerrorValidation();
  qunitStart();
}
