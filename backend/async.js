var items = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16];
var results = [];
var running = 0;
var limit = 5;

function async(args, callback){
  console.log('参数为 ' + args +' , 1秒后返回结果');
  setTimeout(function(){callback(args*2)}, 1000);
}

function final(values){
  console.log('完成: ', values);
}

function launcher(){
  while(running < limit && items.length > 0){
    var item = items.shift();
    async(item, function(result){
      results.push(result);
      running--;
      if(items.length > 0){
        launcher();
      } else if(running === 0){
        final(results);
      }
    })
    running++;
  }
}

launcher();
