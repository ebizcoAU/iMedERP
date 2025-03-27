var $CVar = require('./constants');
var mysql      = require('mysql');
var dbConfig = {
  connectionLimit : 1000,
  connectTimeout  : 60 * 60 * 1000,
  acquireTimeout  : 60 * 60 * 1000,
  timeout         : 60 * 60 * 1000,
  host     : $CVar.host, //mysql database host name
  port     : 3306,
  user     : $CVar.user, //mysql database user name
  password : $CVar.password, //mysql database password
  database : $CVar.database, //mysql database name
  multipleStatements: true,
  dateStrings: [
      'DATE',
      'DATETIME'
  ]
};

var connectionPool = mysql.createPool(dbConfig);
connectionPool.getConnection((err,connection)=> {
  if(err)
  throw err;
  console.log('Database connected successfully');
  connection.release();
});
module.exports = connectionPool;
