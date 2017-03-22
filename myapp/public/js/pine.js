/**
 * simple MVVM implementation
 * @dependencies: no
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() : 
	typeof define === 'function' && define.amd ? define(factory) : global.Pine = factory();
}(this, (function () { 'use strict';
	var Pine = {};
	Pine.VERSION = "1.0.0";
	Pine.DEBUG = false;

	var directiveAttr = /pine-(\w+)-?(.*)/;
	var openTag = '{{';
    var closeTag = '}}';
	
	var nativeForEach = Array.prototype.forEach,
		_slice = Array.prototype.slice;
		
	var NotImplementedError = Pine.NotImplementedError = function (message) {
		this.message = message || 'This operation is not implemented';
		Error.call(this);
	};
	NotImplementedError.prototype = Error.prototype;

	var NotSupportedError = Pine.NotSupportedError = function (message) {
		this.message = message || 'This operation is not supported';
		Error.call(this);
	};
	NotSupportedError.prototype = Error.prototype;
	
	Pine.helpers = {
		isFunction: function(o){
			return o && typeof o === 'function';
		},
		isNumber: function(o){
			return o && typeof o === 'number';
		},
		notImplemented: function () {
			throw new NotImplementedError();
		},
		notSupported: function () {
			throw new NotSupportedError();
		},
		generateUUID: function(prefix){
			prefix = prefix || 'pine';
			return prefix + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
		}
	};
	var isFunction = Pine.helpers.isFunction;
	var isNumber = Pine.helpers.isNumber;
	var notImplemented = Pine.helpers.notImplemented;
	var notSupported = Pine.helpers.notSupported;
	var generateUUID = Pine.helpers.generateUUID;
	
	
	function Observable(o){
		function each(obj, cb, context){
			if(obj === null) return;
			//如果支持本地forEach方法,并且是函数
			if(nativeForEach && obj.forEach === nativeForEach){
				obj.forEach(cb, context);
			}
			else{
				for(var i=0,l=obj.length; i<l; i++){
					cb.call(context, obj[i], i, obj);
				}
			}
		}
		
		function bind(evt, fn){
			var events = this.events = this.events || {},
				parts = evt.split(/\s+/),
				i = 0,
				num = parts.length,
				part;
			
			each(parts, function(part, index){
				events[part] = events[part] || [];
				events[part].push(fn);
			});
			return this;
		}
		
		function once(evt, fn){
			this.bind(evt, function fnc(){
				fn.apply(this, slice.call(arguments));
				this.unbind(evt, fn);
			});
			return this;
		}
		
		function unbind(evt, fn){
			var events = this.events,
				parts = evt.split(/\s+/),
				i = 0,
				num = parts.length,
				part;
				
			each(parts, function(part, index){
				if(part in events){
					events[part].splice(events[part].indexOf(fn), 1);
					if(!events[part].length){
						delete events[part];
					}
				}
			});
			return this;
		}
		
		function trigger(evt, fn){
			var events = this.events,
				i,
				args,
				flag;
			if(!events || evt in events === false) return;
			args = slice.call(arguments, 1);
			for(i=events[evt].length-1;i>=0;i--){
				flag = event[evt][i].apply(this, args);
			}
			return flag;
		}
		
		return Object.create(o, {
			subscribe: bind,
			once: once,
			unsubscribe: unbind,
			publish: trigger
		});
	}
	Pine.Observable = Observable;
	Pine.Observable.of = function(obj){
		return new Pine.Observable(obj);
	}
	
	Pine.vmodels = {};
	
	function getClosetVmodel(binding) {
        var vmodels = binding.vmodels;
        //搜索vmodels
        for (var i = binding.vmodels.length - 1; i >= 0; i--) {
            var vmodel = binding.vmodels[i];
            if (vmodel.hasOwnProperty(binding.expr)) {
                return vmodel;
            }
        }
    }
	var directives = Pine.directives = {
        //model指令相关操作
        model: function(binding) {
            var elem = binding.element;
            var closetVmodel = getClosetVmodel(binding);
            if (!binding.xtype) {
                binding.xtype = elem.tagName === "SELECT" ? "select" :
                    elem.type === "checkbox" ? "checkbox" :
                    elem.type === "radio" ? "radio" :
                    /^change/.test(elem.getAttribute("data-duplex-event")) ? "change" :
                    "input";
            }

            binding.bound = function(type, callback) {
                if (elem.addEventListener) {
                    elem.addEventListener(type, callback, false);
                } else {
                    elem.attachEvent("on" + type, callback);
                }
            };

            var updateVModel = function(e) {
                var val = elem.value;
                //搜索vmodels
                closetVmodel[binding.expr] = val;
            };

            switch (binding.xtype) {
                case "input":
                    binding.bound('input', updateVModel);
                    binding.bound('DOMAutoComplete', updateVModel);
                    elem.value = closetVmodel[binding.expr]//.apply(binding);
                    binding.updateView = function(newVal) {
                        elem.value = newVal;
                    };
                    break;
            }
        },

        //text指令相关操作
        text: function(binding) {
            binding.updateView = function(newVal) {
                    binding.element.nodeValue = newVal;
                };
                //初始化绑定
            var closetVmodel = getClosetVmodel(binding);
            binding.element.nodeValue = closetVmodel[binding.expr]//.apply(binding);
        },
    };
	var ViewModel = Pine.ViewModel = function ViewModel(name, options){
		this.$id = Pine.helpers.generateUUID();
		this.$el = options.el;
		this.data = options.data || {};
		this.methods = options.methods || {};
		var vmodels = this.generateVModel(this.data);
		Pine.vmodels[name] = vmodels;
		this.scan(this.$el, vmodels);
	}
	ViewModel.prototype = {
		generateVModel: function(scope){
			var originalModel = this.$originalModel = {},
				vmodel = this.$vmodel = {};
			var self = this;
			
			for(var k in scope){
				//缓存原始值
				var val = scope[k];
				originalModel[k] = val;
				
				//如果是函数，不用监控
				if(isFunction(val)){
					vmodel[k] = val;
				}
				else{
					//创建监控属性或数组，自变量，由用户触发其改变
					Object.defineProperty(vmodel, k, {
						enumerable   : true,
						configurable : true,
						get: function(){
							if(Pine.DEBUG){
								console.log('invoked accessor get[%s]: %s', k, val);
							}
							return val; 
						},
						set: function(newVal){
							if(Pine.DEBUG){
								console.log('invoked accessor set[%s]: %s -> %s', k, val, newVal);
							}
							if(newVal === val) return;
							val = newVal;
							self._notifySubscribers();
						}
					});
					
				}
			}
			return vmodel;
		},
		
		_notifySubscribers: function _notifySubscribers(){
			
		},
		
		//扫描root元素，绑定模型
		executeBindings: function(bindings, vmodels){
			for (var i = 0, binding; (binding = bindings[i++]);) {
				binding.vmodels = vmodels;
				Pine.directives[binding.type](binding);
			};
		},
		
		scan: function(elem, vmodels){
			var cnode = elem.getAttributeNode('pine-controller');
			if(cnode){
				var vmodel = Pine.vmodels[cnode.value];
				if(!vmodel){
					if(Pine.DEBUG){
						console.log('[warn]controller not defined: %s', cnode.value);
					}
					return;
				}
				//形成controller的作用域链接，方便像父scope搜索变量
				vmodels = [vmodel].concat(vmodels);
				elem.removeAttribute(cnode.name);
			}
			
			//扫描其他属性
			this.scanAttr(elem, vmodels);
		},
		
		scanAttr: function(elem, vmodels){
			var bindings = [];
			var attributes = elem.getAttributes ? elem.getAttributes(): elem.attributes;
			//遍历节点的属性
            for(var i = 0,attr; (attr = attributes[i++]);) {
				var matched = attr.name.match(directiveAttr);
				if(matched){
					var type = matched[1];
					var param = matched[2] || "";
					var value = attr.value;
					var name = attr.name;
					//存在相关指令
					if (Pine.directives[type]) {
						var binding = {
							type: type,
							param: param,
							element: elem,
							name: name,
							expr: value,
						};
						bindings.push(binding);
					}
				}
			}
			
			//处理绑定
            if (bindings.length) {
                this.executeBindings(bindings, vmodels);
            }
			
			this.scanChildNodes(elem, vmodels);
		},
		
		scanText: function(textNode, vmodels){
			var bindings = [];
			var tokens = this.scanExpr(textNode.data);
			var docFragment = document.createDocumentFragment();
			if(tokens.length){
				for (var i = 0, token; (token = tokens[i++]);) {
					var node = document.createTextNode(token.value);
					if (token.expr) {
						token.expr = token.value;
						token.type = 'text';
						token.element = node;
						bindings.push(token);
					}
					docFragment.appendChild(node);
				}
			}
			textNode.parentNode.replaceChild(docFragment, textNode);
			if (bindings.length) {
				this.executeBindings(bindings, vmodels);
			}
		},
		
		scanExpr: function(str) {
			var tokens = [],
				value, start = 0,
				stop;
			do {
				stop = str.indexOf(openTag, start);
				if (stop === -1) {
					break;
				}
				value = str.slice(start, stop);
				if (value) {
					tokens.push({
						value: value,
						expr: false
					});
				}
				start = stop + openTag.length;
				stop = str.indexOf(closeTag, start);
				if (stop === -1) {
					break;
				}
				value = str.slice(start, stop);
				if (value) {
					tokens.push({
						value: value,
						expr: true
					});
				}
				start = stop + closeTag.length;
			} while (1);

			value = str.slice(start);
			if (value) {
				tokens.push({
					value: value,
					expr: false
				});
			}
			return tokens;
		},
		
		scanChildNodes: function(elem, vmodels) {
			var nodes = _slice.call(elem.childNodes);
			for (var i = 0, node; (node = nodes[i++]);) {
				switch (node.nodeType) {
					case 1:
						this.scan(node, vmodels);
						break;
					case 3:
						this.scanText(node, vmodels);
						break;
				}
			}
		}
	};
	
	Pine.define = function(name, options){
		var vmodels = this.vmodels || {};
		var directives = this.directives || {};
		var vm = vmodels[name];
		if(vm){
			throw Error('重复定义vm:' + vm.$id);
		}
		vm = new ViewModel(name, options);
		return vm;
	}
	
	return Pine;
})));




