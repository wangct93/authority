

const config = require('./config/server');
const util = require('wangct-server-util');

util.createServer({
  ...config,
  port:config.port
});
