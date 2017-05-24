'use strict';

const path = require('path');
const oauth2server = require('koa-oauth-server');

module.exports = app => {
  app.coreLogger.info('[egg-oauth2-server] egg-oauth2-server begin start');
  const start = Date.now();
  app.config.oauth2Server.model = app.loader.loadFile(path.join(app.config.baseDir, 'app/extend/oauth.js'));
  if (app.config.oauth2Server.model === null) {
    app.coreLogger.error('[egg-oauth2-server] not find app/extend/oauth.js, egg-oauth2-server start fail');
    return;
  }
  try {
    app.oauth = oauth2server(app.config.oauth2Server);
  } catch (e) {
    app.coreLogger.error('[egg-oauth2-server] start fail, %s', e);
    return;
  }
  app.coreLogger.info('[egg-oauth2-server] egg-oauth2-server started use %d ms', Date.now() - start);
};
