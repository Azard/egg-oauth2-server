'use strict';

const oauth2server = require('koa-oauth-server');

module.exports = app => {
  console.log('egg-oauth2-server begin start');
  app.oauth = oauth2server(app.config['oauth2-server']);
  console.log('egg-oauth2-server started');
};
