# detectLimit

### detectLimit(coll, limit, iteratee, callback)

用了limit就跟detect的循环机制会有不同 detect是用for循环 会循环数组上所有元素  detectLimit 是用while 来做循环 判断条件是是否done 假如同步iteratee的情况下 那会在下一次循环前会因为获得done所以不会进入第二次循环 假如异步的情况下 会先将调用栈的都调用完(即根据并发次数的控制把并发次数以内的循环都做完)  然后即使是异步 都会将回调执行 假如里面有为true的就将里面callback调用并销毁 