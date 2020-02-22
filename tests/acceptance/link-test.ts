/* eslint-disable array-callback-return */

import { visit, currentURL, click } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { module, test } from 'qunit';

import RouterDSL from '@ember/routing/-private/router-dsl';
import Route from '@ember/routing/route';
import Router from '@ember/routing/router';

import { hbs } from 'ember-cli-htmlbars';
import { TestContext as OriginalTestContext } from 'ember-test-helpers';

import pDefer from 'p-defer';

import DummyRouter from 'dummy/router';
import { settledExceptTimers } from 'dummy/tests/helpers/settled-except-timers';

export interface Constructor<T = unknown> {
  new (...args: unknown[]): T;
}

interface TestContext extends OriginalTestContext {
  Router: Constructor<Router> & {
    map(callback: (this: RouterDSL) => void): void;
  };
}

module('Acceptance | link', function(hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function(this: TestContext) {
    this.Router = class TestRouter extends DummyRouter {};
    this.owner.register('router:main', this.Router);

    this.owner.register(
      'route:basic',
      class BasicRoute extends Route {
        findModel(_name: string, id: string) {
          return id;
        }
      }
    );
  });

  test('basic test', async function(this: TestContext, assert) {
    this.Router.map(function() {
      this.route('foo');
    });

    this.owner.register(
      'template:application',
      hbs`
        <Link @route="foo" as |l|>
          <a
            data-test-link
            href={{l.href}}
            class={{if l.isActive "is-active"}}
            {{on "click" l.transitionTo}}
          >
            Link
          </a>
        </Link>
      `
    );

    await visit('/');
    assert.equal(currentURL(), '/');

    assert.dom('[data-test-link]').hasAttribute('href', '/foo');
    assert.dom('[data-test-link]').hasNoClass('is-active');

    await click('[data-test-link]');
    assert.equal(currentURL(), '/foo');
    assert.dom('[data-test-link]').hasClass('is-active');
  });

  test('with model', async function(this: TestContext, assert) {
    this.Router.map(function() {
      this.route('with-model', { path: 'with-model/:id' });
    });

    this.owner.register(
      'template:application',
      hbs`
        <Link @route="with-model" @models={{array 123}} as |l|>
          <a
            data-test-link
            href={{l.href}}
            class={{if l.isActive "is-active"}}
            {{on "click" l.transitionTo}}
          >
            Link
          </a>
        </Link>
      `
    );

    await visit('/');
    assert.equal(currentURL(), '/');

    assert.dom('[data-test-link]').hasAttribute('href', '/with-model/123');
    assert.dom('[data-test-link]').hasNoClass('is-active');

    await click('[data-test-link]');
    assert.equal(currentURL(), '/with-model/123');
    assert.dom('[data-test-link]').hasClass('is-active');
  });

  test('@model shorthand', async function(this: TestContext, assert) {
    this.Router.map(function() {
      this.route('with-model', { path: 'with-model/:id' });
    });

    this.owner.register(
      'template:application',
      hbs`
        <Link @route="with-model" @model="123" as |l|>
          <a
            data-test-link
            href={{l.href}}
            class={{if l.isActive "is-active"}}
            {{on "click" l.transitionTo}}
          >
            Link
          </a>
        </Link>
      `
    );

    await visit('/');
    assert.equal(currentURL(), '/');

    assert.dom('[data-test-link]').hasAttribute('href', '/with-model/123');
    assert.dom('[data-test-link]').hasNoClass('is-active');

    await click('[data-test-link]');
    assert.equal(currentURL(), '/with-model/123');
    assert.dom('[data-test-link]').hasClass('is-active');
  });

  test('with nested model', async function(this: TestContext, assert) {
    this.Router.map(function() {
      this.route('with-model', { path: 'with-model/:outer_id' }, function() {
        this.route('nested-model', { path: 'nested-model/:inner_id' });
      });
    });

    this.owner.register(
      'template:application',
      hbs`
        <Link @route="with-model.nested-model" @models={{array 123 456}} as |l|>
          <a
            data-test-link
            href={{l.href}}
            class={{if l.isActive "is-active"}}
            {{on "click" l.transitionTo}}
          >
            Link
          </a>
        </Link>
      `
    );

    await visit('/');
    assert.equal(currentURL(), '/');

    assert
      .dom('[data-test-link]')
      .hasAttribute('href', '/with-model/123/nested-model/456');
    assert.dom('[data-test-link]').hasNoClass('is-active');

    await click('[data-test-link]');
    assert.equal(currentURL(), '/with-model/123/nested-model/456');
    assert.dom('[data-test-link]').hasClass('is-active');
  });

  test('model transition', async function(this: TestContext, assert) {
    this.Router.map(function() {
      this.route('with-model', { path: 'with-model/:id' });
    });

    this.owner.register(
      'template:application',
      hbs`
        <Link @route="with-model" @models={{array 123}} as |l|>
          <a
            data-test-123
            href={{l.href}}
            class="{{if l.isActive "is-active"}} {{if l.isActiveWithoutModels "is-active-wm"}}"
            {{on "click" l.transitionTo}}
          >
            Link
          </a>
        </Link>
        <Link @route="with-model" @models={{array 456}} as |l|>
          <a
            data-test-456
            href={{l.href}}
            class="{{if l.isActive "is-active"}} {{if l.isActiveWithoutModels "is-active-wm"}}"
            {{on "click" l.transitionTo}}
          >
            Link
          </a>
        </Link>
      `
    );

    await visit('/');
    assert.equal(currentURL(), '/');

    assert.dom('[data-test-123]').hasAttribute('href', '/with-model/123');
    assert.dom('[data-test-123]').hasNoClass('is-active');
    assert.dom('[data-test-123]').hasNoClass('is-active-wm');

    assert.dom('[data-test-456]').hasAttribute('href', '/with-model/456');
    assert.dom('[data-test-456]').hasNoClass('is-active');
    assert.dom('[data-test-456]').hasNoClass('is-active-wm');

    await click('[data-test-123]');
    assert.equal(currentURL(), '/with-model/123');

    assert.dom('[data-test-123]').hasClass('is-active');
    assert.dom('[data-test-123]').hasClass('is-active-wm');

    assert.dom('[data-test-456]').hasNoClass('is-active');
    assert.dom('[data-test-456]').hasClass('is-active-wm');

    await click('[data-test-456]');
    assert.equal(currentURL(), '/with-model/456');

    assert.dom('[data-test-123]').hasNoClass('is-active');
    assert.dom('[data-test-123]').hasClass('is-active-wm');

    assert.dom('[data-test-456]').hasClass('is-active');
    assert.dom('[data-test-456]').hasClass('is-active-wm');
  });

  test('query params transition', async function(this: TestContext, assert) {
    this.Router.map(function() {
      this.route('foo');
    });

    this.owner.register(
      'route:foo',
      class FooRoute extends Route {
        queryParams = { qp: {} };
      }
    );

    this.owner.register(
      'template:application',
      hbs`
        <Link @route="foo" @query={{hash qp=123}} as |l|>
          <a
            data-test-123
            href={{l.href}}
            class="{{if l.isActive "is-active"}} {{if l.isActiveWithoutQueryParams "is-active-wqp"}}"
            {{on "click" l.transitionTo}}
          >
            Link
          </a>
        </Link>
        <Link @route="foo" @query={{hash qp=456}} as |l|>
          <a
            data-test-456
            href={{l.href}}
            class="{{if l.isActive "is-active"}} {{if l.isActiveWithoutQueryParams "is-active-wqp"}}"
            {{on "click" l.transitionTo}}
          >
            Link
          </a>
        </Link>
      `
    );

    await visit('/');
    assert.equal(currentURL(), '/');

    assert.dom('[data-test-123]').hasAttribute('href', '/foo?qp=123');
    assert.dom('[data-test-123]').hasNoClass('is-active');
    assert.dom('[data-test-123]').hasNoClass('is-active-wqp');

    assert.dom('[data-test-456]').hasAttribute('href', '/foo?qp=456');
    assert.dom('[data-test-456]').hasNoClass('is-active');
    assert.dom('[data-test-456]').hasNoClass('is-active-wqp');

    await click('[data-test-123]');
    assert.equal(currentURL(), '/foo?qp=123');

    assert.dom('[data-test-123]').hasClass('is-active');
    assert.dom('[data-test-123]').hasClass('is-active-wqp');

    assert.dom('[data-test-456]').hasNoClass('is-active');
    assert.dom('[data-test-456]').hasClass('is-active-wqp');

    await click('[data-test-456]');
    assert.equal(currentURL(), '/foo?qp=456');

    assert.dom('[data-test-123]').hasNoClass('is-active');
    assert.dom('[data-test-123]').hasClass('is-active-wqp');

    assert.dom('[data-test-456]').hasClass('is-active');
    assert.dom('[data-test-456]').hasClass('is-active-wqp');
  });

  test('it updates isEntering correctly', async function(this: TestContext, assert) {
    this.Router.map(function() {
      this.route('foo');
    });

    const deferred = pDefer();

    this.owner.register(
      'route:foo',
      class FooRoute extends Route {
        async beforeModel() {
          await deferred.promise;
        }
      }
    );

    this.owner.register(
      'template:application',
      hbs`
        <Link @route="foo" @query={{hash qp=123}} as |l|>
          <a
            data-test-123
            href={{l.href}}
            class="{{if l.isEntering "is-entering"}}"
            {{on "click" l.transitionTo}}
          >
            Link
          </a>
        </Link>
      `
    );

    await visit('/');
    assert.strictEqual(currentURL(), '/');

    click('[data-test-123');

    await settledExceptTimers();

    assert
      .dom('[data-test-123]')
      .hasClass(
        'is-entering',
        'entering class is added when transition has begun'
      );

    deferred.resolve();

    await settledExceptTimers();

    assert
      .dom('[data-test-123]')
      .doesNotHaveClass(
        'is-entering',
        'entering class is removed after transition has finished'
      );
  });

  test('it updates isExiting correctly', async function(this: TestContext, assert) {
    this.Router.map(function() {
      this.route('foo');
      this.route('bar');
    });

    const deferred = pDefer();

    this.owner.register(
      'route:bar',
      class BarRoute extends Route {
        async beforeModel() {
          await deferred.promise;
        }
      }
    );

    this.owner.register(
      'template:application',
      hbs`
        <Link @route="foo" @query={{hash qp=123}} as |l|>
          <a
            data-test-123
            href={{l.href}}
            class="{{if l.isExiting "is-exiting"}}"
            {{on "click" l.transitionTo}}
          >
            Link
          </a>
        </Link>
      `
    );

    await visit('/foo');
    assert.strictEqual(currentURL(), '/foo');

    visit('/bar');

    await settledExceptTimers();

    assert
      .dom('[data-test-123]')
      .hasClass(
        'is-exiting',
        'exiting class is added when transition has begun'
      );

    deferred.resolve();

    await settledExceptTimers();

    assert
      .dom('[data-test-123')
      .doesNotHaveClass(
        'is-exiting',
        'exiting class is removed when transition has finished'
      );
  });

  test('fromURL', async function(this: TestContext, assert) {
    this.Router.map(function() {
      this.route('foo', { path: 'foo/:id' });
    });

    this.owner.register(
      'template:application',
      hbs`{{get (link fromURL="/foo/123?bar=qux") "url"}}`
    );

    await visit('/');
    assert.equal(currentURL(), '/');

    assert.dom().hasText('/foo/123?bar=qux');
  });

  test('positional parameters', async function(this: TestContext, assert) {
    this.Router.map(function() {
      this.route('foo', { path: 'foo/:id' });
    });

    this.owner.register(
      'template:application',
      hbs`{{get (link "foo" 123) "url"}}`
    );

    await visit('/');
    assert.equal(currentURL(), '/');

    assert.dom().hasText('/foo/123');
  });
});
