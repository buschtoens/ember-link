// @ts-ignore
import Application from '../app';
import config from '../config/environment';
import { setApplication } from '@ember/test-helpers';
import { start } from 'ember-qunit';
import 'qunit-dom';

// @ts-ignore
setApplication(Application.create(config.APP));

start();
