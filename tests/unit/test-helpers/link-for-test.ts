import { module, test } from 'qunit';

import { linkFor, TestInstrumentedLinkManagerService } from '#test-support';
import { setupTest } from '#tests/helpers';

import type { TestContext } from '@ember/test-helpers';
import type { LinkParams } from 'ember-link';

module('Unit | Test Helpers | linkFor', function (hooks) {
  setupTest(hooks);

  // eslint-disable-next-line qunit/require-expect
  test('it calls linkManager.createUILink with correct arguments when passed parameters as an object', function (this: TestContext, assert) {
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

  // eslint-disable-next-line qunit/require-expect
  test('it calls linkManager.createUILink with correct arguments when passed parameters directly', function (this: TestContext, assert) {
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
