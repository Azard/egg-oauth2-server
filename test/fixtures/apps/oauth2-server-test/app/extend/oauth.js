'use strict';

module.exports = () => {
  const model = {};
  const user = {
    username: 'egg-oauth2-server',
    password: 'azard',
  };

  model.getClient = (clientId, clientSecret, callback) => {
    if (clientId === 'egg-oauth2-server-test' && clientSecret === 'Azard') {
      callback(null, {
        clientId,
      });
    } else {
      callback(null, null);
    }
  };

  model.grantTypeAllowed = (clientId, grantType, callback) => {
    if (grantType === 'password' && clientId === 'egg-oauth2-server-test') {
      callback(null, true);
    } else {
      callback(null, false);
    }
  };

  // only for password mode
  model.getUser = (username, password, callback) => {
    if (username === user.username && password === user.password) {
      callback(null, {
        id: 123,
      });
    } else {
      callback(null, null);
    }
  };

  model.saveAccessToken = (accessToken, clientId, expires, user, callback) => {
    callback(null);
  };

  model.getAccessToken = (bearerToken, callback) => {
    if (!bearerToken || bearerToken.length !== 40) {
      callback(null, false);
    } else {
      callback(null, {
        expires: null,
        user: {
          id: 123,
        },
      });
    }
  };

  return model;
};
