const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const pathUtil = require('./path');
const serverUtil = require('./util');
const {proParse} = require('@wangct/util');
const {resolve} = pathUtil;
const multer = require('multer');
const toPromise = require("@wangct/util/lib/promiseUtil").toPromise;
const isFunc = require("@wangct/util/lib/typeUtil").isFunc;
const log = require("./log").log;
const {pathFilename} = require("./path");
const {isDir} = require("./file");
const {toAry} = require('@wangct/util');
const {BaseData} = require('./dataClass');

/**
 * 服务类
 */
class Server extends BaseData{

  constructor(options){
    super();
    this.setProps({
      html:'dist/index.html',
      port:8080,
      autoStart:true,
      routerDirname:'server/router',
      ...options,
    });
    this.init();
  }

  init(){
    this.createApp();
    this.addLog();
    this.addAssets();
    this.addUploadBodyParser();
    this.addBodyParser();
    this.addCookieParser();
    this.addSession();
    this.addRouter();

    if(this.getProps('autoStart')){
      this.start();
    }
  }

  createApp(){
    this.app = express(this.server);
  }

  getApp(){
    return this.app;
  }

  addLog(){
    this.getApp().use((req,res,next) => {
      log('请求地址：' + req.url);
      next();
    });
  }

  addAssets() {
    const {assets,assetsPaths} = this.getProps();
    const app = this.getApp();
    toAry(assets).forEach(asset => {
      toAry(assetsPaths).forEach(assetsPath => {
        app.use(formatRouterPath(assetsPath),express.static(resolve(asset)));
      });
    });
  }

  getRouterByDirname(){
    let {routerDirname} = this.getProps();
    routerDirname = resolve(routerDirname);
    if(isDir(routerDirname)){
      return require('fs').readdirSync(routerDirname).map(fileName => {
        const filePath = resolve(routerDirname,fileName);
        return {
          path:formatRouterPath(pathFilename(fileName,false)),
          router:require(filePath),
        }
      });
    }
    return [];
  }

  addRouter() {
    const {routers = this.getRouterByDirname()} = this.getProps();
    const app = this.getApp();
    routers.forEach(router => {
      let {router:routerFunc} = router;
      if(!isFunc(routerFunc)){
        routerFunc = express.Router();
        Object.keys(router.router).forEach((key) => {
          routerFunc.post(formatRouterPath(key),(req,res,next) => {
            toPromise(router.router[key],req,res,next).then((data) => {
              sendRes(res,data);
            }).catch((err) => {
              sendErrRes(res,err);
            });
          });
        });
      }
      app.use(formatRouterPath(router.path),routerFunc);
      app.use(formatRouterPath('/api',router.path),routerFunc);
    });
  }

  addBodyParser() {
    const app = this.getApp();
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: false}));
  }

  addUploadBodyParser() {
    const upload = multer({
      dest: resolve('temp/multer')
    });
    this.getApp().use(upload.any());
  }

  addCookieParser() {
    this.getApp().use(cookieParser());
  }

  addSession() {
    this.getApp().use(session({
      secret:'wangct',
      name:'ssid',
      cookie:{},
      resave:false,
      saveUninitialized:true
    }));
  }

  addIndexHtml(){
    const html = this.getProps('html');
    if(!html){
      return;
    }
    this.getApp().use((req,res) => {
      res.sendFile(resolve(html));
    });
  }

  start(){
    const port = this.getProps('port');
    const app = this.getApp();
    this.addIndexHtml();
    app.use(catchErrorMiddleware);
    app.listen(port,'0.0.0.0',() => {
      log(`server is started`);
      log(`本地地址：http://${serverUtil.getLocalIp()}:${port}`);
    });
  }
}


module.exports = {
  sendRes,
  Server,
};

/**
 * 发送响应
 * @param res
 * @param data
 * @param err
 */
function sendRes(res,data,err){
  if(err){
    sendErrRes(res,err);
  }else{
    proParse(data).then((data) => {
      res.send({
        code:0,
        data
      });
    }).catch((err) => {
      sendErrRes(err);
    });
  }
}

/**
 * 响应返回错误
 * @author wangchuitong
 */
function sendErrRes(res,err = {}){
  log(err);
  res.send({
    code:err.code || 500,
    message:getErrMsg(err),
  });
}

/**
 * 获取错误信息
 * @param err
 * @returns {*}
 */
function getErrMsg(err){
  return err.message || err;
}

/**
 * 格式化地址
 * @param args
 * @returns {string}
 */
function formatRouterPath(...args){
  return require('path').join('/',...args).replace(/\\/g,'/')
}

/**
 * 捕捉错误中间件
 */
function catchErrorMiddleware(err,req,res,next){
  sendErrRes(res,err);
}
