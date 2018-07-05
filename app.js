'use strict';

const path = require('path');
const OAuth2Server = require('./lib/server');

module.exports = app => {
  app.coreLogger.info('[egg-oauth2-server] egg-oauth2-server begin start');
  const start = Date.now();

  const config = app.config.oAuth2Server;
  const model = app.loader.loadFile(path.join(app.config.baseDir, 'app/extend/oauth.js'))
        // @see https://github.com/Azard/egg-oauth2-server/issues/31
        || app.loader.loadFile(path.join(app.config.baseDir, 'app/extend/oauth.ts'));

  if (model === null) {
    app.coreLogger.error('[egg-oauth2-server] not find app/extend/oauth.js, egg-oauth2-server start fail');
    return;
  }
  try {
    app.oAuth2Server = new OAuth2Server(config, model);
  } catch (e) {
    app.coreLogger.error('[egg-oauth2-server] start fail, %s', e);
    return;
  }
  app.coreLogger.info('[egg-oauth2-server] egg-oauth2-server started use %d ms', Date.now() - start);
};
