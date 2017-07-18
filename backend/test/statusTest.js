var crypto = require('crypto');
var fs = require('fs');

var iconv = require("iconv-lite");
var moment = require("moment");
var request = require('request');
var async = require('async');

// request.debug = true;
var proxyOpts = {
    appkey      : '65245197',
    secret      : '9bee21aa37173a1fd9584155ed91b535',
    proxyHost   : '182.92.1.222',
    proxyPort   : 8123,
    auth        : "MYH-AUTH-MD5 "
};
var s = 0,
	t = 0;
// var dataList = JSON.parse(fs.readFileSync('./a.json')).data;
 var dataList = [{
         "weburl": "https://yunyijj.tmall.com",
         "shopid": "aa3450edbf6a42e2a082e0217606d88f"
     }];
console.log(dataList.length);
async.eachSeries(dataList, function(msgData, cb) {
    // 获取代理认证签名
    var auth = {};
    //console.log(auth);
    setTimeout(function () {
        // 访问店铺页面
		if(msgData.weburl.indexOf("tmall") == -1) {
			//console.log("taobao 店铺url：", msgData.weburl);
			cb(null, null);
		} else {
			console.log("开始采集店铺，url：", msgData.weburl);
			visitHttp(msgData.weburl, auth, proxyOpts, function(err, body) {
				// 判断店铺状态
				var status = getShopStatus(body);
				// console.log(body);
				t++;
				if (status === "WARN") {
					console.log("采集失败，uuID：", msgData.shopid);
					var filePath = "./f.txt"
					fs.appendFileSync(filePath, '{"weburl": "' + msgData.weburl + '","shopid": "' + msgData.shopid + '"}\r\n');
				} else {
					s++;
					console.log("采集成功，uuID：", msgData.shopid);
					var filePath = "./s.txt"
					fs.appendFileSync(filePath, '{"weburl": "' + msgData.weburl + '","shopid": "' + msgData.shopid + '"}\r\n');
				}
				console.log("采集统计,总次数：" + t + "，成功：" + s);
				cb(null, null);
			});
		}
    }, 1000);
}, function(err, result) {
    if (err) {
        console.error(err);
    }
    console.log('店铺的商品基本信息保存成功.');
});

/**
 * 生成代理认证签名
 * @param  options  代理参数
 * @return auth     代理认证签名
 */
function getAuthToProxy(options) {
    var codes = options.secret;
    var auth  = "MYH-AUTH-MD5 ";
    var param = [];
    param.push("app_key=" + options.appkey);
    param.push("timestamp=" + moment(new Date()).format("YYYY-MM-DD HH:mm:ss"));
    //param.push("enable-simulate=false");
    param.sort();
    for (var i = 0; i < param.length; i++) {
        auth += param[i] + "&";
        codes += param[i].replace("=", "");
    }
    codes += options.secret;
    // 拼接签名
    auth += "sign=" + '6BAAC484589042CF9BF209011DE03174'; //crypto.createHash('md5').update(codes).digest('hex').toUpperCase();
	console.log(auth);
    return auth;
}

/**
 * http访问
 * @param url       网站地址
 * @param auth      代理认证
 * @param proxyOpts 代理参数
 * @param callback  回调
 * @param tryTimes  当前重试次数（默认不填）
 */
function visitHttp(url, auth, proxyOpts, callback, tryTimes) {
    tryTimes = tryTimes || 0;
    tryTimes++;
    console.log(url);

    // http访问（GET）
    request.get({
        //url: 'http://192.168.5.234:8080?url=' + encodeURIComponent(url),
		url: url,
        maxRedirects: 25,
        rejectUnauthorized: false,
        strictSSL:false,
		tunnel: false,
        proxy: 'http://' + proxyOpts.proxyHost + ':' + proxyOpts.proxyPort,
		proxyHeaderWhiteList : ['proxy-authorization'],
        headers: {
            "Proxy-Authorization"      : getAuthToProxy(proxyOpts),
            'Accept'                  : 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/*,*/*;q=0.8'
        	,'Accept-Charset'          : 'utf-8, iso-8859-1, utf-16, *;q=0.7'
        	,'Accept-Language'         : 'zh-CN, en-US'
        	,'x-Getzip'                : 'supported'
        	,'Cache-Control'           : 'no-cache'
            ,'user-agent'              : 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.2357.130 Safari/537.36'
        }
        , encoding: null
    }, function(err, res, body) {
        err = err || ( res.statusCode == 200 ? "" : res.statusCode );
        body = !body ? "" :iconv.decode(body, "gbk");
        if (err || !body
                || body.toString().indexOf('checkcodeImg') > -1
                || body.toString().indexOf('安全登录') > -1) {
            // if (tryTimes > 3) {
                // console.log(err || "");
                // console.log(body);
                // callback("重试超过三次", null);
            // } else {
            //    http重试
                // visitHttp(url, auth, proxyOpts, callback, tryTimes);
            // }
			console.log("error:" + err + ", body:" + body)
			callback("抓取失败", null);
        } else {
            callback(null, body);
        }
    });
}

/**
 * 判断店铺状态
 * @param  body 页面body
 * @return status (WARN:失败, CLOSED:关店, NOMAL:正常)
 */
function getShopStatus(body) {
    var status = '';
    if (!body) {
        status = 'WARN';
    } else if (body.toString().indexOf('没有找到相应的店铺信息') > -1 || body.toString().indexOf("您访问的店铺不存在") >= 0) {
        status = 'CLOSED';
    } else {
        status = 'NOMAL';
    }
    return status;
}
