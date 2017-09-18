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
[Chinese Example | 中文样例教程](https://cnodejs.org/topic/592b2aedba8670562a40f60b)

`egg-oauth2-server` is a module that easily adds oauth2 capability to [egg-based servers](https://github.com/eggjs/egg).

## Install
* NPMJS
```bash
$ npm i egg-oauth2-server --save
```
* `cnpm` with taobao registry also work

## Usage

```js
// {app_root}/config/plugin.js
exports.oAuth2Server = {
  enable: true,
  package: 'egg-oauth2-server',
};

// {app_root}/app/router.js
app.all('/user/token', app.oAuth2Server.token());
app.get('/user/check', app.oAuth2Server.authenticate(), 'user.check');
```

## Configuration

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

For full description, check out [https://www.npmjs.com/package/oauth2-server](https://www.npmjs.com/package/oauth2-server).

## Examples

A simple password-mode OAuth 2.0 server. Full code at [test/fixtures/apps/oauth2-server-test/app/extend/oauth.js](test/fixtures/apps/oauth2-server-test/app/extend/oauth.js)

```js
// {app_root}/app/extend/oauth.js
'use strict';

module.exports = app => {  
  class Model {
    constructor(ctx) {}
    async getClient(clientId, clientSecret) {}
    async getUser(jobnumber, password) {}
    async getAccessToken(bearerToken) {}
    async saveToken(token, client, user) {}
    async getAuthorizationCode(authorizationCode) {}
    async saveAuthorizationCode(code, client, user) {}
  }  
  return Model;
};
```

Full description at [https://www.npmjs.com/package/oauth2-server](https://www.npmjs.com/package/oauth2-server).

* password-mode `app.oauth.token()` lifecycle

`getClient` --> `getUser` --> `saveToken`

* password-mode `app.oauth.authenticate()` lifecycle

Only `getAccessToken`

## Questions & Suggestions

Please [open an issue](https://github.com/Azard/egg-oauth2-server/issues). PRs are welcomed too.

## License

[MIT](LICENSE)
