var zookeeper  = require('node-zookeeper-client');

var client = zookeeper.createClient('192.168.7.7:2181');
var path = process.argv[2];

client.once('connnected', function(){
	console.log('connected to the server 192.168.7.7:2181');

	client.create(path, function(err){
		if(err){
		   console.log('failed to create node: %s due to: %s.', path, err);	
		} else { 
		   console.log('Node: %s is successfully created.', path);
		}
	
		client.close();
	});
});

client.connect();

