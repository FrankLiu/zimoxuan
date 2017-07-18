var cheerio = require('cheerio');
var _ = require('underscore');

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
		var matched = this.html.match(expr);
		if(matched) return matched;
		return [];
	},
	
	contains: function(word, casesensive){
		if(_.isEmpty(word)) return false;
		if(casesensive){
			return this.html.indexOf(word) >= 0;
		}
		return this.html.toLowerCase().indexOf(word.toLowerCase()) >= 0;
	},

	substr: function(start, end, casesensive){
		var str = this.html;
		if(!casesensive){
			str = this.html.toLowerCase();
			startStr = startStr.toLowerCase();
			endStr = endStr.toLowerCase();
		}
		var startPos = str.indexOf(startStr) + startStr.length;
		var endPos = str.indexOf(endStr);
		if(startPos >= 0 && endPos < str.length){
			return this.html.substring(startPos, endPos);
		}
		return "";
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


	