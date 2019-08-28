/* eslint-disable array-callback-return */

import { visit, currentURL, click } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { module, test } from 'qunit';

import RouterDSL from '@ember/routing/-private/router-dsl';
import Route from '@ember/routing/route';
import Router from '@ember/routing/router';

import { TestContext as OriginalTestContext } from 'ember-test-helpers';

import hbs from 'htmlbars-inline-precompile';

import DummyRouter from 'dummy/router';

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
    this.Router = DummyRouter.extend();
    this.owner.register('router:main', this.Router);

    this.owner.register(
      'route:basic',
      Route.extend({
        findModel(_name: string, id: string) {
          return id;
        }
      })
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
      Route.extend({
        queryParams: { qp: {} }
      })
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
});
