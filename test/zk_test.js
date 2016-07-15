var zookeeper = require('node-zookeeper-client');
 
var host = '192.168.7.7:2181';
var client = zookeeper.createClient(host);
var path = process.argv[2];

function createPath(path){
    client.create(path, function (error) {
        if (error) {
            console.log('Failed to create node: %s due to: %s.', path, error);
        } else {
            console.log('Node: %s is successfully created.', path);
        }
 
    });
}

function listChildren(path){
    client.getChildren(
        path,
        function (event) {
            console.log('Got watcher event: %s', event);
            listChildren(client, path);
        },
        function (error, children, stat) {
            if (error) {
                console.log(
                    'Failed to list children of %s due to: %s.',
                    path,
                    error
                );
                return;
            }
 
            console.log('Children of %s are: %j.', path, children);
        }
    );
}

function getData(path){
	client.getData(
		path,
		function (event) {
			console.log('Got event: %s.', event);
		},
		function (error, data, stat) {
			if (error) {
				console.log(error.stack);
				return;
			}
	 
			console.log('Got data: %s', data.toString('utf8'));
		}
	);
}

function setData(path, data, callback){
	client.setData(path, data, -1, function (error, stat) {
		if (error) {
			console.log(error.stack);
			return;
		}
	 
		console.log('Data is set.');
		
		callback && callback();
	});
}

client.once('connected', function () {
    console.log('Connected to the zookeeper server: %s', host);
 
    //createPath(path);
	var data = new Buffer('data:bar');
	setData(path, data, function(){
		listChildren(path);
		getData(path);
	});
    
});
 
client.connect();