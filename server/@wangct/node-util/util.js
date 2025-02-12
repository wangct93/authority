/**
 * Created by wangct on 2018/12/22.
 */

const {objForEach} = require('@wangct/util');

module.exports = {
    getLocalIp,
    getClientIp,
    getOuterNetIp,
    closePort,
    proxyRequest,
    getReqBody,
    cbPromise,
};

/**
 * 代理请求
 * @param url
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
function proxyRequest(url,req,res){
    const rs = require('request')(url,{
        method:req.method,
        headers:req.headers
    });
    res && rs.pipe(res);
    return rs;
}


/**
 * 判断端口是否可用
 * @param port
 * @returns {Promise<unknown>}
 */
async function portUseable(port){
    const p1 = portUseableFunc(port);
    const p2 = portUseableFunc(port,true);
    const useable1 = await p1;
    const useable2 = await p2;
    return useable1 && useable2;
}

/**
 * 判断端口是否可用方法
 * @param port
 * @param useIp
 * @returns {Promise<unknown>}
 */
function portUseableFunc(port,useIp) {
    return new Promise(cb => {
        const http = require('http');
        const server = http.createServer().listen(port, useIp && '0.0.0.0',() => {
            server.close();
            cb(true);
        });
        server.on('error', () => {
            cb(false);
        });
    })
}

/**
 * 关闭端口
 * @param port
 * @returns {Promise<void>}
 */
async function closePort(port){
    await tryClosePort(port).catch(() => {});
    const useable = await portUseable(port);
    if(!useable){
        throw new Error('关闭端口失败！');
    }
}

/**
 * 尝试关闭端口
 * @param port
 * @returns {Promise<unknown>}
 */
async function tryClosePort(port) {
    const {exec} = require('child_process');
    return new Promise((cb, eb) => {
        exec(`netstat -aon | findstr "${port}"`, (err, stdout) => {
            if (err) {
                eb(err);
                return;
            }
            let items = stdout.split('\n')[0].trim().split(/\s+/);
            let address = items[1];
            let pid = items[4];
            if (address.split(':')[1] !== port + '' || !pid || pid.length === 0) {
                eb('获取进程id失败');
                return;
            }
            exec(`taskkill /F /pid ${pid}`, (err) => {
                if (err) {
                    eb(err);
                    return false;
                }else{
                    cb(true);
                }
            });
        });
    })
}

/**
 * 获取本地ip
 * @returns {string}
 */
function getLocalIp() {
    const interfaces = require('os').networkInterfaces();
    let ip = '';
    objForEach(interfaces,(value) => {
        value && value.forEach(item => {
            if (item.family === 'IPv4' && item.address !== '127.0.0.1' && !item.internal) {
                ip = item.address;
            }
        })
    });
    return ip;
}

/**
 * 获取客户端ip
 * @param req
 * @returns {string}
 */
function getClientIp(req) {
    if(!req || !req.headers){
        return '';
    }
    const ips = req.headers['x-forwarded-for']
      || req.headers['x-wq-realip']
      || req.ip
      || req.connection.remoteAddress
      || req.socket.remoteAddress
      || req.connection.socket.remoteAddress
      || '';
    return ips.split(',')[0];
}

/**
 * 获取外网ip
 * @returns {Promise<unknown>}
 */
function getOuterNetIp(){
    return new Promise((cb,eb) => {
        require('request')('http://200019.ip138.com/',(err,res,body) => {
            if(err){
                return eb(err);
            }
            const $ = require('cheerio').load(body);
            const title = $('title').text() || '';
            const ip = title.split('：')[1];
            ip ? cb(ip.trim()) : eb('获取ip失败');
        })
    })
}

/**
 * 获取请求的数据
 * @returns {Promise<*>}
 */
async function getReqBody(req,options = {}) {

  return new Promise((cb, eb) => {
    let buf = Buffer.alloc(0);
    const {timeout = 60 * 1000} = options;
    let timer;

    function start() {
      clear();
      timer = setTimeout(() => {
        console.log('getReqBody超时');
        eb('timeout');
      }, timeout);
    }

    function clear() {
      clearTimeout(timer);
    }

    start();
    req.on('data', (chunk) => {
      start();
      buf = Buffer.concat([buf, chunk]);
    });
    req.on('end', () => {
      clear();
      cb(buf);
    });
    req.on('error', (err) => {
      clear();
      eb(err);
    });

  });
}

/**
 * 回调函数转promise
 * @param obj
 * @param funcName
 * @param args
 * @returns {Promise<any>}
 */
function cbPromise(obj,funcName,...args){
    return new Promise((cb,eb) => {
        if(obj[funcName]){
            obj[funcName](...args,(err,data) => {
                if(err){
                    eb(err);
                }else{
                    cb(data);
                }
            });
        }else{
            eb(funcName + '方法不存在');
        }
    })
}
