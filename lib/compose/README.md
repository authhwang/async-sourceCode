# compose

就好像数学函数调用 f(g(h())) 不过它的顺序跟平时的数组的执行顺序刚好相反 是从右到左顺序调用

以此为例

```javascript
function add1(n, callback) {
    setTimeout(function () {
        callback(null, n + 1);
    }, 10);
}

function mul3(n, callback) {
    setTimeout(function () {
        callback(null, n * 3);
    }, 10);
}

var add1mul3 = async.compose(mul3, add1);
add1mul3(4, function (err, result) {
    // result now equals 15
});
```

## compose

```javascript
export default function(/*...args*/) {
    return seq.apply(null, slice(arguments).reverse());
};
```

这里就看到 他会把函数数组参数调转

## seq

```javascript
export default function seq(/*...functions*/) {
    var _functions = arrayMap(arguments, wrapAsync);
    return function(/*...args*/) {
        var args = slice(arguments);
        var that = this;

        var cb = args[args.length - 1];
        if (typeof cb == 'function') {
            args.pop();
        } else {
            cb = noop;
        }

        reduce(_functions, args, function(newargs, fn, cb) {
            fn.apply(that, newargs.concat(function(err/*, ...nextargs*/) {
                var nextargs = slice(arguments, 1);
                cb(err, nextargs);
            }));
        },
        function(err, results) {
            cb.apply(that, [err].concat(results));
        });
    };
}
```

1. 由于他是返回一个函数 所以在例子上的`add1mul3`就是那个函数 而传入的参数就是函数里面的`args`
2. 后面是调用了`reduce` 函数  顺便给大家回顾一下 reduce会遍历第一个参数数组 并把每一次遍历出的对象作为第三个参数回调中作为`fn`参数传出   `args`参数则是每一次的初始化或者结果 也会在第三个参数回调作为`newargs`传出 第四个参数则是当数组遍历完后的回调 result就是最后的结果
3. 在reduce的第三个参数回调上 会去调用`fn` 即 add1、mul3 其中它在里面做了一件比较骚的事 就是将`newargs.concat`这里  作用添加调用fn的参数 由于参数可以是数组 so 而且每次在add1、mul3的调用其回调时 都会将这个参数数组给去掉 变回只有计算后值的数组

