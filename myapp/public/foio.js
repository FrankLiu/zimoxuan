(function() {
    /********************全局数据结构begin****************************/
    var foio = {};
    //用于
    var rmsAttr = /foio-(\w+)-?(.*)/;
    var openTag = '{{';
    var closeTag = '}}';
    foio.vmodels = [];
    //每个指令相关的操作
    var directives = {
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
                    elem.value = closetVmodel.binder[binding.expr].apply(binding);
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
            binding.element.nodeValue = closetVmodel.binder[binding.expr].apply(binding);
        },
    };
    /********************全局数据结构end****************************/


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

    /********************节点扫描相关函数begin****************************/
    foio.scan = function(elem, vmodel) {
        var elem = (elem || window.document.body);
        var vmodels = vmodel ? [].concat(vmodel) : [];
        scanTag(elem, vmodels);
    };

    function scanTag(elem, vmodels) {
        //首先扫描节点上的foio-controller属性
        var cnode = elem.getAttributeNode('foio-controller');
        //当节点有controller标记时
        if (cnode) {
            //防止后续属性扫描时被重复处理
            var newVmodel = foio.vmodels[cnode.value];
                //controller未定义
            if (!newVmodel) {
                return;
            }
            //形成controller的作用域链接，方便像父scope搜索变量
            vmodels = [newVmodel].concat(vmodels);
            elem.removeAttribute(cnode.name);
        }
        //扫描其他属性
        scanAttr(elem, vmodels);
    }

    function scanText(textNode, vmodels) {
        var bindings = [];
        var tokens = scanExpr(textNode.data);
        var docFragment = document.createDocumentFragment();
        if (tokens.length) {
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
            executeBindings(bindings, vmodels);
        }
    }


    function scanExpr(str) {
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
    }


    function scanAttr(elem, vmodels) {
        var bindings = [];
        var match = false;
        /*
            当vmodels.length为0时，表示还没有遍历到foio-controller节点，
            因此不需要扫描本节点的其他属性
        */
        if (vmodels.length) {
            var attributes = elem.getAttributes ? elem.getAttributes(elem) : elem.attributes;
            //遍历节点的属性
            for (var i = 0, attr; (attr = attributes[i++]);) {
                //如果已指定属性specified为true
                if (attr.specified) {
                    //获取指令,其中rmsAttr = /foio-(\w+)-?(.*)/
                    if ((match = attr.name.match(rmsAttr))) {
                        var type = match[1];
                        var param = match[2] || "";
                        var value = attr.value;
                        var name = attr.name;
                        //存在相关指令
                        if (directives[type]) {
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
            }

            //处理绑定
            if (bindings.length) {
                executeBindings(bindings, vmodels);
            }
        }
        scanChildNodes(elem, vmodels);
    }


    function scanChildNodes(parent, vmodels) {
        var nodes = Array.prototype.slice.call(parent.childNodes);
        for (var i = 0, node; (node = nodes[i++]);) {
            switch (node.nodeType) {
                case 1:
                    scanTag(node, vmodels);
                    break;
                case 3:
                    scanText(node, vmodels);
                    break;
            }
        }
    }


    function executeBindings(bindings, vmodels) {
        for (var i = 0, binding; (binding = bindings[i++]);) {
            binding.vmodels = vmodels;
            directives[binding.type](binding);
        };
    }

    /********************节点扫描相关函数end****************************/

    foio.controller = function(options) {
        var $id = options.$id;
        //id不能为空
        if (!$id) {
            throw Error('controller必须指定id');
        }
        //$id不能重复
        if (foio.vmodels[$id]) {
            throw Error('重复定义controller:' + $id);
        }
        var vmodel = modelFactory(options);
        return foio.vmodels[$id] = vmodel;
    };

    function modelFactory(options) {
        //要返回的对象
        var $vmodel = {};
        for (var name in options) {
            var value = options[name];
            //通过vmodle的binder，处理依赖注册
            if (!$vmodel['binder']) {
                $vmodel['binder'] = {};
            }
            //忽略特殊model
            if (name.charAt(0) !== "$") {
                var accessor = makeAccessor(name, value);
                $vmodel = Object.defineProperty($vmodel, name, accessor);
                $vmodel['binder'][name] = accessor.get;
            }
        }
        return $vmodel;
    }

    function makeAccessor(name, value) {
        //依赖数组
        var dependencyList = [];
        var oldVal = value;
        return {
            get: function() {
                if (this.element && !this.$active) {
                    dependencyList.push(this);
                    this.$active = true;
                }
                return value;
            },
            set: function(newVal) {
                if (oldVal === newVal) {
                    return;
                }
                oldVal = newVal;
                for (var dependIdx in dependencyList) {
                    if (dependencyList[dependIdx].$active) {
                        dependencyList[dependIdx].updateView(newVal);
                    }
                }
            },
            enumerable: true,
            configurable: true
        };
    }

    window.foio = foio;
})();

//DOM加载完成后开始扫描DOM
document.addEventListener("DOMContentLoaded", function(event) {
    foio.scan(window.document.body);
});
