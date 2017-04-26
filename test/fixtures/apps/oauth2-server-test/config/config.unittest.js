'use strict';

module.exports = config => {
  const exports = {};

  exports.keys = '123456';
  exports.oauth2Server = {
    debug: config.env === 'local',
    grants: [ 'password' ],
  };
  exports.security = {
    csrf: {
      enable: false,
    },
  };
  return exports;
};
