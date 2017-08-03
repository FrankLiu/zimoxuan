/**
 * incorrect function
 */
function getData(){
  var data = [];
  for(var i=0; i<3; i++){
    data[i] = function(){
      return i;
    }
  }
  return data;
}

/**
 * correct function
 */
function getData2(){
  var data = [];
  for(var i=0; i<3; i++){
    data[i] = function(i){
      return function(){return i;}
    }(i);
  }

  return data;
}

var data = getData2();
for(var i=0; i<data.length; i++){
  console.log(data[i]());
}
