'use strict';

const AuthServer = require('oauth2-server');
const Request = require('oauth2-server').Request;
const Response = require('oauth2-server').Response;
const InvalidArgumentError = require('oauth2-server/lib/errors/invalid-argument-error');
const UnauthorizedRequestError = require('oauth2-server/lib/errors/unauthorized-request-error');

const SERVER = Symbol('server#oauth2');

/**
 * Handle response.
 */

function handleResponse(response) {
  this.body = response.body;
  this.status = response.status;
  this.set(response.headers);
}

/**
 * Handle error.
 */

function handleError(e, response) {
  if (response) {
    this.set(response.headers);
  }

  if (e instanceof UnauthorizedRequestError) {
    this.status = e.code;
  } else {
    this.body = { error: e.name, error_description: e.message };
    this.status = e.code;
  }
  return this.app.emit('error', e, this);
}

class OAuth2 {
  constructor(config, model) {
    if (!model) {
      throw new InvalidArgumentError('Missing parameter: `model`');
    }
    this.config = config;
    this.model = model;
  }

  get server() {
    if (!this[SERVER]) {
      const { config, model: Model, ctx } = this;
      const model = new Model(ctx);
      this[SERVER] = new AuthServer(Object.assign(config, { model }));
      return this[SERVER];
    }
    return this[SERVER];
  }

  token() {
    const self = this;
    return function* (next) {
      const ctx = self.ctx = this;
      const request = new Request(ctx.request);
      const response = new Response(ctx.response);
      try {
        const server = self.server;
        const token = yield server.token(request, response);
        ctx.state.oauth = {
          token,
        };
        handleResponse.call(ctx, response);
      } catch (e) {
        return handleError.call(ctx, e, response);
      }
      yield* next;
    };
  }

  authenticate() {
    const self = this;
    return function* (next) {
      const ctx = self.ctx = this;
      const request = new Request(ctx.request);
      const response = new Response(ctx.response);
      try {
        const server = self.server;
        const token = yield server.authenticate(request, response);
        ctx.state.oauth = {
          token,
        };
      } catch (e) {
        return handleError.call(ctx, e);
      }
      yield* next;
    };
  }

}

module.exports = OAuth2;
