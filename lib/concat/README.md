

# concat 

​	concat (coll, iteratee, callback(err))

整体上假如是同步函数 使用后会按着顺序调用 都调用完后才会调用callback 假如里面有异步 则让异步成功后再调用_eachOfLimit上的iterateeCallback来判断是否全部完成 最后再调用最初的callback 所以会看到异步会快过最初的callback

以此为例
```javascript
async.concat(['dir1','dir2','dir3'], fs.readdir, function(err, files) {

});
```


1.concat函数是由```doLimit(concatLimit, Infinity);```组成

2.doLimit函数是这样组成

```javascript
function doLimit(fn, limit) {

  return function (iterable, iteratee, callback) {

      return fn(iterable, limit, iteratee, callback);

  };

}
```

​	它的功能是调用`concatLimit`函数并将刚开始的三个参数和并发次数参数`Infinity`传入concatLimit中

3.concatLimit函数是由这样组成

```javascript
function(coll, limit, iteratee, callback) {

  callback = callback || noop;

  var _iteratee = wrapAsync(iteratee);

  mapLimit(coll, limit, function(val, callback) {

      _iteratee(val, function(err /, ...args/) {

          if (err) return callback(err);

          return callback(null, slice(arguments, 1));

      });

  }, function(err, mapResults) {

      var result = [];

      for (var i = 0; i < mapResults.length; i++) {

          if (mapResults[i]) {

              result = _concat.apply(result, mapResults[i]);

          }

      }

      return callback(err, result);

  });

}
```

​	*1. noop 是lodash的方法 只返回一个undefined

​	*2.  wrapAsync是一个封装方法 代码如下 判断是否是AsyncFunction 这个值是async/await 或者promise 的方法才有

```javascript
import asyncify from '../asyncify';

var supportsSymbol = typeof Symbol === 'function';

function isAsync(fn) {
    return supportsSymbol && fn[Symbol.toStringTag] === 'AsyncFunction';
}

function wrapAsync(asyncFn) {
    return isAsync(asyncFn) ? asyncify(asyncFn) : asyncFn;
}

export default wrapAsync;

export { isAsync };
```

​	asyncify函数的组成

```javascript
export default function asyncify(func) {
  	
  	//initialParam的组成
  	//function 1(fn) {
  	// return function 2(/*...args, callback*/) {
      		//var args = slice(arguments);
      		//var callback = args.pop();
      		//fn.call(this, args, callback);
  		//};
	//}
	//这里其实是一个转换 在外层拿到的时候是func2 然后外层func2的调用时会有参数然后这些参数和回调会传给下面test函数并调用 func就是当初的fs.readdir 再把那些参数传给func 假如是promise的话就会等裁决(then方法)再把等到的裁决值(无论resolve还是rejected)传给本身func的callback
  	
    return initialParams(function test(args, callback) {
        var result;
        try {
            result = func.apply(this, args);
        } catch (e) {
            return callback(e);
        }
        // if result is Promise object
        if (isObject(result) && typeof result.then === 'function') {
            result.then(function(value) {
                invokeCallback(callback, null, value);
            }, function(err) {
                invokeCallback(callback, err.message ? err : new Error(err));
            });
        } else {
            callback(null, result);
        }
    });
}

function invokeCallback(callback, error, value) {
    try {
        callback(error, value);
    } catch (e) {
        setImmediate(rethrow, e);
    }
}

function rethrow(error) {
    throw error;
}
```

​		*3. mapLimit函数是由`doParallelLimit(map)`组成

```javascript
function doParallelLimit(fn) {
    return function (obj, limit, iteratee, callback) {
        return fn(eachOfLimit(limit), obj, wrapAsync(iteratee), callback);
    };
}
```

跟`doLimit`函数的功能一样 调用`map`函数并将外层的参数和回调传给map方法 但这样不同的是  eachOfLimit调用后是一个方法 代码下图一 itertee已经是下图二 callback是下图三

图一:

```javascript
function _eachOfLimit(limit) {
  //在map函数的eachfn参数就是下面的函数 作用就是循环遍历文件数组 然后在map上会有执行读取文件夹方法的调用
  return function (obj, iteratee, callback) {
      callback = once(callback || noop);
      if (limit <= 0 || !obj) {
          return callback(null); //并发次数为空或者不是数组 则直接调用最初三个参数中的callback
      }
      var nextElem = iterator(obj); //一个会一步步遍历获取数组的值的方法
      var done = false;
      var running = 0;
	  //读取文件夹成功后会回调时会调用这里 判断是否遍历完
      function iterateeCallback(err, value) {
          running -= 1;    //完成一个减一个并发数
          if (err) {	   //如果有错误则直接调用初callback结束
              done = true;
              callback(err);
          }
          //breakLoop就是一个空值   或者已经完成或者并发数为0
          else if (value === breakLoop || (done && running <= 0)) {
              done = true;
              return callback(null);
          }
          //执行方法获取下一个值
          else {
              replenish();
          }
      }
	  //一个遍历方法
      function replenish () {
          //只要running没超过并发次数(这里的是Infinity)并且没结束则继续遍历取值
          while (running < limit && !done) {
              var elem = nextElem();
              if (elem === null) {
                  //如果已经遍历结束 则设置done = true
                  done = true;
                  //假如还有成功获取回调的则等待retrun 等待进入iterateeCallback
                  if (running <= 0) {
                      callback(null);
                  }
                  return;
              }
              //onlyOnce 的作用我觉得就是做一个日常判断 实际上没什么用 因为iterateeCallback不会为空
              running += 1;
              iteratee(elem.value, elem.key, onlyOnce(iterateeCallback));
          }
      }

      replenish();
  };
}
```

图二

```javascript
//_iteratee 才是fs.readdir selfCallback是fs.readir调用后的自身回调 但callback回调的是eachOfLimit上的方法（重点!）
function(val, callback) {

      _iteratee(val, function selfCallback(err /, ...args/) {

          if (err) return callback(err);

          return callback(null, slice(arguments, 1));

      });

  }
```

图三:

```javascript
//到了这里的时候是已经遍历完数组里三个文件夹后并获得回调的 调用最初三个参数里的callback回调了 这里基本上就是将获得到的值拼回一起 然后再传去回调
function(err, mapResults) {

      var result = [];

      for (var i = 0; i < mapResults.length; i++) {

          if (mapResults[i]) {

              result = _concat.apply(result, mapResults[i]);

          }

      }

      return callback(err, result);

 };
```

​	*4.  map的代码是如下

```javascript
export default function _asyncMap(eachfn, arr, iteratee, callback) {
    callback = callback || noop;
    arr = arr || [];
    var results = [];
    var counter = 0;
    var _iteratee = wrapAsync(iteratee);
	
    eachfn(arr, function (value, _, callback) {
        var index = counter++;
        //_iteratee 就是图二的那个位置 真正调用fs.readdir就是那里 这里只是将获得的值保存并返回到replenish上的iterateeCallback上
        _iteratee(value, function (err, v) {
            results[index] = v;
            callback(err);
        });
    }, function (err) {
    	//这里的callback就是图三那个位置
        callback(err, results);
    });
}
```

​	
