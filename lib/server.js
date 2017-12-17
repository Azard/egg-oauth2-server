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

  async execute(handle, ctx, options) {
    let result = null;
    this.ctx = ctx;
    const request = new Request(ctx.request);
    const response = new Response(replaceResponse(ctx.response));
    try {
      result = await this.server[handle](request, response, options);
      handleResponse.call(ctx, response);
    } catch (e) {
      handleError.call(ctx, e, response);
    }
    return result;
  }

  token(options) {
    const self = this;
    return async function(ctx, next) {
      const token = await self.execute('token', ctx, options);
      ctx.state.oauth = {
        token,
      };
      if (token) {
        await next();
      }
    };
  }

  authenticate(options) {
    const self = this;
    return async function(ctx, next) {
      console.log(ctx.response);
      const token = await self.execute('authenticate', ctx, options);
      ctx.state.oauth = {
        token,
      };
      if (token) {
        await next();
      }
    };
  }

  authorize(options) {
    const self = this;
    if (!options) {
      options = {};
    }
    return async function(ctx, next) {
      const opts = Object.assign(options, {
        authenticateHandler: {
          async handle(req) {
            const { username, password } = req.body;
            const user = await self.server.options.model.getUser(
              username,
              password
            );
            return user;
          },
        },
      });
      const code = await self.execute('authorize', ctx, opts);
      ctx.state.oauth = {
        code,
      };
      if (code) {
        await next();
      }
    };
  }
}

module.exports = OAuth2;
