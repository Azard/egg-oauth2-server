# egg-oauth2-server

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][codecov-image]][codecov-url]
[![David deps][david-image]][david-url]
[![Known Vulnerabilities][snyk-image]][snyk-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/egg-oauth2-server.svg?style=flat-square
[npm-url]: https://npmjs.org/package/egg-oauth2-server
[travis-image]: https://img.shields.io/travis/Azard/egg-oauth2-server.svg?style=flat-square
[travis-url]: https://travis-ci.org/Azard/egg-oauth2-server
[codecov-image]: https://img.shields.io/codecov/c/github/Azard/egg-oauth2-server.svg?style=flat-square
[codecov-url]: https://codecov.io/github/Azard/egg-oauth2-server?branch=master
[david-image]: https://img.shields.io/david/Azard/egg-oauth2-server.svg?style=flat-square
[david-url]: https://david-dm.org/Azard/egg-oauth2-server
[snyk-image]: https://snyk.io/test/npm/egg-oauth2-server/badge.svg?style=flat-square
[snyk-url]: https://snyk.io/test/npm/egg-oauth2-server
[download-image]: https://img.shields.io/npm/dm/egg-oauth2-server.svg?style=flat-square
[download-url]: https://npmjs.org/package/egg-oauth2-server

<!--
Description here.
-->
[Chinese Example | 中文样例教程](https://cnodejs.org/topic/592b2aedba8670562a40f60b)(注意：文章里使用的是该插件 v1.x 版本，部分 API 名称有变化，主要流程一致)

`egg-oauth2-server` is a module that easily adds oauth2 capability to [egg-based servers](https://github.com/eggjs/egg).

* egg 2.x use egg-oauth2-server latest (Node >= 8.0.0)
* egg 1.x use egg-oauth2-server 2.0.x (Node >= 6.0.0)

## Install
```bash
$ npm i egg-oauth2-server --save
```

## Usage

```js
// {app_root}/config/plugin.js
exports.oAuth2Server = {
  enable: true,
  package: 'egg-oauth2-server',
};

// {app_root}/app/router.js
app.all('/user/token', app.oAuth2Server.token());
app.get('/user/authorize', app.oAuth2Server.authorize(), 'user.code');
app.get('/user/authenticate', app.oAuth2Server.authenticate(), 'user.authenticate');

// `ctx.state.oauth` has token or code data after middleware for controller.
```

```js
// {app_root}/config/config.default.js
module.exports = config => {
  const exports = {};
  exports.oAuth2Server = {
    debug: config.env === 'local',
    grants: [ 'password' ],
  };
  return exports;
};
```

See [test/fixtures/apps/oauth2-server-test/config/config.unittest.js](test/fixtures/apps/oauth2-server-test/config/config.unittest.js) for reference.

```js
// {app_root}/app/extend/oauth.js
// or {app_root}/app/extend/oauth.ts
'use strict';

// need implement some follow functions
module.exports = app => {  
  class Model {
    constructor(ctx) {}
    async getClient(clientId, clientSecret) {}
    async getUser(username, password) {}
    async saveAuthorizationCode(code, client, user) {}
    async getAuthorizationCode(authorizationCode) {}
    async revokeAuthorizationCode(code) {}
    async saveToken(token, client, user) {}
    async getAccessToken(bearerToken) {}
    async revokeToken(token) {}
  }  
  return Model;
};
```

For full description, check out [https://www.npmjs.com/package/oauth2-server](https://www.npmjs.com/package/oauth2-server).

## Examples

A simple password-mode OAuth 2.0 server. Full code at [test/fixtures/apps/oauth2-server-test/app/extend/oauth.js](test/fixtures/apps/oauth2-server-test/app/extend/oauth.js)

### password mode `app.oauth.token()` lifecycle

`getClient` --> `getUser` --> `saveToken`

### password mode `app.oauth.authenticate()` lifecycle

Only `getAccessToken`

### authorization_code mode `app.oauth.authorize()` lifecycle

`getClient` --> `getUser` --> `saveAuthorizationCode`

### authorization_code mode `app.oauth.token()` lifecycle

`getClient` --> `getAuthorizationCode` --> `revokeAuthorizationCode` --> `saveToken`

### authorization_code mode `app.oauth.authenticate()` lifecycle

Only `getAccessToken`

## Questions & Suggestions

Please [open an issue](https://github.com/Azard/egg-oauth2-server/issues). PRs are welcomed too.

## License

[MIT](LICENSE)
