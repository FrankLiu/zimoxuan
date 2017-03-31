function Observable(o){
  function each(obj, cb, context){
    if(obj === null) return;
    //如果支持本地forEach方法,并且是函数
    if(nativeForEach && obj.forEach === nativeForEach){
      obj.forEach(cb, context);
    }
    else{
      for(var i=0,l=obj.length; i<l; i++){
        cb.call(context, obj[i], i, obj);
      }
    }
  }

  function bind(evt, fn){
    var events = this.events = this.events || {},
      parts = evt.split(/\s+/),
      i = 0,
      num = parts.length,
      part;

    each(parts, function(part, index){
      events[part] = events[part] || [];
      events[part].push(fn);
    });
    return this;
  }

  function once(evt, fn){
    this.bind(evt, function fnc(){
      fn.apply(this, slice.call(arguments));
      this.unbind(evt, fn);
    });
    return this;
  }

  function unbind(evt, fn){
    var events = this.events,
      parts = evt.split(/\s+/),
      i = 0,
      num = parts.length,
      part;

    each(parts, function(part, index){
      if(part in events){
        events[part].splice(events[part].indexOf(fn), 1);
        if(!events[part].length){
          delete events[part];
        }
      }
    });
    return this;
  }

  function trigger(evt, fn){
    var events = this.events,
      i,
      args,
      flag;
    if(!events || evt in events === false) return;
    args = slice.call(arguments, 1);
    for(i=events[evt].length-1;i>=0;i--){
      flag = event[evt][i].apply(this, args);
    }
    return flag;
  }

  return Object.create(o, {
    subscribe: bind,
    once: once,
    unsubscribe: unbind,
    publish: trigger
  });
}
