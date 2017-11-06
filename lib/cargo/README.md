# cargo

cargo相当于queue 只不过它只是一个并发数为1  但它可以负载量为2 相当于一台车可以搬两个货物(做两个任务) 整个函数上 做延迟回调是在cargo上的worker参数 在那边做完后 就会回调到push那里的callback cargo函数在调用后会返回一个CargoObject对象 这个对象会提供很多方法 假如详细的可以看文档 

以此为例：

```javascript
var cargo = async.cargo(function(tasks, callback) {
      for (var i=0; i<tasks.length; i++) {
          console.log('hello ' + tasks[i].name);
      }
      callback();
  }, 2);
 
  // add some items
  cargo.push({name: 'foo'}, function(err) {
      console.log('finished processing foo');
  });
  cargo.push({name: 'bar'}, function(err) {
      console.log('finished processing bar');
  });
  cargo.push({name: 'baz'}, function(err) {
      console.log('finished processing baz');
  });
```



## cargo函数

```js
export default function cargo(worker, payload) {
    return queue(worker, 1, payload);
}
```

这里就看出是用`queue` 函数  可是这里是看出只是用1辆车 即并发数为1

## queue函数

整个代码篇幅很长 我分几部分说明

### 1.初始化

```javascript
export default function queue(worker, concurrency, payload) {
    if (concurrency == null) {
        concurrency = 1;
    }
    else if(concurrency === 0) {
        throw new Error('Concurrency must not be zero');
    }

    var _worker = wrapAsync(worker);
    var numRunning = 0;	//在运行的并发数(即在运作的运输车台数)
    var workersList = [];	//在工作的任务列表

    var processingScheduled = false;//判断是否开始
    
    //_insert函数
    
    //_next函数
    
    var isProcessing = false;//文档说是可以避免同时调用p.process方法 可是我还没到那种情况怎么产生 （process迟些会解释）
	//之前所说的返回CargoObject对象 生成并返回
```

### 2.生成并返回cargoObject对象

```javascript
var q = {
   		_tasks: new DLL(),	//里面其实就是个链表 每个任务就是节点
        concurrency: concurrency,
        payload: payload,
        saturated: noop,	//noop就是个undefined
        unsaturated:noop,
        buffer: concurrency / 4,//缓冲区
        empty: noop,
        drain: noop,
        error: noop,
        started: false, //判断是否开始
        paused: false,	//判断是否停止
        push: function (data, callback) {	//增加数据
            _insert(data, false, callback);
        },
        kill: function () {		//清空任务链表函数
            q.drain = noop;
            q._tasks.empty();
        },
        unshift: function (data, callback) {	//往头部加任务
            _insert(data, true, callback);
        },
        remove: function (testFn) {			//用一个函数判断是否清除
            q._tasks.remove(testFn);
        },
        process: function () {			//进程函数
            // Avoid trying to start too many processing operations. This can occur
            // when callbacks resolve synchronously (#1267).
            if (isProcessing) {
                return;
            }
            isProcessing = true;
            while(!q.paused && numRunning < q.concurrency && q._tasks.length){
                var tasks = [], data = [];
                var l = q._tasks.length;
                if (q.payload) l = Math.min(l, q.payload);
                for (var i = 0; i < l; i++) {
                    var node = q._tasks.shift();
                    tasks.push(node);
                    workersList.push(node);
                    data.push(node.data);
                }

                numRunning += 1;

                if (q._tasks.length === 0) {
                    q.empty();
                }

                if (numRunning === q.concurrency) {
                    q.saturated();
                }

                var cb = onlyOnce(_next(tasks));
                _worker(data, cb);
            }
            isProcessing = false;
        },
        length: function () {	//任务链表的长度
            return q._tasks.length;
        },
        running: function () {	//在运行的并发数
            return numRunning;
        },
        workersList: function () {	//返回工作列表
            return workersList;
        },
        idle: function() {		//判断是否空闲状态
            return q._tasks.length + numRunning === 0;
        },
        pause: function () {	//暂停函数
            q.paused = true;
        },
        resume: function () {	//继续函数
            if (q.paused === false) { return; }
            q.paused = false;
            setImmediate(q.process);
        }
    };
    return q;
```

