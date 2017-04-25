'use strict';

module.exports = app => {
  class UserController extends app.Controller {
    async index() {
      this.ctx.body = 'index';
    }

    async check() {
      this.ctx.body = 'ok';
    }
  }
  return UserController;
};