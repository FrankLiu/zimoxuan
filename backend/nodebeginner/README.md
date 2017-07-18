## Node.js是什么？

Node.js不是一个应用，也不是一个框架，而是一个运行平台，提供javascript语言的运行环境，类似于JRE提供java的运行环境，底层实现同样采用C++，同样采用内存回收机制（垃圾回收）来管理内存。

Node.js的解析器采用Google Chrome浏览器的v8引擎，性能很好。相比较浏览器端的javascript受到的各种安全性限制，Node.js是一个全面的后台运行环境，提供了很多突破安全限制的系统API，比如文件操作，网络编程等，也就是说传统java能够在后端实现的功能，Node.js同样可以实现。


## Node.js的特点

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
IO密集型应用： web网站(express|koa|...)，数据库访问，数据库中间件（MyFOX）, 代理(anyproxy)，网关，高性能网络通信组件(pomelo)等

是不是有CPU计算的场景就不能用，其实市面上真正纯CPU计算的软件是没有的，都是依托CPU+IO+Memory协作来完成任务的，大部分情况下Node.js的性能表现都足够好。

想了解Node.js能做什么，可以参考awesome-nodejs项目

## 实例
