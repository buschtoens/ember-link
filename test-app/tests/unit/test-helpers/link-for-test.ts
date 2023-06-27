/* eslint-disable @typescript-eslint/no-invalid-this */
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

import { linkFor, TestInstrumentedLinkManagerService } from 'ember-link/test-support';

import type { LinkParams } from 'ember-link';

module('Unit | Test Helpers | linkFor', function (hooks) {
  setupTest(hooks);

  test('it calls linkManager.createUILink with correct arguments when passed parameters as an object', async function (assert) {
    assert.expect(3);

    const route = 'foo';
    const models = [{}];
    const query = {};

    this.owner.register(
      'service:link-manager',
      class MockTestInstrumentedLinkManagerService extends TestInstrumentedLinkManagerService {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        createLink(params: LinkParams) {
          assert.strictEqual(params.route, route);
          assert.strictEqual(params.models, models);
          assert.strictEqual(params.query, query);
        }
      }
    );

    linkFor({ route, models, query });
  });

  test('it calls linkManager.createUILink with correct arguments when passed parameters directly', async function (assert) {
    assert.expect(3);

    const route = 'foo';
    const models = [{}];
    const query = {};

    this.owner.register(
      'service:link-manager',
      class MockTestInstrumentedLinkManagerService extends TestInstrumentedLinkManagerService {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        createLink(params: LinkParams) {
          assert.strictEqual(params.route, route);
          assert.strictEqual(params.models, models);
          assert.strictEqual(params.query, query);
        }
      }
    );

    linkFor(route, models, query);
  });
});
