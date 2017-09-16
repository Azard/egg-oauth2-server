'use strict';

const path = require('path');
const nconf = require('nconf');

module.exports = app => {

  // Mock Data
  nconf.use('file', {
    file: path.join(app.config.baseDir, 'app/mock/db.json'),
  });

  class Model {
    constructor(ctx) {
      this.ctx = ctx;
    }

    * getClient(clientId, clientSecret) {
      const client = nconf.get('client');
      if (clientId !== client.clientId || clientSecret !== client.clientSecret) {
        return;
      }
      return client;
    }

    * getUser(username, password) {
      const user = nconf.get('user');
      if (username !== user.username || password !== user.password) {
        return;
      }
      return { userId: user.id };
    }

    * getAccessToken(bearerToken) {
      const token = nconf.get('token');
      const user = nconf.get('user');
      const client = nconf.get('client');
      token.user = user;
      token.client = client;
      return token;
    }

    * saveToken(token, client, user) {
      const _token = Object.assign({}, token, { user }, { client });
      nconf.set('token', _token);
      nconf.save();
      return _token;
    }
  }

  return Model;
};
