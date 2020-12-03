const util = require('wangct-server-util');
const serverConfig = require('../server/config/server');

const {resolve} = util;

module.exports = {
  output:{
    build:{
      publicPath:'/assets/'
    }
  },
  routes:[
    {
      path:'/',
      component:'Layout'
    }
  ],
  dynamicImport:true,
  disableCssModules:[
    resolve('src/styles')
  ],
  proxy:{
    '/api/':getProxyAddress()
  }
};


function getProxyAddress(){
  return `http://${util.getLocalIp()}:${serverConfig.port}`
}
