/**
 * 基于jQuery实现双向绑定
 * @refer http://www.html-js.com/article/Study-of-twoway-data-binding-JavaScript-talk-about-JavaScript-every-day
 */
var DataBinder = {};
if(typeof jQuery === 'function'){
	DataBinder = DataBinder_withJQuery;
} else {
	DataBinder = DataBinder_withNative;
}
	
function DataBinder_withJQuery(object_id){
		//使用一个jQuery对象作为简单的订阅者发布者
		var pubSub = jQuery({});
		
		//我们希望一个data元素可以在表单中指明绑定：data-bind-<object_id>="<property_name>"  
		var data_attr = "data-bind-"+object_id,
				message = object_id + ":change";
		
		//使用data-binding属性和代理来监听那个元素上的变化事件
		// 以便变化能够“广播”到所有的关联对象   
		jQuery(document).on("change", "["+data_attr+"]", function(evt){
			var $input = jQuery(this);
			pubSub.trigger(message, [$input.attr(data_attr), $input.val()]);
		});
		
		//PubSub将变化传播到所有的绑定元素，设置input标签的值或者其他标签的HTML内容   
		pubSub.on(message, function(evt, prop_name, new_val){
			jQuery('['+data_attr+'='+prop_name+']').each(function(){
				var $bound = jQuery(this);
				
				if($bound.is("input, textarea, select")){
					$bound.val(new_val);
				} else {
					$bound.html(new_val);
				}
			});
		});
		
		//align to native implement
		pubSub.subscribe = pubSub.on;
		pubSub.publish = function(){
			if(arguments.length < 1) return;
			var args = [].slice.call(arguments,1);
			pubSub.trigger(arguments[0], args);
		};
		
		return pubSub;
	}

	/**
	 * 基于原生实现双向绑定
	 * @refer http://www.html-js.com/article/Study-of-twoway-data-binding-JavaScript-talk-about-JavaScript-every-day
	 */
	function DataBinder_withNative(object_id){
		//创建一个简单地PubSub对象   
		var pubSub = {
			subscribers: {},
			subscribe: function(msg, subscriber){
				this.subscribers[msg] = this.subscribers[msg] || [];
				this.subscribers[msg].push(subscriber);
			},
			publish: function(msg){
				this.subscribers[msg] = this.subscribers[msg] || [];
				for(var i=0,len=this.subscribers[msg].length;i<len;i++){
					this.subscribers[msg][i].apply(this, arguments);
				}
			}
		},
		
		data_attr = 'data-bind-'+object_id,
		message = object_id+ ':change',
		changeHanlder = function(evt){
			var elem = evt.target || evt.srcElement,
					prop_name = elem.getAttribute(data_attr);
			
			if(prop_name && prop_name !== ''){
				pubSub.publish(message, prop_name, elem.value);
			}
		};
		
		//监听变化事件并代理到PubSub 
		if(document.addEventListener){
			document.addEventListener('change', changeHanlder, false);
		} else {
			document.attachEvent('onchange', changeHanlder);
		}
		
		//PubSub将变化传播到所有绑定元素 
		pubSub.subscribe(message, function(evt, prop_name, new_val){
			var elems = document.querySelectorAll('['+data_attr+'='+prop_name+']'),
					tag_name;
			
			for(var i=0,len=elems.length;i<len;i++){
				tag_name = elems[i].tagName.toLowerCase();
				if(tag_name === 'input' || tag_name === 'textarea' || tag_name === 'select'){
					elems[i].value = new_val;
				} else {
					elems[i].innerHTML = new_val;
				}
			}
		})
		
		return pubSub;
	}