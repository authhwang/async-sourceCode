# auto

一堆函数需要执行 可是有些函数需要别的函数的结果获取后再作为参数去调用的情况下 可以使用auto 整个auto函数有好几个函数去执行 所以我会分步骤说明

将会以下面的例子进行说明

```javascript
async.auto({
    get_data: function(callback) {
        console.log('in get_data');
        // async code to get some data
        callback(null, 'data', 'converted to array');
    },
    make_folder: function(callback) {
        console.log('in make_folder');
        // async code to create a directory to store a file in
        // this is run at the same time as getting the data
        callback(null, 'folder');
    },
    write_file: ['get_data', 'make_folder', function(results, callback) {
        console.log('in write_file', JSON.stringify(results));
        // once there is some data and the directory exists,
        // write the data to a file in the directory
        callback(null, 'filename');
    }],
    email_link: ['write_file', function(results, callback) {
        console.log('in email_link', JSON.stringify(results));
        // once the file is written let's email a link to it...
        // results.write_file contains the filename returned by write_file.
        callback(null, {'file':results.write_file, 'email':'user@example.com'});
    }]
}, function(err, results) {
    console.log('err = ', err);
    console.log('results = ', results);
});
```

##  1.前期的参数创建

```javascript
if (typeof concurrency === 'function') {
        // concurrency is optional, shift the args.
        callback = concurrency;
        concurrency = null;
    }
    callback = once(callback || noop);
    var keys = okeys(tasks);
    var numTasks = keys.length;
    if (!numTasks) {
        return callback(null);
    }
    if (!concurrency) {
        concurrency = numTasks;
    }

    var results = {};
    var runningTasks = 0;
    var hasError = false;

    var listeners = Object.create(null);

    var readyTasks = [];

    // for cycle detection:
    var readyToCheck = []; // tasks that have been identified as reachable
    // without the possibility of returning to an ancestor task
    var uncheckedDependencies = {};
```

1. 有一点需要注意 假如没设置并发数 则有多少个任务就是为并发数
2. listener变量只是一个普通的对象 后面会做说明
3. readyTasks 是可以等待调用的任务
4. readyToCheck是一个用于检查依赖项是否正确的作用 后面会说明
5. uncheckedDependencies是每个需要依赖项的任务所对应的依赖项 后面会说明

## 2.forOwn()

```javascript
forOwn(tasks, function (task, key) {
  		//第一步
        if (!isArray(task)) {
            // no dependencies
            enqueueTask(key, [task]);
            readyToCheck.push(key);
            return;
        }
		//第二步
        var dependencies = task.slice(0, task.length - 1);
        var remainingDependencies = dependencies.length;
        if (remainingDependencies === 0) {
            enqueueTask(key, task);
            readyToCheck.push(key);
            return;
        }
        uncheckedDependencies[key] = remainingDependencies;

        arrayEach(dependencies, function (dependencyName) {
            if (!tasks[dependencyName]) {
                throw new Error('async.auto task `' + key +
                    '` has a non-existent dependency `' +
                    dependencyName + '` in ' +
                    dependencies.join(', '));
            }
            addListener(dependencyName, function () {
                remainingDependencies--;
                if (remainingDependencies === 0) {
                    enqueueTask(key, task);
                }
            });
        });
    });
```

这里其实是一个循环整个tasks对象并获取到键和值的函数 将一些可判断的情况进行整理 例如：

假设一个键所对应的是一个函数时 只会将进入图上的第一步 即上面的例子将`runtask(get_data,和对应的函数)`添加到readyTasks的数组中 然后readyTocheck数组添加一个key值即get_data 然后到跳到下一次循环

假设是一个键对应的是一个数组 则会进入第二步 首先获取到它们的依赖 然后uncheckedDependencies对象上添加该key并将对应值为该依赖 即uncheckedDependencies[write_file] = ['get_data', 'make_folder'] 然后遍历依赖项

添加观察者 即下面的代码

```javascript
function addListener(taskName, fn) {
  		//假如没有该依赖项 则会观察者listener添加key为依赖名值为是空数组
        var taskListeners = listeners[taskName];
        if (!taskListeners) {
            taskListeners = listeners[taskName] = [];
        }
		//数组会添加一个函数 该函数就是下面的这个函数
        taskListeners.push(fn);
    }

