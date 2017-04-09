var cp = require('child_process');
var path = require('path');

var worker;

function spawn(server, config){
  worker = cp.spawn('node', [server, config]);
  worker.on('exit', function(code){
    if(code !== 0){
      spawn(server, config);
    }
  })
  worker.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });

  worker.stderr.on('data', (data) => {
    console.log(`stderr: ${data}`);
  });

  worker.on('close', (code) => {
    console.log(`子进程退出码：${code}`);
  });
}

function main(argv){
  spawn(__dirname + '/lib/index.js', argv[0]);
  process.on('SIGTERM', function(err){
    worker.kill();
    process.exit(0);
  })
}

main(process.argv.slice(2));
