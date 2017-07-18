var util = require('util');
var EventEmitter = require('events').EventEmitter;
var _ = require('underscore');
var log4js = require('log4js');
var request = require('request');
var iconv = require('iconv-lite');
var tough = require('tough-cookie'),
	Cookie = tough.Cookie,
	CookieJar = tough.CookieJar;

//turn on request debug by set it true
request.debug = false;
var DEFAULT_USER_AGENTS = [
	'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.2357.65 Safari/537.36',
	'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.153 Safari/537.36 SE 2.X MetaSr 1.0',
	'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:36.0) Gecko/20100101 Firefox/36.0',
	'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.1; WOW64; Trident/7.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; .NET4.0C; .NET4.0E)'
];
var DEFAULT_HEADERS =  {
	'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
	,'Accept-Charset' : 'utf-8, iso-8859-1, utf-16, *;q=0.7'
	,'Accept-Language': 'zh-CN, en-US'
	,'x-Getzip'       : 'supported'
	,'Cache-Control'  : 'no-cache'
	,'Connection'     : 'keep-alive'
	//自动切换user-agent,用于淘宝反侦测
	,'User-Agent'     : DEFAULT_USER_AGENTS[Math.floor(Math.random() * DEFAULT_USER_AGENTS.length)]
};
var DEFAULT_TIMEOUT = 60*1000 ;
var DEFAULT_OPTIONS = {
	headers: DEFAULT_HEADERS,
	timeout: DEFAULT_TIMEOUT,
	followRedirect : true ,
	followAllRedirects: true,
	encoding: null,
	jar: request.jar()
};
var DEFAULT_OPTS = {
	autoDecode: true,
	keepCookies: true,
	autoParseData: true
};

function HttpClient(opts){
	EventEmitter.call(this);
	this.opts = _.extend({}, DEFAULT_OPTS, opts);
	this.logger = log4js.getLogger('http');
}
util.inherits(HttpClient, EventEmitter);

Object.defineProperty(HttpClient.prototype, 'cookies', {
	get: function(){
		return this.cookies;
	},
	set: function(c){
		this.cookies = c;
	}
});

HttpClient.prototype = {
	_call: function(method, url, options, callback){
		options = _.extend({}, DEFAULT_OPTIONS, options);
		if(!options.cookies && this.opts.keepCookies && this.cookies){
			this.logger.info('reuse previous cookies store in instance');
			options.cookies = this.cookies;
		}
		//add convenience path for add cookies
		if(options.cookies){
			//TODO: serialize/deserialize cookies
			this.logger.info('deserialize previous cookies...');
			for(var cookie in options.cookies){
				options.jar.setCookie(cookie);
			}
			delete options.cookies;
		}
		
		var self = this;
		options.method = method;
		if(options.encoding === 'binary') options.encoding = null;
		options.encoding = options.encoding || null; //encoding the body as expect or binary
		callback = _.once(callback);
		this.logger.info('%s %s', method, url);
		this.logger.debug('request options: ', options);
		return request(url, options, function(err, resp, body){
			if(err) return callback(err);
			self.logger.info("response status code: %s", resp.statusCode);
			self.logger.info("response headers: ", resp.headers);
			
			var contentType = (resp.headers['content-type'] || ';').split(';');
			//decode body
			if(!options.encoding && self.opts.autoDecode){
				var content = "";
				if(contentType[1] && contentType[1].indexOf('charset') > -1){
					var encoding =  encoding || contentType[1].trim().substr(8, 5) || 'utf8';
					self.logger.info('response content encoding: %s', encoding);
					content = iconv.decode(body, encoding);
				}
				resp.content = content;
			}
			else{
				resp.content = body;
			}
			
			//parse json/js data
			if(self.opts.autoParseData){
				var data = null;
				if(_.include(['application/json', 'text/javascript'], contentType[0].trim())) {
					try {
						self.logger.info('parse js/json content...');						
						data = JSON.parse(content);
					} catch (err) {}
				}
				resp.data = data;
			}
			
			resp.cookies = options.jar.getCookies();
			if(self.opts.keepCookies){
				self.logger.info('keep cookies in instance...');
				self.cookies = resp.cookies;
			}
			
			//return the result by callback
			callback(err, resp);
		});
	},

	//get请求
	get: function(url, options, callback){
		var elems = [];
		_.each(options.form, function(v, k){
			elems.push(k + '=' + v);
		});
		url += '?' + elems.join('&');
		return this._call('GET', url, options, callback);
	},

	//post请求
	post: function(url, options, callback){
		return this._call('POST', url, options, callback);
	},

	//put请求
	put: function(url, options, callback){
		return this._call('PUT', url, options, callback);
	},

	head: function(url, options, callback){
		return this._call('HEAD', url, options, callback);
	}
};

module.exports = exports = HttpClient;
