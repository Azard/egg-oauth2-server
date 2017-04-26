'use strict';

module.exports = app => {
  app.get('/', function* () {
    this.body = 'hi';
  });

  app.all('/user/grant', app.oauth.grant());
  app.get('/user/check', app.oauth.authorise(), 'user.check');
};
