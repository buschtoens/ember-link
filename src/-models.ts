import type RouterService from '@ember/routing/router-service';

export type RouteModel = object | string | number;

export type RouteArgs = Parameters<RouterService['urlFor']>;
