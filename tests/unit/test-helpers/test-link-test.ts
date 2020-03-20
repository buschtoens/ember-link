import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';

import { getOwner } from '@ember/application';

import { TestLink } from 'ember-link/test-support';

import LinkManagerService from 'dummy/services/link-manager';

module('Unit | Test Helpers | TestLink', function(hooks) {
  setupTest(hooks);

  test('it sets owner to match LinkManager service owner', async function(assert) {
    const linkManager = this.owner.lookup(
      'service:link-manager'
    ) as LinkManagerService;
    const link = new TestLink(linkManager, { route: 'foo' });

    assert.strictEqual(getOwner(link), getOwner(linkManager));
  });

  test('it uses passed-in LinkParams for basic properties', async function(assert) {
    const linkManager = this.owner.lookup(
      'service:link-manager'
    ) as LinkManagerService;
    const route = 'foo';
    const models = [{}];
    const query = {};
    const link = new TestLink(linkManager, { route, models, query });

    assert.strictEqual(link.routeName, route);
    assert.strictEqual(link.qualifiedRouteName, link.routeName);
    assert.strictEqual(link.models, models);
    assert.strictEqual(link.queryParams, query);
  });

  test('it generates a url', async function(assert) {
    const linkManager = this.owner.lookup(
      'service:link-manager'
    ) as LinkManagerService;
    const link = new TestLink(linkManager, { route: 'foo' });

    assert.ok(link.url.match(/ember\d+/g), 'generates a GUID using `guidFor`');
  });

  test('it can overwrite properties', async function(assert) {
    const properties = [
      'isActive',
      'isActiveWithoutQueryParams',
      'isActiveWithoutModels',
      'isEntering',
      'isExiting'
    ];

    assert.expect(properties.length * 2 + 1);

    const linkManager = this.owner.lookup(
      'service:link-manager'
    ) as LinkManagerService;
    const link = new TestLink(linkManager, { route: 'foo' });

    properties.forEach(propertyName => {
      const propertyKey = propertyName as keyof TestLink;

      assert.notOk(link[propertyKey]);

      // Ignore `Cannot assign to '[property]' because it is a read-only property.`
      /* eslint-disable-next-line @typescript-eslint/ban-ts-ignore */
      // @ts-ignore
      link[propertyKey] = true;

      assert.ok(link[propertyKey]);
    });

    link.url = 'my-url';

    assert.strictEqual(link.url, 'my-url');
  });

  test('it fires onTransitionTo when transitionTo is called', async function(assert) {
    assert.expect(2);

    const linkManager = this.owner.lookup(
      'service:link-manager'
    ) as LinkManagerService;
    const link = new TestLink(linkManager, { route: 'foo' });

    link.onTransitionTo = () => {
      assert.ok(true);
    };

    link.transitionTo({
      preventDefault() {
        assert.ok(true, 'calls preventDefault in transitionTo action');
      }
    } as Event);
  });

  test('it fires onReplaceWith when replaceWith is called', async function(assert) {
    assert.expect(2);

    const linkManager = this.owner.lookup(
      'service:link-manager'
    ) as LinkManagerService;
    const link = new TestLink(linkManager, { route: 'foo' });

    link.onReplaceWith = () => {
      assert.ok(true);
    };

    link.replaceWith({
      preventDefault() {
        assert.ok(true, 'calls preventDefault in replaceWith action');
      }
    } as Event);
  });
});