```

```javascript
function () {
   remainingDependencies--;
   if (remainingDependencies === 0) {
            enqueueTask(key, task);
   }
```

这里的作用是假如该任务的依赖项都完成时 则会将该任务添加到readyTask数组中

## 3.checkforDeadlocks

```javascript
function checkForDeadlocks() {
        // Kahn's algorithm
        // https://en.wikipedia.org/wiki/Topological_sorting#Kahn.27s_algorithm
        // http://connalle.blogspot.com/2013/10/topological-sortingkahn-algorithm.html
        var currentTask;
        var counter = 0;
        while (readyToCheck.length) {
            currentTask = readyToCheck.pop();
            counter++;
            arrayEach(getDependents(currentTask), function (dependent) {
                if (--uncheckedDependencies[dependent] === 0) {
                    readyToCheck.push(dependent);
                }
            });
        }

        if (counter !== numTasks) {
            throw new Error(
                'async.auto cannot execute tasks due to a recursive dependency'
            );
        }
    }
```

这里的作用是检查一次所以任务的依赖项是否正确 

整个循环体的机制是 会将一个先获取一个任务名 然后会将该任务名在所有的任务里的依赖项找 然后将把所有有该任务作为依赖项的任务名放在一个数组中并返回 

然后再循环该数组 把uncheckedDepedencies对象中循环得到的对应任务名中的依赖项减去 假如没有依赖项 则将该任务名添加到readytocheck数组上 以此类推 

当循环体结束时 判断counter是否等于所有任务数的值 假如符合则表示正确

其实整个机制等于模拟一次运行所有任务看看依赖项有没有正确 检查会不会出现不存在的依赖项

## 4.processQueue

```javascript
function processQueue() {
  		//假如没有可执行的任务时
        if (readyTasks.length === 0 && runningTasks === 0) {
            return callback(null, results);
        }
  		//调用任务的循环
        while(readyTasks.length && runningTasks < concurrency) {
            var run = readyTasks.shift();
          	//run就是下面的代码
            run();
        }
    }
```

run:

```javascript
function runTask(key, task) {
        if (hasError) return;
		//当每个任务执行完调用时调用的回调
        var taskCallback = onlyOnce(function(err, result) {
          	//减一个正在执行的任务数
            runningTasks--;
            if (arguments.length > 2) {
                result = slice(arguments, 1);
            }
            if (err) {
                //错误的话 就会先将之前成功获取到的结果和该任务错误时获取到结果放一起然后返回
                var safeResults = {};
                forOwn(results, function(val, rkey) {
                    safeResults[rkey] = val;
                });
                safeResults[key] = result;
                hasError = true;
                listeners = Object.create(null);

                callback(err, safeResults);
            } else {
        		//调用成功则会将结果放在results
                results[key] = result;
              	//taskComplete函数看下面
                taskComplete(key);
            }
        });
		//正在执行的任务数加1
        runningTasks++;
        var taskFn = wrapAsync(task[task.length - 1]);
  		
        if (task.length > 1) {
            taskFn(results, taskCallback);	//假如task是数组 则将之前获取到的值也返回
        } else {
            taskFn(taskCallback);	//假如只是一个函数
        }
    }
```

taskComplete

```javascript
 function taskComplete(taskName) {
        var taskListeners = listeners[taskName] || [];
        arrayEach(taskListeners, function (fn) {
            fn();
        });
        processQueue();
    }
```

将listener对应的值中的函数 即下面的函数调用一次 这样可以将每个有该依赖项的任务所对应的等待完成依赖值减一 并假如有等待完成依赖值为0 则又会添加到readyTask数组中等待调用

```javascript
function () {
   remainingDependencies--;
   if (remainingDependencies === 0) {
            enqueueTask(key, task);
   }
```

总体流程就是这样了 其实就算你将需要依赖项都任务都写在前面 不需要依赖的写后面 都不会影响到函数的调用