'use strict';

const request = require('supertest');
const mm = require('egg-mock');
const expect = require('chai').expect;

describe('test/oauth2-server.test.js', () => {
  let app;
  before(() => {
    app = mm.app({
      baseDir: 'apps/oauth2-server-test',
    });
    return app.ready();
  });

  after(() => app.close());
  afterEach(mm.restore);

  it('should GET /', () => {
    return request(app.callback())
      .get('/')
      .expect('hi, oauth2-server')
      .expect(200);
  });

  it('GET /user/grant', () => {
    return request(app.callback())
      .get('/user/grant')
      .expect(400)
      .then(({ body }) => {
        expect(body.error).to.equal('invalid_request');
      });
  });

  it('no header POST /user/grant', () => {
    return request(app.callback())
      .post('/user/grant')
      .expect(400)
      .then(({ body }) => {
        expect(body.error).to.equal('invalid_request');
      });
  });

  it('incorrect Authorization POST /user/grant', () => {
    return request(app.callback())
      .post('/user/grant')
      .set({
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: 'Basic ZWdnL',
      })
      .send({
        grant_type: 'password',
        username: 'egg-oauth2-server',
        password: 'azard',
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.error).to.equal('invalid_client');
      });
  });

  it('correct POST /user/grant', () => {
    return request(app.callback())
      .post('/user/grant')
      .set({
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: 'Basic ZWdnLW9hdXRoMi1zZXJ2ZXItdGVzdDpBemFyZA==', // Basic base64(clientId:clientSecret)
      })
      .send({
        grant_type: 'password',
        username: 'egg-oauth2-server',
        password: 'azard',
      })
      .expect(200)
      .then(({ body }) => {
        expect(body.token_type).to.equal('bearer');
        expect(body.access_token.length).to.equal(40);
      });
  });

  it('incorrect GET /user/check', () => {
    return request(app.callback())
      .get('/user/check')
      .expect(401)
      .then(({ body }) => {
        expect(body.error).to.equal('invalid_token');
      });
  });

  it('correct GET /user/check', () => {
    return request(app.callback())
      .get('/user/check')
      .set({
        Authorization: 'Bearer 838734b4115734de1f87f02a9da9106ddec7cc30',
      })
      .expect(200);
  });
});
