import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';

import Service from '@ember/service';

import { LinkParams } from 'ember-link';
import { linkFor } from 'ember-link/test-support';

module('Unit | Test Helpers | linkFor', function(hooks) {
  setupTest(hooks);

  test('it calls linkManager.createUILink with correct arguments when passed parameters as an object', async function(assert) {
    assert.expect(3);

    const route = 'foo';
    const models = [{}];
    const query = {};

    this.owner.register(
      'service:link-manager',
      class MockLinkManagerService extends Service {
        _useTestLink = true;

        createUILink(params: LinkParams) {
          assert.strictEqual(params.route, route);
          assert.strictEqual(params.models, models);
          assert.strictEqual(params.query, query);
        }
      }
    );

    linkFor({ route, models, query });
  });

  test('it calls linkManager.createUILink with correct arguments when passed parameters directly', async function(assert) {
    assert.expect(3);

    const route = 'foo';
    const models = [{}];
    const query = {};

    this.owner.register(
      'service:link-manager',
      class MockLinkManagerService extends Service {
        _useTestLink = true;

        createUILink(params: LinkParams) {
          assert.strictEqual(params.route, route);
          assert.strictEqual(params.models, models);
          assert.strictEqual(params.query, query);
        }
      }
    );

    linkFor(route, models, query);
  });
});
