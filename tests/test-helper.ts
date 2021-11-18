import { setApplication } from '@ember/test-helpers';
import { start } from 'ember-qunit';
import * as QUnit from 'qunit';
import { setup as setupQUnitDOM } from 'qunit-dom';

// TODO: add types in upstream repo
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import setupSinon from 'ember-sinon-qunit';

import Application from 'dummy/app';
import config from 'dummy/config/environment';

import 'qunit-dom';

setApplication(Application.create(config.APP));

setupQUnitDOM(QUnit.assert);
setupSinon();
start();
