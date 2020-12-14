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
      path:'/login',
      component:'Login',
    },
    {
      path:'/',
      component:'Layout',
      children:[
        {
          path:'/menu',
          component:'Menu',
        },
        {
          path:'/role',
          component:'Role',
        },
        {
          path:'/user',
          component:'User',
        },
        {
          path:'/dept',
          component:'Dept',
        }
      ]
    },
  ],
  dynamicImport:true,
  disableCssModules:[
    resolve('src/styles')
  ],
  devServer:{
    proxy:{
      '/api/':getProxyAddress()
    },
  },
  isDev:true,
};


function getProxyAddress(){
  return `http://${util.getLocalIp()}:${serverConfig.port}`
}
