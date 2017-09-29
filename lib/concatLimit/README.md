# concatLimit

### concatLimit(coll, limit, iteratee, callback)

内容跟concat的是一样的 只不过是从concatLimit函数那直接开始

对于有异步操作的来说 他也会等待执行完异步得到回调后再减少一个running 所以看到不是123的结果是正常的