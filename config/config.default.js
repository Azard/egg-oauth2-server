'use strict';


module.exports = config => {
  const exports = {};
  /**
   * @see https://www.npmjs.com/package/oauth2-server
   */
  exports.oAuth2Server = {
    debug: config.env === 'local',
    grants: [ 'password' ],
  };
  return exports;
};
