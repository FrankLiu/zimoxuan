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
	, URL_UUCODE = "http://192.168.4.158:3000/uucode";

var url = 'https://login.taobao.com/member/login.jhtml?from=sycm&full_redirect=true&style=minisimple&minititle=&minipara=0,0,0&sub=true&redirect_url=http://sycm.taobao.com/index.htm';

var ua = '018UW5TcyMNYQwiAiwQRHhBfEF8QXtHcklnMWc=|Um5OcktySXRKc0lwSndNciQ=|U2xMHDJ7G2AHYg8hAS8WLQMjDVEwVjpdI1l3IXc=|VGhXd1llXGVeY11kXmddYF1gV2pIc0x5RH5KdE1zT3BMdUF0QW85|VWldfS0QMAsyCCgTMx1wWWRbY1xyJHI=|VmNDbUMV|V2NDbUMV|WGRYeCgGZhtmH2VScVI2UT5fORtmD2gCawwuRSJHZAFsCWMOdVYyVTpbPR99HWAFYU9vQW85bw==|WWdHFyoKNxcrFSwYOA05ASEdIxgjAzkCNxcrFS4VNQ8wBVMF|WmZbe1UFOw4wDS16VGhRaFBuUG1QaldsVW0YJQc6BzoBOQY4BDwEPwI4BzIMMAw0Y01tUQcpfw==|W2dZeSkHWzpcMFcpU39Fa0tlOXo+Ei4aOgcnGjoFOgEveS8=|XGdHFzkXNwsxESwMMw40D1kP|XWZGFjgWNgoxES0NMg42D1kP|XmVFFTsVNQ8xESkJNgg3DFoM|X2ZGFjh4LHQJYB18F1s8RyIMLBggGDgGOgEhGicdIXch|QHhYCCZ5ImQwSSBaIF45Qi56RmhIGCwXKQk3CjZgQH1dc119Rn9CdyF3|QXtbCyV6IWczSiNZI106QS15RWtLd1dsVWpUAlQ=|QnpaCiRkMGgUfht6B18iSzZXPBIyYlZoUnJMeUEXNwoqBCoKPwQ+AVcB|Q3lZCSd4I2UxSCFbIV84Qy97R2lJdFRhWmBYDlg=|RH5eDiBgNGwQeh9+A1smTzJTOBY2CiofJB4qfCo=|RXxBfFxhQX5eYltnR3lBe1tjV3dNdVVpVWxMcFBkWHhEfEhoV29PcElpVmhId1drVnZIdlZjQ31BYV9iNA==';
var userName = "占城相送:u4";
var password2 = "8c2ea3bec0c25fa14c23e94c6334e7082e9e36ec1e7719da07c19851298a98b678d59b74faf51ac8aeccab30e702e043eea6567ebebb7f81f8e14015726ad15893023ca35027c5307748c0122bb93f9ae0aea63b7082f870c3e25de3a97c351304dfa36afb5df969f3efebdbeb8d8b1755ae395cebcae0be5060dc9fd665620b";
	
var httpClient = new HttpClient({keepCookies: false});

//判断是否需要验证码
function isNickRequiredCheck(nickName, callback){
	var options = {
		form: {
			username: nickName
		}
	};
	httpClient.post(URL_REQUEST_NICK_CHECK, options, function(err, resp){
		if(err) console.log(err);
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
				imgUrl: encodeURIComponent(ret.url)
			}
		};
		httpClient.get(URL_UUCODE, options, function(err, resp){
			if(err) console.log(err);
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
function enhanceFormData(form, imgCode){
	_.extend(form, {
			"TPL_username": userName
			, "TPL_password": ""
			, "TPL_checkcode": imgCode
			, "TPL_password_2": password2
			, loginASRSuc: "1"
			, oslanguage: "zh-CN"
			, sr: "1920*1080"
			, osVer: "windows|6.1"
			, naviVer: "chrome|44.02403157" 
			, umto: NaN
			, gvfdcname: 10
			, ua: ua
		});
		delete form['J_UnitClose '];
		delete form['J_PBK'];
		if(!imgCode) delete form['TPL_checkcode'];
		
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
		console.log('-----------------------------');
		console.log(CookieJar.deserializeSync(resp.cookies));
		console.log("=====================body===================");
		//console.log(resp.content);
		var parser = HtmlParser.load(resp.content);
		var formData = parser.formData('#J_StaticForm');
		//console.log(formData);
		formData = enhanceFormData(formData, imgCode);
		//console.log(formData);
		callback(null, formData);
	});
}

	
//登录
function login(formData, callback){
	
	var options = {
		form: formData
	};
	httpClient.post(URL_TAOBAO_LOGIN, options, function(err, resp){
		if(err) console.log(err);
		console.log(resp.cookies);
		console.log('-----------------------------');
		console.log(CookieJar.deserializeSync(resp.cookies));
		console.log("=====================body===================");
		console.log(resp.content);
		callback(null, resp.content);
	});
}

//main
var loginProcess = async.compose(login, loginEntry, uucode, isNickRequiredCheck);
loginProcess(userName, function(err, result){
	if(err) console.log(err);
	//console.log(result);
	//console.log('')
});
