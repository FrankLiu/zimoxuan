## Node.js是什么？

Node.js不是一个应用，也不是一个框架，而是一个运行平台，提供javascript语言的运行环境，类似于JRE提供java的运行环境，底层实现同样采用C++，同样采用内存回收机制（垃圾回收）来管理内存。

Node.js的解析器采用Google Chrome浏览器的v8引擎，性能很好。相比较浏览器端的javascript受到的各种安全性限制，Node.js是一个全面的后台运行环境，提供了很多突破安全限制的系统API，比如文件操作，网络编程等，也就是说传统java能够在后端实现的功能，Node.js同样可以实现。


## Node.js的特点

利用操作系统对异步的支持，libuv平台屏蔽了操作系统间事件轮询的差异性。

##### 异步IO
典型的客户端ajax请求
```javascript
$.post('/api/ajax_call', function(data){
  console.log('收到响应数据： ' + data);
});
console.log('发送ajax请求结束, 等待响应...');
```

文件IO操作
```javascript
var fs = require('fs');

fs.readFile('/filepath', function(err, file){
  console.log('文件读取完成');
});
console.log('读取文件中...');
```

##### 事件和回调
```javascript
var http = require('http');
var url = require('url');

http.createServer(function(req, res){
  var pathname = url.parse(req.url).pathname;
  console.log("Request path: %s", pathname);

  req.setEncoding('utf8');
  var postData = "";
  req.on('data', function(chunked){
    postData += chunked;
    console.log('received post data: %s', chunked);
  });
  req.on('end', function(){
    res.end(postData);
  });
}).listen(8080);

console.log('服务器启动并监听在端口: 8080');
```

客户端的事件写法同理：
```javascript
$.ajax({
  url: '/api/ajax/',
  method: 'post',
  data: {},
  success: function(data){
    //success事件
  },
  error: function(err){
    //error事件
  }
});
```

##### 单线程
Node.js保持了Javascript单线程的特点，不用担心状态同步问题，也不用担心死锁问题，也没有了多线程编程时上下文切换过程的性能开销，极大的简化了编程的复杂度。

但是单线程也有弱点：
- 无法利用多核CPU
- 程序出错可能导致整个应用程序退出，应用的健壮性很受考验
- 如果有大量计算的话，导致CPU假死

解决方案：多进程，child_process包

##### 跨平台
基于libuv平台抽象并统一事件轮询机制，使得windows和类unix系统可以兼容

## Node.js应用场景
- 网站（如express/koa等）
- im即时聊天(socket.io)
- api（移动端，pc，h5）
- HTTP Proxy（淘宝、Qunar、腾讯、百度都有）
- 前端构建工具(grunt/gulp/bower/webpack/fis3…)
- 写操作系统（NodeOS）
- 跨平台打包工具（PC端的electron、nw.js，比如钉钉PC客户端、微信小程序IDE、微信客户端，移动的cordova，即老的Phonegap，还有更加有名的一站式开发框架ionicframework）
- 命令行工具（比如cordova、shell.js）
- 反向代理（比如anyproxy，node-http-proxy）
- 编辑器Atom、VSCode等

想了解Node.js能做什么，可以参考awesome-nodejs项目

## 安装
从官网中下载安装包 https://nodejs.org

偶数是长期维护版，比如4.x，6.x，8.x
奇数是新功能试验版，不建议产品环境使用

安装好之后，打开命令行终端查看版本信息
```javascript
node -v
npm -v
```
建议安装全局npm包：node-gyp

建议安装依赖环境：python2.7， vistual studio2015，主要用于编译C++写的扩展包

## 实例
几行代码完成简单的http服务器：hello.js

重构，加入可扩展性: app.js

## 常用的框架

框架名称 | 特性 | 点评
-- | -- | --
Express	| 简单、实用，路由中间件等五脏俱全 | 最著名的Web框架
Derby.js && Meteor | 同构	| 前后端都放到一起，模糊了开发便捷，看上去更简单，实际上上对开发来说要求更高
Sails、Total	| 面向其他语言，Ruby、PHP等	| 借鉴业界优秀实现，也是Node.js成熟的一个标志
MEAN.js	| 面向架构	| 类似于脚手架，又期望同构，结果只是蹭了热点
Hapi和Restfy |	面向Api && 微服务	| 移动互联网时代Api的作用被放大，故而独立分类。尤其是对于微服务开发更是利器
ThinkJS	| 面向新特性	| 借鉴ThinkPHP，并慢慢走出自己的一条路，对于Async函数等新特性支持，无出其右
Koa	| 专注于异步流程改进	| 下一代Web框架
