# autoInject

相对auto 它方便在可以将所需的依赖项作为该任务的参数传入 唔需要每个任务都把整个任务里获到的值数组都传过去 具有特定性 不过其实在内部他就是将现有的形式改成auto需要的形式 然后调用auto

以此为例

```javascript
async.autoInject({
    get_data: function(callback) {
        // async code to get some data
        callback(null, 'data', 'converted to array');
    },
    make_folder: function(callback) {
        // async code to create a directory to store a file in
        // this is run at the same time as getting the data
        callback(null, 'folder');
    },
    write_file: function(get_data, make_folder, callback) {
        // once there is some data and the directory exists,
        // write the data to a file in the directory
        callback(null, 'filename');
    },
    email_link: function(write_file, callback) {
        // once the file is written let's email a link to it...
        // write_file contains the filename returned by write_file.
        callback(null, {'file':write_file, 'email':'user@example.com'});
    }
}, function(err, results) {
    console.log('err = ', err);
    console.log('email_link = ', results.email_link);
});

```

## autoInject

```javascript
var FN_ARGS = /^(?:async\s+)?(function)?\s*[^\(]*\(\s*([^\)]*)\)/m;
var FN_ARG_SPLIT = /,/;
var FN_ARG = /(=.+)?(\s*)$/;
var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;

function parseParams(func) {
    func = func.toString().replace(STRIP_COMMENTS, '');
    func = func.match(FN_ARGS)[2].replace(' ', '');
    func = func ? func.split(FN_ARG_SPLIT) : [];
    func = func.map(function (arg){
        return trim(arg.replace(FN_ARG, ''));
    });
    return func;
}

export default function autoInject(tasks, callback) {
    var newTasks = {};
	//遍历tasks
    forOwn(tasks, function (taskFn, key) {
        var params;
        var fnIsAsync = isAsync(taskFn);
      	//假如没依赖的话则只有一个参数
        var hasNoDeps =
            (!fnIsAsync && taskFn.length === 1) ||
            (fnIsAsync && taskFn.length === 0);
		//这里是分析三种情况 
        if (isArray(taskFn)) {		//1.是数组的情况
            params = taskFn.slice(0, -1);
            taskFn = taskFn[taskFn.length - 1];

            newTasks[key] = params.concat(params.length > 0 ? newTask : taskFn);
        } else if (hasNoDeps) {		//2.没有依赖的情况
            // no dependencies, use the function as-is
            newTasks[key] = taskFn;
        } else {					//3.有依赖而不是数组的情况
            params = parseParams(taskFn);
            if (taskFn.length === 0 && !fnIsAsync && params.length === 0) {
                throw new Error("autoInject task functions require explicit parameters.");
            }

            // remove callback param
            if (!fnIsAsync) params.pop();

            newTasks[key] = params.concat(newTask);
        }
		//每个任务都变成这个函数
        function newTask(results, taskCb) {
            var newArgs = arrayMap(params, function (name) {
                return results[name];
            });
            newArgs.push(taskCb);
            wrapAsync(taskFn).apply(null, newArgs);
        }
    });

    auto(newTasks, callback);
}
```

有三种情况 先分析第一种

1. 是数组的情况

就会将除了数组的最后一个元素外当作参数 然后在newTasks对象上以该任务名为key 值是`newTask`函数与参数融合

2. 没有依赖的情况

则直接将该函数为值 该任务名为key加到newTasks对象上

3. 有依赖但不是数组的情况

调用`parseParams`函数 获取该任务所有的参数数组 然后该数组pop了callback参数

并push了`newTask`函数

然后就调用auto 用上已经整理过后的newTasks对象

当auto调用时肯定会调用到某个是数组或者有依赖的任务时 就会调用到`newTask`函数 处理如下

首先会将所得到的results遍历 得到所需要依赖项值的数组

然后该依赖项值数组push了在`auto`函数里的`taskCb`函数

最后再去调用`taskFn`函数 即原本每个任务键上所对应的函数

总体情况就是酱紫啦～～感觉是autoInject方便点