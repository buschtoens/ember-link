import { setApplication } from '@ember/test-helpers';
import { start } from 'ember-qunit';

import Application from 'dummy/app';
import config from 'dummy/config/environment';

import 'qunit-dom';

setApplication(Application.create(config.APP));

start();
