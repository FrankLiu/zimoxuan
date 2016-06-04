'use strict'

var fs = require('fs');
var net = require('net');


var client = net.connect({host: '115.159.195.69', port: 21}, () => {
  // 'connect' listener
  console.log('connected to ftp server!');
  client.setTimeout(0);
  client.setKeepAlive(true);
  client.write('USER admin\r\n');
  client.write('PASS Asto123456\r\n');
  client.write('MDTM /databox/databox.tgz\r\n');
});
client.on('data', (data) => {
  // console.log(data.toString());
  if(data.toString().indexOf('213 2016') >= 0){
	console.log('databox.tgz is modified, the lastest modified time is ', data.toString().split(' ')[1]);
	client.end();  
  }
});
client.on('end', () => {
  console.log('disconnected from ftp server');
});