import Application from '@ember/application';

import loadInitializers from 'ember-load-initializers';

import config from './config/environment';
import Resolver from './resolver';

export default class DummyApp extends Application {
  modulePrefix = config.modulePrefix;
  podModulePrefix = config.podModulePrefix;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  Resolver = Resolver;
}

loadInitializers(DummyApp, config.modulePrefix);
