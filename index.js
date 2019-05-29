const path = require('path');
const fs = require('fs');
const express = require('express');
const ParseDashboard = require('parse-dashboard');
const ParseServer = require('parse-server').ParseServer;

module.exports.express = express;
module.exports.server = ParseServer;
module.exports.dashboard = ParseDashboard;
module.exports.config = function (config) {
  switch (typeof config) {
    case 'object':
      break;
    case 'string':
      if (!path.isAbsolute(config)) {
        config = path.resolve(process.cwd(), config);
      }
      config = require(config);
      break;
    default:
      const configFile = {
        pwd: path.join(process.cwd(), 'parse.json'),
        default: path.join(__dirname, 'parse.json')
      };
      if (fs.existsSync(configFile.pwd)) {
        config = require(configFile.pwd);
      } else {
        config = require(configFile.default);
        fs.copyFile(configFile.default, configFile.pwd, err => err && console.error(err));
      }
  }
  return config;
};
module.exports.middleware = function (config) {
  config = this.config(config);

  const app = express();

  if (config.enabled.dashboard) {
    const dashboard = Object.assign({
      apps: config.apps
    }, config.dashboard);
    app.use(dashboard.mountPath || '/', new ParseDashboard(dashboard, dashboard.options || {}));
  }
  if (config.enabled.server) {
    config.apps.forEach(server => app.use(server.mountPath || '/', new ParseServer(server)));
  }
  if (config.enabled.static) {
    config.statics.forEach(static => {
      if (!path.isAbsolute(static.path)) {
        static.path = path.resolve(process.cwd(), static.path);
      }
      app.use(static.mountPath || '/', express.static(static.path, static.options || {}));
      if (static.rewrite) {
        let index = path.join(static.path, static.options.index || 'index.html');
        let route = [static.mountPath || '', '**'].join('/').replace('//', '/');
        app.get(route, (req, res, next) => fs.existsSync(index) ? res.sendFile(index) : next());
      }
    });
  }

  return app;
};