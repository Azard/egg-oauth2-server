'use strict';

/**
 * @see https://www.npmjs.com/package/oauth2-server
 */
exports['oauth2-server'] = {
  debug: process.env.NODE_ENV !== 'production',
  grants: [ 'password' ],
  model: {},
};

