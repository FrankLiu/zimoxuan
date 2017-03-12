/**
 * MVVM implementation
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) : global.Pine = factory();
}(this, (function () { 'use strict';
	var Pine = {};

	Pine.VERSION = "1.0.0";

	var previousPine = global.Pine;
	Pine.noConflict = function() {
		global.Pine = previousPine;
		return this;
	};

	var nativeForEach = Array.prototype.forEach,
		_slice = Array.prototype.slice;

	var NotImplementedError = Rx.NotImplementedError = function (message) {
		this.message = message || 'This operation is not implemented';
		Error.call(this);
	};
	NotImplementedError.prototype = Error.prototype;

	var NotSupportedError = Pine.NotSupportedError = function (message) {
		this.message = message || 'This operation is not supported';
		Error.call(this);
	};
	NotSupportedError.prototype = Error.prototype;

	var notImplemented = Pine.helpers.notImplemented = function () {
		throw new NotImplementedError();
	};

	var notSupported = Pine.helpers.notSupported = function () {
		throw new NotSupportedError();
	};

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

  var Model = Pine.Model = function Model(o){
    if(o instanceof Model) return o;
    o = Pine.Observable(o);
  }
  
	var ViewModel = Pine.ViewModel = function ViewModel(name, options){
		this.name = name;
		this.id = 'vm-'+Math.random()+'-'+Math.random();
		this.$el = options.el;
		this.data = options.data || {};
		this.methods = options.methods || {};
	}

  var View = Pine.View = function View(opts){
    opts = opts || {};
    this.$el = opts.el;
  }
  View.prototype.scan = function(){

  }
  View.prototype.render = function(){

  }

	Pine.define = function(name, options){
		return new ViewModel(name, options);
	}

	return Pine;
})));
