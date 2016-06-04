var fs = require('fs');
var tough = require('tough-cookie'),
	Cookie = tough.Cookie,
	CookieJar = tough.CookieJar;
var _ = require('underscore');
var async = require('async');
var iconv = require('iconv-lite');

var HttpClient = require('./http_client');
var HtmlParser = require('./parser');

var URL_TAOBAO_LOGIN = "https://login.taobao.com/member/login.jhtml"
	, URL_REQUEST_NICK_CHECK = "https://login.taobao.com/member/request_nick_check.do?_input_charset=utf-8"
	, URL_UUCODE = "http://dg.test.yuanbaopu.com/uucode";

var url = 'https://login.taobao.com/member/login.jhtml?from=sycm&full_redirect=true&style=minisimple&minititle=&minipara=0,0,0&sub=true&redirect_url=http://sycm.taobao.com/index.htm';
var httpClient = new HttpClient({keepCookies: true});

//判断是否需要验证码
function isNickRequiredCheck(username, callback){
	var options = {
		encoding: 'utf8',
		form: {
			username: username
		}
	};
	httpClient.post(URL_REQUEST_NICK_CHECK, options, function(err, resp){
		if(err) return callback(err);
		console.log(options);
		//console.log(resp);
		var ret = JSON.parse(resp.content);
		console.log(ret);
		callback(err, ret);
	});
}

//调用uucode打码
function uucode(ret, callback){
	if(!ret['needcode']){
		console.log('The nick need not code!');
		callback(null, {status: false});
	}
	else{
		var options = {
			form: {
				imgCodeUrl: encodeURIComponent(ret.url)
			}
		};
		httpClient.get(URL_UUCODE, options, function(err, resp){
			if(err) return callback(err);
			var ret = JSON.parse(resp.content);
			console.log(ret);
			callback(err, ret);
		});
	}
}


function encodeURIComponent_GBK(str){
	if(str==null || typeof(str)=='undefined' || str=='') 
		return '';

	var a = str.toString().split('');

	for(var i=0; i<a.length; i++) {
	var ai = a[i];
	if( (ai>='0' && ai<='9') || (ai>='A' && ai<='Z') || (ai>='a' && ai<='z') || ai==='.' || ai==='-' || ai==='_') continue;
	var b = iconv.encode(ai, 'gbk');
	var e = [''];
	for(var j = 0; j<b.length; j++) 
		e.push( b.toString('hex', j, j+1).toUpperCase() );
		a[i] = e.join('%');
	}
	return a.join('');
}
	
//为登录表单填入预设值
function enhanceFormData(form, username, password){
	_.extend(form, {
		"TPL_username": username
		, "TPL_password": ""
		, "TPL_password_2": (password.length > 100 ? password : /*encrypt*/password)
		, loginASRSuc: "1"
		, oslanguage: "zh-CN"
		, sr: "1920*1080"
		, osVer: "windows|6.1"
		, naviVer: "chrome|44.02403157" 
		, umto: NaN
		, gvfdcname: 10
		// , ua: ua
	});
	delete form['J_UnitClose '];
	delete form['J_PBK'];
	if(!form['TPL_checkcode']) delete form['TPL_checkcode'];
	
	for(key in form){
		if(key === 'TPL_username'){
			form[key] = encodeURIComponent_GBK(form[key]);
		}
		else{
			form[key] = encodeURIComponent(form[key]);
		}
	}
	return form;
}

//登录表单页面
function loginEntry(ret, callback){
	var options = {};
	var imgCode = (ret.status ? ret.imgCode : '');
	httpClient.get(URL_TAOBAO_LOGIN, options, function(err, resp){
		if(err) console.log(err);
		console.log(resp.cookies);
		console.log("=====================body===================");
		//console.log(resp.content);
		var parser = HtmlParser.load(resp.content);
		var formData = parser.formData('#J_StaticForm');
		formData['TPL_checkcode'] = imgCode;
		//console.log(formData);
		callback(null, formData);
	});
}


var loginHome = async.compose(loginEntry, uucode, isNickRequiredCheck);

//登录
function login(username, password, callback){
	loginHome(username, function(err, formData){
		options = {
			form: enhanceFormData(formData, username, password)
		};
		httpClient.post(URL_TAOBAO_LOGIN, options, function(err, resp){
			if(err) console.log(err);
			callback(null, resp);
		}).pipe(fs.createWriteStream('./login.html'));
	});
}

//expose function
module.exports = exports = login;