### 3._insert函数

在例子上是会调用push函数增加数据和回调 每一个数据代表一个对象 假如多对象数据时是一个数组装着多个对象

```javascript
 function _insert(data, insertAtFront, callback) {
        if (callback != null && typeof callback !== 'function') {
            throw new Error('task callback must be a function');
        }
        q.started = true;   //开启状态为true
        if (!isArray(data)) {	//会自动封装成数组
            data = [data];
        }
        if (data.length === 0 && q.idle()) {	//假如没数据会自动停止
            // call drain immediately if there are no tasks
            return setImmediate(function() {
                q.drain();
            });
        }

        for (var i = 0, l = data.length; i < l; i++) {//这里会将每个数组和回调对应成一个任务 就是push上回调
            var item = {
                data: data[i],
                callback: callback || noop
            };

            if (insertAtFront) {
                q._tasks.unshift(item);
            } else {
                q._tasks.push(item);
            }
        }

        if (!processingScheduled) {//由于它会先将所有push函数都执行完 所有这里有个延迟函数 只需要第一个push会调用就可以 调用时就会调用process函数
            processingScheduled = true;
            setImmediate(function() {
                processingScheduled = false;
                q.process();
            });
        }
    }
```

### 4.process函数

当所有push都调用完时 就会回到第一个push时的延迟函数 调用`q.process()`

```javascript
process: function () {
            // Avoid trying to start too many processing operations. This can occur
            // when callbacks resolve synchronously (#1267).
            if (isProcessing) {
                return;
            }
            isProcessing = true;//有调用就会设置为true 防止多个同时调用该函数
  			//这里做一个循环 条件是非停止状态 && 执行数小于并发数 && 任务链表的长度大于0
            while(!q.paused && numRunning < q.concurrency && q._tasks.length){
                var tasks = [], data = [];
                var l = q._tasks.length;
                if (q.payload) l = Math.min(l, q.payload); //l指的是每个并发数的最小负载数（货车能装的货量） 
                for (var i = 0; i < l; i++) { //开始装货
                    var node = q._tasks.shift();
                    tasks.push(node);
                    workersList.push(node);
                    data.push(node.data);
                }

                numRunning += 1;

                if (q._tasks.length === 0) {
                    q.empty();
                }

                if (numRunning === q.concurrency) {
                    q.saturated();
                }
				
                var cb = onlyOnce(_next(tasks));
                _worker(data, cb);	//这里的_worker就是最初参数的worker参数函数
            }
            isProcessing = false;
```

当worker函数上调用callback时 就会进入_next函数

### 5._next函数

```javascript
function _next(tasks) {
        return function(err){
            numRunning -= 1;//当调用_next函数时 就会减1个并发数
			//循环所有task
            for (var i = 0, l = tasks.length; i < l; i++) {
                var task = tasks[i];

                var index = indexOf(workersList, task, 0);
                if (index === 0) {
                    workersList.shift();	//在工作中任务列表推出对应的任务
                } else if (index > 0) {
                    workersList.splice(index, 1);
                }

                task.callback.apply(task, arguments);//调用任务本身所有的callback（callback会有可能同一个）

                if (err != null) {
                    q.error(err, task.data);
                }
            }

            if (numRunning <= (q.concurrency - q.buffer) ) {//这里判断运行数少于并发数减缓冲。。。不过不是很懂这里是干啥。。
                q.unsaturated();
            }
			//假如休闲状态又会调用drain通知
            if (q.idle()) {
                q.drain();
            }
          	//继续下一轮的process
            q.process();
        };
    }
```

整个流程就是这样啦～～可能注意点是在于假如worker参数上没有延时操作 那它将会一条龙走到底 即从process -> _next -> process

假如有延时操作 则在先会将process的并发数先搞完 然后再等待有调用回调再进入_next