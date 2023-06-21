import Controller from '@ember/controller';
import Route from '@ember/routing/route';
import { click, currentURL, visit } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';

import pDefer from 'p-defer';
import sinon from 'sinon';

import { settledExceptTimers } from '../helpers/settled-except-timers';

import type { TestContext } from '@ember/test-helpers';

module('Acceptance | link', function (hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function (this: TestContext) {
    this.owner.register(
      'route:basic',
      class BasicRoute extends Route {
        findModel(_name: string, id: string) {
          return id;
        }
      }
    );
  });

  test('basic test', async function (this: TestContext, assert) {
    this.owner.register(
      'template:application',
      hbs`
        {{#let (link route="foo") as |l|}}
          <a
            data-test-link
            href={{l.url}}
            class={{if l.isActive "is-active"}}
            {{on "click" l.transitionTo}}
          >
            Link
          </a>
        {{/let}}
      `
    );

    await visit('/');
    assert.strictEqual(currentURL(), '/');

    assert.dom('[data-test-link]').hasAttribute('href', '/foo');
    assert.dom('[data-test-link]').hasNoClass('is-active');

    await click('[data-test-link]');
    assert.strictEqual(currentURL(), '/foo');
    assert.dom('[data-test-link]').hasClass('is-active');
  });

  test('with model', async function (this: TestContext, assert) {
    this.owner.register(
      'template:application',
      hbs`
        {{#let (link route="with-model" models=(array 123)) as |l|}}
          <a
            data-test-link
            href={{l.url}}
            class={{if l.isActive "is-active"}}
            {{on "click" l.transitionTo}}
          >
            Link
          </a>
        {{/let}}
      `
    );

    await visit('/');
    assert.strictEqual(currentURL(), '/');

    assert.dom('[data-test-link]').hasAttribute('href', '/with-model/123');
    assert.dom('[data-test-link]').hasNoClass('is-active');

    await click('[data-test-link]');
    assert.strictEqual(currentURL(), '/with-model/123');
    assert.dom('[data-test-link]').hasClass('is-active');
  });

  test('@model shorthand', async function (this: TestContext, assert) {
    this.owner.register(
      'template:application',
      hbs`
        {{#let (link route="with-model" model="123") as |l|}}
          <a
            data-test-link
            href={{l.url}}
            class={{if l.isActive "is-active"}}
            {{on "click" l.transitionTo}}
          >
            Link
          </a>
        {{/let}}
      `
    );

    await visit('/');
    assert.strictEqual(currentURL(), '/');

    assert.dom('[data-test-link]').hasAttribute('href', '/with-model/123');
    assert.dom('[data-test-link]').hasNoClass('is-active');

    await click('[data-test-link]');
    assert.strictEqual(currentURL(), '/with-model/123');
    assert.dom('[data-test-link]').hasClass('is-active');
  });

  test('with nested model', async function (this: TestContext, assert) {
    this.owner.register(
      'template:application',
      hbs`
        {{#let (link route="parent.child" models=(array 123 456)) as |l|}}
          <a
            data-test-link
            href={{l.url}}
            class={{if l.isActive "is-active"}}
            {{on "click" l.transitionTo}}
          >
            Link
          </a>
        {{/let}}
      `
    );

    await visit('/');
    assert.strictEqual(currentURL(), '/');

    assert.dom('[data-test-link]').hasAttribute('href', '/parent/123/child/456');
    assert.dom('[data-test-link]').hasNoClass('is-active');

    await click('[data-test-link]');
    assert.strictEqual(currentURL(), '/parent/123/child/456');
    assert.dom('[data-test-link]').hasClass('is-active');
  });

  test('model transition', async function (this: TestContext, assert) {
    this.owner.register(
      'template:application',
      hbs`
        {{#let (link route="with-model" models=(array 123)) as |l|}}
          <a
            data-test-123
            href={{l.url}}
            class="{{if l.isActive "is-active"}} {{if l.isActiveWithoutModels "is-active-wm"}}"
            {{on "click" l.transitionTo}}
          >
            Link
          </a>
        {{/let}}
        {{#let (link route="with-model" models=(array 456)) as |l|}}
          <a
            data-test-456
            href={{l.url}}
            class="{{if l.isActive "is-active"}} {{if l.isActiveWithoutModels "is-active-wm"}}"
            {{on "click" l.transitionTo}}
          >
            Link
          </a>
        {{/let}}
      `
    );

    await visit('/');
    assert.strictEqual(currentURL(), '/');

    assert.dom('[data-test-123]').hasAttribute('href', '/with-model/123');
    assert.dom('[data-test-123]').hasNoClass('is-active');
    assert.dom('[data-test-123]').hasNoClass('is-active-wm');

    assert.dom('[data-test-456]').hasAttribute('href', '/with-model/456');
    assert.dom('[data-test-456]').hasNoClass('is-active');
    assert.dom('[data-test-456]').hasNoClass('is-active-wm');

    await click('[data-test-123]');
    assert.strictEqual(currentURL(), '/with-model/123');

    assert.dom('[data-test-123]').hasClass('is-active');
    assert.dom('[data-test-123]').hasClass('is-active-wm');

    assert.dom('[data-test-456]').hasNoClass('is-active');
    assert.dom('[data-test-456]').hasClass('is-active-wm');

    await click('[data-test-456]');
    assert.strictEqual(currentURL(), '/with-model/456');

    assert.dom('[data-test-123]').hasNoClass('is-active');
    assert.dom('[data-test-123]').hasClass('is-active-wm');

    assert.dom('[data-test-456]').hasClass('is-active');
    assert.dom('[data-test-456]').hasClass('is-active-wm');
  });

  test('query params transition', async function (this: TestContext, assert) {
    this.owner.register(
      'route:foo',
      class FooRoute extends Route {
        queryParams = { qp: {} };
      }
    );

    this.owner.register(
      'template:application',
      hbs`
        {{#let (link route="foo" query=(hash qp=123)) as |l|}}
          <a
            data-test-123
            href={{l.url}}
            class="{{if l.isActive "is-active"}} {{if l.isActiveWithoutQueryParams "is-active-wqp"}}"
            {{on "click" l.transitionTo}}
          >
            Link
          </a>
        {{/let}}
        {{#let (link route="foo" query=(hash qp=456)) as |l|}}
          <a
            data-test-456
            href={{l.url}}
            class="{{if l.isActive "is-active"}} {{if l.isActiveWithoutQueryParams "is-active-wqp"}}"
            {{on "click" l.transitionTo}}
          >
            Link
          </a>
        {{/let}}
      `
    );

    await visit('/');
    assert.strictEqual(currentURL(), '/');

    // await this.pauseTest();

    assert.dom('[data-test-123]').hasAttribute('href', '/foo?qp=123');
    assert.dom('[data-test-123]').hasNoClass('is-active');
    assert.dom('[data-test-123]').hasNoClass('is-active-wqp');

    assert.dom('[data-test-456]').hasAttribute('href', '/foo?qp=456');
    assert.dom('[data-test-456]').hasNoClass('is-active');
    assert.dom('[data-test-456]').hasNoClass('is-active-wqp');

    await click('[data-test-123]');
    assert.strictEqual(currentURL(), '/foo?qp=123');

    assert.dom('[data-test-123]').hasClass('is-active');
    assert.dom('[data-test-123]').hasClass('is-active-wqp');

    assert.dom('[data-test-456]').hasNoClass('is-active');
    assert.dom('[data-test-456]').hasClass('is-active-wqp');

    await click('[data-test-456]');
    assert.strictEqual(currentURL(), '/foo?qp=456');

    assert.dom('[data-test-123]').hasNoClass('is-active');
    assert.dom('[data-test-123]').hasClass('is-active-wqp');

    assert.dom('[data-test-456]').hasClass('is-active');
    assert.dom('[data-test-456]').hasClass('is-active-wqp');
  });

  test('it updates isEntering correctly', async function (this: TestContext, assert) {
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
        {{#let (link route="foo" query=(hash qp=123)) as |l|}}
          <a
            data-test-123
            href={{l.url}}
            class="{{if l.isEntering "is-entering"}}"
            {{on "click" l.transitionTo}}
          >
            Link
          </a>
        {{/let}}
      `
    );

    await visit('/');
    assert.strictEqual(currentURL(), '/');

    click('[data-test-123]');

    await settledExceptTimers();

    assert
      .dom('[data-test-123]')
      .hasClass('is-entering', 'entering class is added when transition has begun');

    deferred.resolve();

    await settledExceptTimers();

    assert
      .dom('[data-test-123]')
      .doesNotHaveClass('is-entering', 'entering class is removed after transition has finished');
  });

  test('it updates isExiting correctly', async function (this: TestContext, assert) {
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
        {{#let (link route="foo" query=(hash qp=123)) as |l|}}
          <a
            data-test-123
            href={{l.url}}
            class="{{if l.isExiting "is-exiting"}}"
            {{on "click" l.transitionTo}}
          >
            Link
          </a>
        {{/let}}
      `
    );

    await visit('/foo');
    assert.strictEqual(currentURL(), '/foo');

    visit('/bar');

    await settledExceptTimers();

    assert
      .dom('[data-test-123]')
      .hasClass('is-exiting', 'exiting class is added when transition has begun');

    deferred.resolve();

    await settledExceptTimers();

    assert
      .dom('[data-test-123')
      .doesNotHaveClass('is-exiting', 'exiting class is removed when transition has finished');
  });

  test('fromURL', async function (this: TestContext, assert) {
    this.owner.register(
      'template:application',
      hbs`{{get (link fromURL="/with-model/123?bar=qux") "url"}}`
    );

    await visit('/');
    assert.strictEqual(currentURL(), '/');

    assert.dom().hasText('/with-model/123?bar=qux');
  });

  test('positional parameters', async function (this: TestContext, assert) {
    this.owner.register('template:application', hbs`{{get (link "with-model" 123) "url"}}`);

    await visit('/');
    assert.strictEqual(currentURL(), '/');

    assert.dom().hasText('/with-model/123');
  });

  test('it fires onTransitionTo correctly', async function (this: TestContext, assert) {
    const spy = sinon.spy();

    this.owner.register(
      'controller:application',
      class ApplicationController extends Controller {
        spy = spy;
      }
    );
    this.owner.register(
      'template:application',
      hbs`
        {{#let (link route="foo" query=(hash qp=123) onTransitionTo=this.spy) as |l|}}
          <a
            data-test-123
            href={{l.url}}
            {{on "click" l.transitionTo}}
          >
            Link
          </a>
        {{/let}}
      `
    );

    await visit('/');
    assert.strictEqual(currentURL(), '/');

    await click('[data-test-123]');

    assert.ok(spy.calledOnce);
  });

  test('it fires onReplaceWith correctly', async function (this: TestContext, assert) {
    const spy = sinon.spy();

    this.owner.register(
      'controller:application',
      class ApplicationController extends Controller {
        spy = spy;
      }
    );
    this.owner.register(
      'template:application',
      hbs`
        {{#let (link route="foo" query=(hash qp=123) onReplaceWith=this.spy) as |l|}}
          <a
            data-test-123
            href={{l.url}}
            {{on "click" l.replaceWith}}
          >
            Link
          </a>
        {{/let}}
      `
    );

    await visit('/');
    assert.strictEqual(currentURL(), '/');

    await click('[data-test-123]');

    assert.ok(spy.calledOnce);
  });
});
