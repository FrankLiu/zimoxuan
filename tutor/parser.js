var cheerio = require('cheerio');

function HtmlParser(html){
	this.html = html;
	this.$ = cheerio.load(html);
}

HtmlParser.load = function(html){
	return new HtmlParser(html);
}

HtmlParser.prototype = {
	xpath: function(selector){
		return this.$(selector);
	},
	
	regexp: function(expr){
		return this.html.search(expr);
	},
	
	//获取form表单数据
	formData: function(formId){
		var ret = {};
		var $ = this.$;
		this.xpath(formId).find("input[type=hidden]").each(function(i, elem){
			key = $(elem).attr("name") || $(elem).attr("id");
			if(key){
				ret[key] = $(elem).val() || "";
			}
		});
		return ret;
	}
}

module.exports = exports = HtmlParser;


	