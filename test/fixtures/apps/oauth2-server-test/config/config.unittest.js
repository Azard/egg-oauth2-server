'use strict';

const oauth_model = require('../app/extend/oauth');

module.exports = app => {
  const exports = {};

  exports.keys = '123456';
  exports['oauth2-server'] = {
    debug: process.env.NODE_ENV !== 'production',
    grants: [ 'password' ],
    model: oauth_model(app),
  };

  exports.security = {
    csrf: {
      enable: false,
    },
  };
  return exports;
};
