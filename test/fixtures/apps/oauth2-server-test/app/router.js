'use strict';

module.exports = app => {
  app.get('/', function* () {
    this.body = 'hi, ' + app.plugins['oauth2-server'].name;
  });

  app.all('/user/grant', app.oauth.grant());
  app.get('/user/check', app.oauth.authorise(), 'user.check');
};
