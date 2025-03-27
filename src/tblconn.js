module.exports = function(tble, tm) {
  const connection = require('./mysqlConn');

  this.tble = tble;
  this.tm = tm;

  isEmpty = function (obj) {
      for(var key in obj) {
          if(obj.hasOwnProperty(key))
              return false;
      }
      return true;
  }

  setKeyVal = function (data, dateRange) {
    let keyVal = [];
    let keyStr = '';
    let key = {};
    if (!isEmpty(data)) {
      keyVal.push(data.where)
    }
    if (!isEmpty(dateRange)) keyVal.push(` ( (TO_DAYS(dateAdded) >= TO_DAYS('${dateRange.fromdate}')) AND (TO_DAYS(dateAdded) <= TO_DAYS('${dateRange.todate}')) ) `);
    keyStr = keyVal.join(' AND ');
    if (keyStr == '') keyStr = 1;
    key.where = keyStr;
    if (isEmpty(data.tbls)) { key.tbls = 1;
    } else { key.tbls = data.tables; }
    if (isEmpty(data.groupby)) { key.groupby = 1
    } else { key.groupby = data.groupby; }
    if (isEmpty(data.orderby)) { key.orderby = 1
    } else { key.orderby = data.orderby; }
    return key;
  }
  execQuerySet = function (sql, callback) {
    connection.query(sql, function (error, results, fields) {
      if (error) { throw error }
      callback(null, results);
    })
  }
  execQuery = function (sql, callback) {
    connection.query(sql, function (error, results, fields) {
      if (error) { throw error }
      if (typeof results === 'object' &&  !Array.isArray(results) ) {
        callback(null, results);
      } else {
        callback(null, results[0]);
      }
    })
  }

  this.execSQLA = function (sql, values, callback) {
    connection.query(sql, [values], function (error, results, fields) {
      if (error) { throw error }
      if (typeof results === 'object' &&  !Array.isArray(results) ) {
        callback(null, results);
      } else {
        callback(null, results[0]);
      }

    })
  }

  this.execSQL = function (sql, callback) {
    connection.query(sql, function (error, results, fields) {
      if (error) { throw error }
      callback(null, results);
    })
  }
  this.getPrimKey = function() {
    return Object.keys(this.tm)[0];
  }
  this.findOne = function(id, callback) { //id is an object {'id':'value'}
    let searchStr = '';
    if (this.tm[Object.keys(id)] == 'string') searchStr = `(${Object.keys(id)} = '${Object.values(id)}')`;
    else searchStr = `(${Object.keys(id)} = ${Object.values(id)})`;
    let sql = 'SELECT * ';
    sql += ' FROM `'+ this.tble +'`';
    sql += ' WHERE ' + searchStr;
    console.log("findOne1: " + sql);
    connection.query(sql, function (error, results, fields) {
      if (error) { throw error }
      else if (results.length == 0) { // No results returned mean the object is not found
        callback(203); //no record found
      } else {
        callback(null,results[0]);
      }
    })
  }
  this.remove = function(id, callback) {
    let searchStr = '';
    if (this.tm[Object.keys(id)] == 'string') searchStr = `(${Object.keys(id)} = '${Object.values(id)}')`;
    else searchStr = `(${Object.keys(id)} = ${Object.values(id)})`;
    let sql = 'DELETE ';
    sql += ' FROM `'+ this.tble +'`';
    sql += ' WHERE ' + searchStr;
    console.log(sql);
    connection.query(sql, function (error, results, fields) {
      if (error) { throw error }
      if (results.affectedRows > 0) { callback(null, true);
      } else { callback(null, false); }
    })
  }
  this.delete = function(params, callback) {
    searchStr = params;
    let sql = 'DELETE ';
    sql += ' FROM `'+ this.tble +'`';
    sql += ' WHERE ' + searchStr;
    console.log(sql);
    connection.query(sql, function (error, results, fields) {
      if (error) { throw error }
      if (results.affectedRows > 0) { callback(null, true);
      } else { callback(null, false); }
    })
  }
  this.find = function(params, callback) {
    let keyVal = [];
    let keyStr = '';
    for (let i=0; i < Object.keys(params).length; i++) {
      if (this.tm[Object.keys(params)[i]] == 'string') {
        keyVal.push(` (${Object.keys(params)[i]} = '${Object.values(params)[i]}') `);
      } else if (tm[Object.keys(params)[i]] == 'integer') {
        keyVal.push(` (${Object.keys(params)[i]} = ${Object.values(params)[i]}) `);
      }
    }
    keyStr = keyVal.join(' AND ');
    console.log("keyStr: " + keyStr)
    let sql = 'SELECT * ';
    sql += ' FROM `'+ this.tble +'`';
    sql += ' WHERE ' + keyStr;
    console.log("findSQL:" + sql);
    execQuerySet(sql, callback);
  }
  this.save = function (paramex, callback) {
    let keyVal = [];
    let keyStr = '';
    let whereStr = '';
    let tblex = this.tble;
    let tm = this.tm;
    if (Array.isArray(paramex)) {
      let paramexArray = [];
      paramex.forEach( function (params) {
        keyVal = [];
        for (let i=0; i < Object.keys(params).length; i++) {
          if (Object.keys(params)[i] == Object.keys(tm)[0]) { //primary key
            whereStr = `(${Object.keys(params)[i]} = ${Object.values(params)[i]})`;
          } else {
            if (tm[Object.keys(params)[i]] == 'string') {
              keyVal.push(` ${Object.keys(params)[i]} = '${Object.values(params)[i]}'`);
            } else if (tm[Object.keys(params)[i]] == 'integer') {
              keyVal.push(` ${Object.keys(params)[i]} = ${Object.values(params)[i]}`);
            }
          }
        }
        keyStr = keyVal.join(',');
        let sql = 'UPDATE '+ tblex + ' SET '+ keyStr;
        sql += ' WHERE ' + whereStr;
        //console.log('sql: '+ sql);
        paramexArray.push(sql);
      })
      paramexArray = paramexArray.join(';');
      //console.log('paramexArray:' + paramexArray);
      connection.query(paramexArray, function (error, results, fields) {
        if (error) { console.log(error); throw callback(error) }
        else { callback(null, {status:'OK'}); }
      });
    } else {
      for (let i=0; i < Object.keys(paramex).length; i++) {
        if (Object.keys(paramex)[i] == Object.keys(tm)[0]) { //primary key
          primVal = Object.values(paramex)[i];
          whereStr = `(${Object.keys(paramex)[i]} = ${Object.values(paramex)[i]})`;
        } else {
  //        console.log('keyVal: '+ ` ${Object.keys(params)[i]} = '${Object.values(params)[i]}'`);
          if (tm[Object.keys(paramex)[i]] == 'string') {
            keyVal.push(` ${Object.keys(paramex)[i]} = '${Object.values(paramex)[i]}'`);
          } else if (tm[Object.keys(paramex)[i]] == 'integer') {
            if (Object.values(paramex)[i] !== '') keyVal.push(` ${Object.keys(paramex)[i]} = ${Object.values(paramex)[i]}`);
            else keyVal.push(` ${Object.keys(paramex)[i]} = 0`);
          } else if (tm[Object.keys(paramex)[i]] == 'boolean'){
            if (Object.values(paramex)[i] == false)  {
              keyVal.push(`${Object.keys(paramex)[i]}= 0`);
            } else {
              keyVal.push(`${Object.keys(paramex)[i]}= 1`);
            }   
          }
        }
      }
  //    console.log(keyVal);
      keyStr = keyVal.join(',');
      let sql = 'UPDATE '+ tblex + ' SET '+ keyStr;
      sql += ' WHERE ' + whereStr;
      console.log('sqlUPDATE: ' + sql);
      execQuery(sql, function(error, results){
        if (error) { throw error }
        let sql = 'SELECT * ';
        sql += ' FROM '+ tblex;
        sql += ' WHERE ' + whereStr;
        //console.log('sqlSELECT: ' + sql);
        execQuery(sql, callback);
      });
    }
  }

  this.insert = function (paramx, callback) {
    //console.log('paramx: ' + JSON.stringify(paramx, false, 4));
    let keyVal = [];
    let keyStr = '';
    let valuesVal = [];
    let valuesStr = '';
    let tm = this.tm;
    let primKey = Object.keys(tm)[0];
    let tblex = this.tble;
    if (Array.isArray(paramx)) {
      let paramexArray = [];
      paramx.forEach( function (params) {
        keyVal = [];
        valuesVal = [];
        for (let i=0; i < Object.keys(params).length; i++) {
          if (tm[Object.keys(params)[i]] == 'string') {
            keyVal.push(`${Object.keys(params)[i]}`);
            valuesVal.push(`'${Object.values(params)[i]}'`);
          } else if (tm[Object.keys(params)[i]] == 'integer') {
            keyVal.push(`${Object.keys(params)[i]}`);
            valuesVal.push(`${Object.values(params)[i]}`);
          }
        }
        keyStr = `(${keyVal.join(',')})`;
        valuesStr = `(${valuesVal.join(',')})`;
        let sql = 'INSERT INTO '+ tblex + ' ' +keyStr+' VALUES '+valuesStr;
        //console.log(sql);
        paramexArray.push(sql);
      })
      paramexArray = paramexArray.join(';');
      console.log('paramexArray:' + paramexArray);
      connection.query(paramexArray, function (error, results, fields) {
        if (error) { throw callback(error) }
        else { callback(null, {status:'OK'}); }
      });
    } else {
      for (let i=0; i < Object.keys(paramx).length; i++) {
        if (tm[Object.keys(paramx)[i]] == 'string') {
          keyVal.push(`${Object.keys(paramx)[i]}`);
          valuesVal.push(`'${Object.values(paramx)[i]}'`);
        } else if (tm[Object.keys(paramx)[i]] == 'integer'){
          keyVal.push(`${Object.keys(paramx)[i]}`);
          valuesVal.push(`${Object.values(paramx)[i]}`);
        }
      }
      keyStr = `(${keyVal.join(',')})`;
      valuesStr = `(${valuesVal.join(',')})`;
      let sql = 'INSERT INTO '+ tblex + ' ' +keyStr+' VALUES '+valuesStr;
      console.log(sql);
      execQuery(sql, function(error, results){
        if (error) { throw error }
        let sql = 'SELECT * ';
        sql += ' FROM '+ tblex;
        sql += ` WHERE (${primKey} = ${results.insertId})`;
        //console.log('sql: ' + sql);
        execQuery(sql, callback);
      });
    }
  }
//******** Find Total ***********
  this.findTotal = function(params, dateRange, callback) {
    let keys = setKeyVal(params, dateRange);
    //console.log("keys: " + JSON.stringify(keys, false, 4));
    let sql = 'SELECT FORMAT(COUNT(*),0) AS Total';
    if (keys.tbls == 1) sql += ' FROM `'+ this.tble +'`';
    else sql += ' FROM '+ keys.tbls;
    sql += ' WHERE ' + keys.where;
    //console.log("sqlxx: " + sql)
    execQuery(sql, callback);
  }
  this.findMaxHourly = function(params, dateRange, callback) {
    let keys = setKeyVal(params, dateRange);
    let sql = `SELECT DATE_FORMAT(DATE_ADD(dateAdded, INTERVAL 60 MINUTE),'%d/%m %H:00') AS DTInterval, Count(*) AS Total`;
    sql += ' FROM `'+ this.tble +'`';
    sql += ' WHERE ' + keys.where;
    sql += ` GROUP BY DATE_FORMAT(DATE_ADD(dateAdded, INTERVAL 60 MINUTE),'%d/%m %H:00') `;
    sql += ` ORDER BY DATE_FORMAT(DATE_ADD(dateAdded, INTERVAL 60 MINUTE),'%d/%m %H:00') `;
    //console.log(sql);
    execQuerySet(sql, function(err, data){
      let maxtick = 0;
      if (data.length > 0) maxtick = Math.max.apply(Math, data.map(function(o) { return o.Total }))
      callback(err, maxtick);
    });
  }
  this.findMaxDaily = function(params, dateRange, callback) {
    let keys = setKeyVal(params, dateRange);
    let sql = `SELECT DATE_FORMAT(dateAdded, '%d/%m') AS DTInterval, Count(*) AS Total`;
    sql += ' FROM `'+ this.tble +'`';
    sql += ' WHERE ' + keys.where;
    sql += ` GROUP BY DATE_FORMAT(dateAdded, '%d/%m')`;
    sql += ` ORDER BY DATE_FORMAT(dateAdded, '%d/%m')`;
    //console.log(sql);
    execQuerySet(sql, function(err, data){
      let maxtick = 0;
      if (data.length > 0) maxtick = Math.max.apply(Math, data.map(function(o) { return o.Total }))
      callback(err, maxtick);
    });
  }
  this.findTotalDaily = function(params, dateRange, callback) {
    let keys = setKeyVal(params, dateRange);
    let sql = `SELECT DATE_FORMAT(dateAdded, '%d/%m') AS DTInterval, Count(*) AS Total`;
    sql += ' FROM `'+ this.tble +'`';
    sql += ' WHERE ' + keys.where;
    sql += ` GROUP BY DATE_FORMAT(dateAdded, '%d/%m')`;
    sql += ` ORDER BY DATE_FORMAT(dateAdded, '%d/%m')`;
    //console.log(sql);
    execQuerySet(sql, callback);
  }
  this.findMaxMonthly = function(params, dateRange, callback) {
    let keys = setKeyVal(params, dateRange);
    //Calculate number of users being generated in weekly
    let sql = `SELECT DATE_FORMAT(dateAdded, '%Y/%m') AS DTInterval, Count(*) AS Total`;
    sql += ' FROM `'+ this.tble +'`';
    sql += ' WHERE ' + keys.where;
    sql += ` GROUP BY DATE_FORMAT(dateAdded, '%Y/%m') `;
    sql += ` ORDER BY DATE_FORMAT(dateAdded, '%Y/%m') `;
    //console.log(sql);
    execQuerySet(sql, function(err, data){
      let maxtick = 0;
      if (data.length > 0) maxtick = Math.max.apply(Math, data.map(function(o) { return o.Total }))
      callback(err, maxtick);
    });
  }

  this.findTotalHourly = function(params, dateRange, callback) {
    let keys = setKeyVal(params, dateRange);
    let sql = `SELECT DATE_FORMAT(DATE_ADD(dateAdded, INTERVAL 60 MINUTE),'%d/%m %H:00') AS DTInterval, Count(*) AS Total`;
    sql += ' FROM `'+ this.tble +'`';
    sql += ` GROUP BY DATE_FORMAT(DATE_ADD(dateAdded, INTERVAL 60 MINUTE),'%d/%m %H:00') `;
    sql += ` ORDER BY DATE_FORMAT(DATE_ADD(dateAdded, INTERVAL 60 MINUTE),'%d/%m %H:00') `;
    //console.log(sql);
    execQuerySet(sql, callback);
  }
  this.findTotalWeekly = function(params, dateRange, callback) {
    let keys = setKeyVal(params, dateRange);
    //Calculate number of users being generated in weekly
    let sql = `SELECT DATE_FORMAT(dateAdded, '%Y %V') AS DTInterval, Count(*) AS Total`;
    sql += ' FROM `'+ this.tble +'`';
    sql += ' WHERE ' + keys.where;
    sql += ` GROUP BY DATE_FORMAT(dateAdded, '%Y %V') `;
    sql += ` ORDER BY DATE_FORMAT(dateAdded, '%Y %V') `;
    execQuerySet(sql, callback);
  }
  this.findTotalMonthly = function(params, dateRange, callback) {
    let keys = setKeyVal(params, dateRange);
    //Calculate number of users being generated in weekly
    let sql = `SELECT DATE_FORMAT(dateAdded, '%Y/%m') AS DTInterval, Count(*) AS Total`;
    sql += ' FROM `'+ this.tble +'`';
    sql += ' WHERE ' + keys.where;
    sql += ` GROUP BY DATE_FORMAT(dateAdded, '%Y/%m') `;
    sql += ` ORDER BY DATE_FORMAT(dateAdded, '%Y/%m') `;
    //console.log(sql);
    execQuerySet(sql, callback);
  }
  this.findCummulateHourly = function(params, dateRange, callback) {
    let tbl = this.tble;
    let sqlx = `SELECT Count(*) AS CummTotal`;
    sqlx += ' FROM '+ tble;
    if (!isEmpty(params)) {
      sqlx += ` WHERE ${params.where} AND (TO_DAYS(dateAdded) < TO_DAYS('${dateRange.fromdate}') )`;
    } else {
      sqlx += ` WHERE (TO_DAYS(dateAdded) < TO_DAYS('${dateRange.fromdate}') )`;
    }
    //console.log(sqlx);
    execQuerySet(sqlx, function (err, data) {
      let cumtotal;
      if (data.length > 0) {
        cumtotal = data[0].CummTotal;
      } else {
        cumtotal = 0;
      }
      //console.log("CummTotal: " + cumtotal);
      let keys = setKeyVal(params, dateRange);
      let sql = `SELECT DATE_FORMAT(DATE_ADD(dateAdded, INTERVAL 60 MINUTE),'%d/%m %H:00') AS DTInterval, Count(*) AS Total`;
      sql += ' FROM '+ tble;
      sql += ' WHERE ' + keys.where;
      sql += ` GROUP BY DATE_FORMAT(DATE_ADD(dateAdded, INTERVAL 60 MINUTE),'%d/%m %H:00') `;
      sql += ` ORDER BY DATE_FORMAT(DATE_ADD(dateAdded, INTERVAL 60 MINUTE),'%d/%m %H:00') `;
      console.log(sql);
      execQuerySet(sql, function(err, data) {
        if (data.length > 0) {
          data.some(function(dat) {
            dat.Total += cumtotal;
            cumtotal = dat.Total;
          })
          console.log("data11:" + JSON.stringify(data,))
          callback(err, data);
        } else {
          sql = `SELECT DATE_FORMAT('${dateRange.fromdate}', '%d/%m %H:00') AS DTInterval, (${cumtotal}*1) AS Total`;
          console.log(sql);
          execQuerySet(sql, function(err, data) {
            callback(err, data);
          })
        }

      });
    });
  }
  this.findCummulateDaily = function(params, dateRange, callback) {
    let tbl = this.tble;
    let sqlx = `SELECT Count(*) AS CummTotal`;
    sqlx += ' FROM '+ tble;
    if (!isEmpty(params)) {
      sqlx += ` WHERE ${params.where} AND (TO_DAYS(dateAdded) < TO_DAYS('${dateRange.fromdate}') )`;
    } else {
      sqlx += ` WHERE (TO_DAYS(dateAdded) < TO_DAYS('${dateRange.fromdate}') )`;
    }
    console.log(sqlx);
    execQuerySet(sqlx, function (err, data) {
      let cumtotal;
      if (data.length > 0) {
        cumtotal = data[0].CummTotal;
      } else {
        cumtotal = 0;
      }
      console.log("CummTotal: " + cumtotal);
      let keys = setKeyVal(params, dateRange);
      let sql = `SELECT DATE_FORMAT(dateAdded, '%d/%m') AS DTInterval, Count(*) AS Total`;
      sql += ' FROM '+ tble;
      sql += ' WHERE ' + keys.where;
      sql += ` GROUP BY DATE_FORMAT(dateAdded, '%d/%m')`;
      sql += ` ORDER BY DATE_FORMAT(dateAdded, '%d/%m')`;
      console.log(sql);
      execQuerySet(sql, function(err, data) {
        if (data.length > 0) {
          data.some(function(dat) {
            dat.Total += cumtotal;
            cumtotal = dat.Total;
          })
          console.log("data:" + JSON.stringify(data,))
          callback(err, data);
        } else {
          sql = `SELECT DATE_FORMAT('${dateRange.fromdate}', '%d/%m') AS DTInterval, (${cumtotal}*1) AS Total`;
          console.log(sql);
          execQuerySet(sql, function(err, data) {
            callback(err, data);
          })
        }
      });
    });
  }
  this.findCummulateMonthly = function(params, dateRange, callback) {
    let tbl = this.tble;
    let sqlx = `SELECT Count(*) AS CummTotal`;
    sqlx += ' FROM '+ tble;
    if (!isEmpty(params)) {
      sqlx += ` WHERE ${params.where} AND (TO_DAYS(dateAdded) < TO_DAYS('${dateRange.fromdate}') )`;
    } else {
      sqlx += ` WHERE (TO_DAYS(dateAdded) < TO_DAYS('${dateRange.fromdate}') )`;
    }
    console.log(sqlx);
    execQuerySet(sqlx, function (err, data) {
      let cumtotal;
      if (data.length > 0) {
        cumtotal = data[0].CummTotal;
      } else {
        cumtotal = 0;
      }
      console.log("CummTotal: " + cumtotal);
      let keys = setKeyVal(params, dateRange);
      //Calculate number of users being generated in weekly
      let sql = `SELECT DATE_FORMAT(dateAdded, '%Y/%m') AS DTInterval, Count(*) AS Total`;
      sql += ' FROM '+ tble;
      sql += ' WHERE ' + keys.where;
      sql += ` GROUP BY DATE_FORMAT(dateAdded, '%Y/%m') `;
      sql += ` ORDER BY DATE_FORMAT(dateAdded, '%Y/%m') `;
      console.log(sql);
      execQuerySet(sql, function(err, data) {
        if (data.length > 0) {
          data.some(function(dat) {
            dat.Total += cumtotal;
            cumtotal = dat.Total;
          })
          console.log("data:" + JSON.stringify(data,))
          callback(err, data);
        } else {
          sql = `SELECT DATE_FORMAT('${dateRange.fromdate}', '%Y/%m') AS DTInterval, (${cumtotal}*1) AS Total`;
          console.log(sql);
          execQuerySet(sql, function(err, data) {
            callback(err, data);
          })
        }
      });
    });
  }
  this.findLastRecord = function(constraints, params, callback) {
    //console.log('constraints: ' + JSON.stringify(constraints))
    //console.log('params: ' + JSON.stringify(params))
    let sql = '';
    let conStr = [];
    let whereStr = '';
    if (constraints !== null) {
      for (let i=0; i < Object.keys(constraints).length; i++) {
        if (this.tm[Object.keys(constraints)[i]] == 'string') {
          conStr.push(`(${Object.keys(constraints)[i]} = "${Object.values(constraints)[i]}")`);
        } else if (this.tm[Object.keys(constraints)[i]] == 'integer') {
          conStr.push(`(${Object.keys(constraints)[i]} = ${Object.values(constraints)[i]})`);
        }
      }
      whereStr = conStr.join(' AND ');
    }
    if (params !== null) {
      let orderStr = `${Object.keys(params)} ${Object.values(params)}`;
      sql = 'SELECT * ';
      sql += ' FROM `'+ this.tble +'`';
      if (whereStr !== '') sql += " WHERE "+ whereStr;
      sql += ' ORDER BY ' + orderStr;
      sql += ' LIMIT 0,1'
    } else {
      sql = 'SELECT * ';
      sql += ' FROM `'+ this.tble +'`';
      if (whereStr !== '') sql += " WHERE "+ whereStr;
      sql += ' LIMIT 0,1'
    }
    console.log('sql: '+ sql);
    execQuerySet(sql, callback);
  }
  this.getAllRecords = function(constraints, params, callback) { //Taking 1 field ordering only
    let sql = '';
    let conStr = [];
    let whereStr = '';
    if (constraints !== null) {
      for (let i=0; i < Object.keys(constraints).length; i++) {
        if (this.tm[Object.keys(constraints)[i]] == 'string') {
          conStr.push(`(${Object.keys(constraints)[i]} = "${Object.values(constraints)[i]}")`);
        } else {
          conStr.push(`(${Object.keys(constraints)[i]} = ${Object.values(constraints)[i]})`);
        }
      }
      whereStr = conStr.join(' AND ');
    }
    if (params !== null) {
      let orderStr = `${Object.keys(params)} ${Object.values(params)}`;
      sql = 'SELECT * ';
      sql += ' FROM `'+ this.tble +'`';
      if (whereStr !== '') sql += " WHERE "+ whereStr;
      sql += ' ORDER BY ' + orderStr;
    } else {
      sql = 'SELECT * ';
      sql += ' FROM `'+ this.tble +'`';
      if (whereStr !== '') sql += " WHERE "+ whereStr;
    }
    //console.log('sql: '+ sql);
    execQuerySet(sql, callback);
  }
  this.getTotalRecords = function(constraints, callback) { //Taking 1 field ordering only
    let sql = '';
    let conStr = [];
    let whereStr = '';
    if (constraints !== null) {
      for (let i=0; i < Object.keys(constraints).length; i++) {
        if (this.tm[Object.keys(constraints)[i]] == 'string') {
          conStr.push(`(${Object.keys(constraints)[i]} = "${Object.values(constraints)[i]}")`);
        } else {
          conStr.push(`(${Object.keys(constraints)[i]} = ${Object.values(constraints)[i]})`);
        }
      }
      whereStr = conStr.join(' AND ');
    }
    sql = 'SELECT COUNT(*) AS "Total" ';
    sql += ' FROM `'+ this.tble +'`';
    if (whereStr !== '') sql += " WHERE "+ whereStr;
    //console.log('sql: '+ sql);
    execQuerySet(sql, callback);
  }
  this.search = function(constraints, searchobj, callback) { //Taking 1 field ordering only
    let sql = '';
    let whStr = [];
    let whereStr = '';
    let seaStr = [];
    let searchStr = '';
    let selStr = [];
    if (constraints !== null) {
      for (let i=0; i < Object.keys(constraints).length; i++) {
        if (this.tm[Object.keys(constraints)[i]] == 'string') {
          whStr.push(`(${Object.keys(constraints)[i]} = "${Object.values(constraints)[i]}")`);
        } else {
          whStr.push(`(${Object.keys(constraints)[i]} = ${Object.values(constraints)[i]})`);
        }
      }
      whereStr = whStr.join(' AND ');
    }
    if (searchobj !== null) {
      for (let i=0; i < Object.keys(searchobj).length; i++) {
        seaStr.push(`(${Object.keys(searchobj)[i]} LIKE "%${Object.values(searchobj)[i]}%")`);
        selStr.push(Object.keys(searchobj)[i]);
      }
      selStr.push(this.getPrimKey());
      searchStr = seaStr.join(' OR ');
    }
    sql = 'SELECT ' + selStr.join(",");
    sql += ' FROM `'+ this.tble +'`';
    if (whereStr !== '') sql += " WHERE "+ whereStr;
    if (searchStr !== '') sql +=  ` AND ( ${searchStr} )`;
    console.log('sql: '+ sql);
    execQuerySet(sql, callback);
  }
//*********************************************************************************
this.getJSON = function(fname, sql0, tablen, commonkey, callback)  {
  function omitArray(id, key, arr) {
    console.log('id: '+ id + ', key: '+ key );
    let result = [];
    let tarray = arr.filter(d=> d[key]==id);
    //console.log('tarray: '+ JSON.stringify(tarray, false, 4));
    tarray.some(d=> {
      result.push( omit(d, key))
    });
    return result;
  }
  function omit(obj, ...props) {
    const result = { ...obj };
    props.forEach(function(prop) {
      delete result[prop];
    });
    return result;
  }


  function getSlave(tablex, comkey, id, resolve, reject) {
    console.log(`getSlave: ${tablex} ${comkey} ${id}`);
    let sql1 = `SELECT * FROM ${tablex} WHERE (${comkey} = ${id} )`;
    console.log('sql1: '+sql1);
    execQuerySet(sql1, function(error, data) {
      if (error) { resolve(0) ;
      } else {
        resolve(data)
      }
    })
  }

  let fn2 = function getSlave3(dat) {
    return new Promise(function(resolve, reject) {
      if ((commonkey[2] !== null) && (commonkey[2] !== undefined) ) {
        getSlave(tablen[3], commonkey[2],  dat[`${commonkey[2]}`], resolve, reject );
      } else {
        reject(0);
      }
    })
  }
  let fn1 = function getSlave2(dat) {
    return new Promise(function(resolve, reject) {
      if ((commonkey[1] !== null) && (commonkey[1] !== undefined) ) {
        //console.log("dat: " + dat[`${commonkey[1]}`])
        getSlave(tablen[2], commonkey[1],  dat[`${commonkey[1]}`], resolve, reject );
      } else {
        reject(0);
      }
    })
  }
  let fn = function getSlave1(dat) {
    return new Promise(function(resolve, reject) {
      if ((commonkey[0] !== null) && (commonkey[0] !== undefined) ) {
        getSlave(tablen[1], commonkey[0], dat[`${commonkey[0]}`], resolve, reject );
      } else {
        reject(0);
      }
    })
  }
  var actions, results, actions1, results1, actions2, results2, actions3, results3;
  var objectRet = [];
  return new Promise(function(resolve, reject) {
    let sql = sql0;
    //console.log('sql0: '+sql);
    //console.log('tablen: '+ JSON.stringify(tablen,false,4));
    execQuerySet(sql, function(error, data) {
      if (error) { console.log(JSON.stringify({ status: 0, title: error }));
      } else {
        //console.log('result0: '+ JSON.stringify(data, false, 4));
        actions = data.map(fn);
        results = Promise.all(actions).then( function (d1) {
          //console.log('result1: '+ JSON.stringify(d1[0], false, 4));
          if (tablen.length > 2) {
            actions1 = data.map(fn1);
            results1 = Promise.all(actions1).then( function (d2) {
              //console.log('result2: '+ JSON.stringify(d2[0], false, 4));
              if (tablen.length > 3) {
                actions2 = d2[0].map(fn2);
                results2 = Promise.all(actions2).then( function (d3) {
                  //console.log('result3: '+ JSON.stringify(d3[0], false, 4));
                  //** Build the return object
                  let i= 0;
                  d3[0].forEach(function(dat){
                    dat[tablen[1]] = omitArray(dat[commonkey[0]],commonkey[0],d1[i]);
                    dat[tablen[2]] = omitArray(dat[commonkey[1]],commonkey[1],d2[i]);
                    dat[tablen[3]] = omitArray(dat[commonkey[2]],commonkey[2],d3[i]);
                    objectRet.push(dat);
                    i++;
                  })
                  //console.log('objectRet2: '+ JSON.stringify(objectRet, false, 4));
                  //res.send(JSON.stringify(objectRet, false, 4));
                  callback(objectRet);
                })
              } else {
                //** Build the return object
                let i= 0;
                data.forEach(function(dat){
                  dat[tablen[1]] = omitArray(dat[commonkey[0]],commonkey[0],d1[i]);
                  dat[tablen[2]] = omitArray(dat[commonkey[1]],commonkey[1],d2[i]);
                  objectRet.push(dat);
                  i++;
                })
                //console.log('objectRet1: '+ JSON.stringify(objectRet, false, 4));
                //res.send(JSON.stringify(objectRet, false, 4));
                callback(objectRet);
              }
            })
          } else {
            //** Build the return object
            let i= 0;
            data.forEach(function(dat){
              dat[tablen[1]] = omitArray(dat[commonkey[0]], commonkey[0],d1[i]);
              objectRet.push(dat);
              i++;
            })
            //console.log('objectRet0: '+ JSON.stringify(objectRet, false, 4));
            callback(objectRet);
          }
        })
      }
    })
  })
}

this.execSSQL = function (sql, params, callback) {
  var tm = this.tm;
  
  function limitx (skip, take) {
    return `LIMIT ${parseInt(skip, 10)}, ${parseInt(take, 10)}`;
  }
  function orderx (sort) {
    var sortx = JSON.parse(sort);
    if (sortx[0].desc) return `ORDER BY ${sortx[0].selector} DESC`
    else return `ORDER BY ${sortx[0].selector} `
  }

  function hasANDOR (arr) {
    let hasANDORx = false;
    if (Array.isArray(arr)) {
      if (arr[1] &&  ((arr[1].toUpperCase() == 'AND') || (arr[1].toUpperCase() == 'OR'))) hasANDORx = true;
    }
    return hasANDORx;
  }
  function isDateValid(dateStr) {
    if (isString(dateStr))
      return !isNaN(new Date(dateStr));
    else
      return false;
  }

  function isString(strx) {
    if (typeof strx === 'string' || strx instanceof String)
      return true
    else
      return false;
  }

  function con2SingleSQLString(arr) {
    let item = `(`;
    if (Array.isArray(arr)) {
      if (arr[1] == 'contains') {
        item += `${arr[0]} LIKE '%${arr[2]}%' `;
      } else {
        if (tm[Object.keys(arr[2])] == 'integer') {
          item += `${arr[0]} ${arr[1]} ${arr[2]}`;
        } else {
          if (isDateValid(arr[2])) {
            item += ` TO_DAYS(${arr[0]}) ${arr[1]} TO_DAYS('${arr[2]}')`;
          } else {
            item += ` ${arr[0]}  ${arr[1]} '${arr[2]}'`;
          }
        }
      } 
    }
    item += ')';
    console.log(`E: ${item}`)
    return item;
  }
  function con2MultpleSQLString(arr) {
    let listx = []; 
    arr.forEach(items => {
      if (Array.isArray(items)) {
        listx.push(con2SingleSQLString(items))
      } else {
        listx.push(items.toUpperCase())
      }
    })
    let output =  listx.join(' ');
    console.log(`C: ${output}`);
    return output;
  }

  function filter (filter) {
    var filterx = JSON.parse(filter);
    console.log(filterx)
    //console.log("START SCAN")
    var fieldlist = []; 
    var singleArray = true;
    filterx.every((items,index)=>{
      //console.log('A:' + JSON.stringify(items))
      if (singleArray && !Array.isArray(items) && isString(items)) {
        //console.log("AAAAA")
        fieldlist.push(con2SingleSQLString(filterx))
        return false;
      } else {
        singleArray = false;
        if (hasANDOR(items)) {
          //console.log("BBBBB")
          fieldlist.push(`(${con2MultpleSQLString(items)})`);
          return true;
        } else {
          if (Array.isArray(items)) {
            //console.log("CCCC");
            fieldlist.push(con2SingleSQLString(items))
            return true;
          } else {
            //console.log("DDDD")
            fieldlist.push(items.toUpperCase());
            return true;
          }
        }
      }
      
    })

    //console.log('D: ' + JSON.stringify(fieldlist))
    var sqlFilter = fieldlist.join(" ");
    console.log("sqlFilter: "  +  sqlFilter)
    if (sqlFilter !== '') return `(${sqlFilter})`
    else return ' ';
  }

  function genSQLSum(item) {
    let bigOper = item.summaryType.toUpperCase();
    return `${bigOper}(a.${item.selector}) AS '${item.selector}' `;
  }

  function totalsum (sumx) {
    var filterx = JSON.parse(sumx);
    console.log(filterx)
    var fieldlist = []; 
    var singleArray = true;
    filterx.every((items,index)=>{
      if (items.summaryType != 'custom') {
        fieldlist.push(genSQLSum(items))
      }
      return true;
    })
    var sqlFilter = fieldlist.join(", ");
    console.log("sqlFilter: "  +  sqlFilter)
    if (sqlFilter !== '') return `SELECT ${sqlFilter}`
    else return '';
  }

  //******************************************************* */
  console.log("params: " + JSON.stringify(params,false,4)) 
  var ordx = '';
  var filtx = '';
  var limx = '';
  var sumx = '';
  var groupby = '';

  if (('skip' in params) && ('take' in params)) {
    limx  = limitx(params.skip, params.take);
  }
  if ('sort' in params) {
    ordx = orderx(params.sort)
  }
  if ('filter' in params) {
    filtx = filter(params.filter)
  } else {
    filtx = null;
  }
  if ('totalSummary' in params) {
    sumx = totalsum(params.totalSummary)
  }


  var getStrAfterFROM = sql.split('FROM').pop().split('WHERE')[0];
  var getStrAfterWHERE = sql.split('WHERE')[1];
  var getStrBeforeFROM = sql.split('FROM')[0];

  var filterStr = '';
  if (getStrAfterWHERE && getStrAfterWHERE != null) {
    if (filter && filtx != null && filter != '') {
      filterStr += ` WHERE ${getStrAfterWHERE} AND ${filtx}`;
    } else {
      filterStr += ` WHERE ${getStrAfterWHERE} `;
    }
  } else {
    if (filtx && filtx != '') {
      filterStr += ` WHERE ${filtx}`;
    } else {
      filterStr = '';
    }
  }

  console.log(" filterStr: " + filterStr)
  console.log(" getStrAfterFROM: " + getStrAfterFROM)
  
  var primaryKey = Object.keys(this.tm)[0];
  var sqly = ` SELECT COUNT(DISTINCT(a.${primaryKey})) AS "total" FROM ${getStrAfterFROM} ${filterStr}`;
  var sqlz = `${sumx} FROM ${getStrAfterFROM} ${filterStr}`;

  var sqlx = `${getStrBeforeFROM} FROM ${getStrAfterFROM} ${filterStr} ${ordx} ${limx}`;
  var total = 0;
  console.log("sqlx: " + sqlx) 
  console.log("sqly: " + sqly)
   
  connection.query(sqly, function (error, resultA) {
    //console.log("sqly: " + sqly) 
    if (error) { 
      console.log('error')
      throw error 
    } else {
      if (resultA && resultA.length > 0) {
        //console.log(JSON.stringify(resultA, false, 4))
        connection.query(sqlx, function (error, resultB) {
          //console.log("sqlx: " + sqlx) 
          if (error) { 
            console.log('error')
            throw error 
          } else {
            //console.log(resultB) 
            if (resultB && resultB.length > 0) {
              total  = resultA[0].total;
              console.log("total: " + total)
              //console.log(JSON.stringify(resultB, false, 4))
              if (sumx && sumx != null && sumx != '') {
                connection.query(sqlz, function (error, resultC) {
                  //console.log("sqly: " + sqly) 
                  if (error) { 
                    console.log('error')
                    throw error 
                  } else {
                    console.log(resultC)
                    callback(null, {data: resultB, totalCount: total, totalSummary: resultC});
                  }
                })
              } else {
                callback(null, {data: resultB, totalCount: total});
              }
            } else {
              console.log('nothing')
              callback(null, {data: [], totalCount: 0});
            }
          }
        })
      }
    }
  })
}



} //End of module
