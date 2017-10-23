const async = require('async');

async.autoInject({
  get_data: function(callback) {
    console.log('in get_data');
    callback(null,'data','converted to array');
  },
  make_folder: function(callback) {
    console.log('in make_folder');
    callback(null,'folder');
  },
  write_file: function(get_data,make_folder, callback) {
    console.log('results from write_file',get_data,make_folder);
    callback(null,'filename');
  },
  email_link: function(write_file, callback) {
    console.log('results from email_link',write_file);
    callback(null,'success@163.com');
  }
}, function(err,results) {
  console.log('result = ', results);
});

/*
in get_data
in make_folder
results from write_file [ 'data', 'converted to array' ] folder
results from email_link filename
result =  { get_data: [ 'data', 'converted to array' ],
  make_folder: 'folder',
  write_file: 'filename',
  email_link: 'success@163.com' }
*/