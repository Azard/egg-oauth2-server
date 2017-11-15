'use strict';

const AuthServer = require('oauth2-server');
const Request = require('oauth2-server').Request;
const Response = require('oauth2-server').Response;
const InvalidArgumentError = require('oauth2-server/lib/errors/invalid-argument-error');
const UnauthorizedRequestError = require('oauth2-server/lib/errors/unauthorized-request-error');

const SERVER = Symbol('server#oauth2');

/**
 * replace response.
 */

function replaceResponse(res) {
  // copy for response.headers.hasOwnProperty is undefined case
  const newResponse = {
    headers: {},
  };
  for (const property in res) {
    if (property !== 'headers') {
      newResponse[property] = res[property];
    }
  }
  for (const field in res.headers) {
    newResponse.headers[field] = res.headers[field];
  }
  newResponse.header = newResponse.headers;
  return newResponse;
}

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

  * execute(handle, options) {
    let result = null;
    const ctx = this.ctx;
    const request = new Request(ctx.request);
    const response = new Response(replaceResponse(ctx.response));
    try {
      result = yield this.server[handle](request, response, options);
      handleResponse.call(ctx, response);
    } catch (e) {
      handleError.call(ctx, e, response);
    }
    return result;
  }

  token(options) {
    const self = this;
    return function* (next) {
      const ctx = self.ctx = this;
      const token = yield self.execute('token', options);
      ctx.state.oauth = {
        token,
      };
      if (token) { yield* next; }
    };
  }

  authenticate(options) {
    const self = this;
    return function* (next) {
      const ctx = self.ctx = this;
      const token = yield self.execute('authenticate', options);
      ctx.state.oauth = {
        token,
      };
      if (token) yield* next;
    };
  }

  authorize(options) {
    const self = this;
    return function* (next) {
      const ctx = self.ctx = this;
      const opts = Object.assign(options, {
        authenticateHandler: {
          * handle(req) {
            const { username, password } = req.body;
            const user = yield self.server.options.model.getUser(
              username,
              password
            );
            return user;
          },
        },
      });
      const code = yield self.execute('authorize', opts);
      ctx.state.oauth = {
        code,
      };
      if (code) { yield* next; }
    };
  }
}

module.exports = OAuth2;
