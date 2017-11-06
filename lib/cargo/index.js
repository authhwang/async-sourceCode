const async = require('async');

// const cargo =  async.cargo(function(tasks,callback) {
//   for (var i = 0; i < tasks.length; i++) {
//     console.log('hello' + tasks[i].name);
//   }
//   callback();
// }, 2);

const cargo = async.cargo(function(tasks,callback) {
  for (let i = 0; i< tasks.length; i++) {
    setTimeout(function(){
      console.log('hello' + tasks[i].name);
      callback();
    });
  }
}, 2);


cargo.push({name: 'foo'}, function(err) {
  console.log('finished processing foo');
});

cargo.push({name: 'bar'}, function(err) {
  console.log('finished  processing bar');
});

cargo.push({name: 'baz'}, function(err) {
  console.log('finished processing bar');
});