var http = require('http');

var opt = {
 host:'192.168.5.4',
 port:'7777',
 method:'POST',//�����Ƿ��͵ķ���
 path:' https://www.taobao.com',     //�����Ƿ��ʵ�·��
 headers:{
  //������������ͳ�ȥ������ͷ
 }
};

//�����ǽ������ݵĴ���
var body = '';
var req = http.request(opt, function(res){
  console.log("Got response: " + res.statusCode);
  res
  .on('data',function(d){
	body += d;
	})
	.on('end', function(){
	  console.log(res.headers)
	  console.log(body)
	});

})
.on('error', function(e) {
  console.log("Got error: " + e.message);
});

req.end();
