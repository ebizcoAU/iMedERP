function generateRandom(min = 0, max = 100) {
    // find diff
    let difference = max - min;
    // generate random number 
    let rand = Math.random();
    // multiply with difference 
    rand = Math.floor( rand * difference);
    // add with min value 
    rand = rand + min;
    return rand;
}

var tbls = require('./tables').tbls;
var moment = require('moment');
var tblx = "prodman";
var bc = 0;  //box count
var pc = 0;  //pallet count
var cmfunc = require('./cmfunc');
var datm;
var datn;
//************************************************************** */
var fn2 = function updateStockInventory(prodman){
    return new Promise(function(resolve, reject) {
        var sql0 = '';
        var sql = `SELECT SUM(a.boxQty) AS 'qty', a.productID FROM pallet a WHERE (a.status=1) AND (a.prodbatchID=${prodman.prodmanID})`;
        console.log("sql22: " + sql)
        tbls[tblx].execSQL(sql, function(error, datb) {
            if (error) {  reject(error);
            } else {
               if (datb.length > 0) {
                    tbls['stock'].find({'prodmanID':prodman.prodmanID}, function(errora, data) {
                        if (errora) {  reject(errora);
                        } else {
                            if (data.length > 0) {
                                var sql = `UPDATE stock SET qtyIn=${datb[0].qty}, unitCost = '${prodman.unitCost}' WHERE (a.stockID=${data.stockID});`;
                                sql += `UPDATE prodman a SET a.status=4 WHERE (a.prodmanID=${prodman.prodmanID});`;
                                console.log(cmfunc.getTimeStamp()  + ", sql: " + sql);
                                tbls[tblx].execSQL(sql, function(errorc, datc) {
                                    if (errorc) {  reject(errorc);
                                    } else {
                                        resolve(datc);
                                    }
                                })
                            } else {
                                var sql = `INSERT INTO stock (prodmanID, productID, qtyIn, batchNum, unitCost) VALUES (${prodman.prodmanID}, ${prodman.productID}, ${datb[0].qty}, '${prodman.batchNum}', '${prodman.unitCost}');`;
                                sql += `UPDATE prodman a SET a.status=4 WHERE (a.prodmanID=${prodman.prodmanID});`;
                                console.log(cmfunc.getTimeStamp() + ", sqlx: " + sql);
                                tbls[tblx].execSQL(sql, function(errord, datd) {
                                    if (errord) {  reject(errord);
                                    } else {
                                        resolve(datd);
                                    }
                                })
                            }
                        }
                    })
               } else {
                    reject(0);
               } 
                
            }
        })
    })
}
var fn1 = function getBox(prodman){
    return new Promise(function(resolve, reject) {
        var sql0 = '';
        var sql = `SELECT a.* FROM box a WHERE (a.status=1) AND (a.prodbatchID=${prodman.prodmanID})`;
        tbls[tblx].execSQL(sql, function(error, data) {
            if (error) {  reject(error);
            } else {
                var a = 0;
                //console.log("boxID length: " + datm.length)
                //console.log("palletID length: " + datn.length)
                console.log("prodmanID: " + prodman.prodmanID)
                console.log("box length: " + data.length)
                for (var i=0;  i < data.length; i++) {
                    //console.log("i: " + i, "a: " + a, "boxperPallet: " + prodman.boxperPallet )
                    if ((data.length - (prodman.boxperPallet * a)) > prodman.boxperPallet) {
                        if (((i%prodman.boxperPallet)==0) && (i>0)) {
                            let sql1 = `UPDATE box SET palletID=${datn[pc].palletID}, status=1 WHERE (boxID >= ${data[i].boxID - prodman.boxperPallet}) AND (boxID < ${data[i].boxID});` ;
                            sql1 += `UPDATE pallet SET status=1, productID=${prodman.productID}, boxQty=${prodman.boxperPallet}, prodbatchID=${prodman.prodmanID} WHERE (palletID = ${datn[pc].palletID});` ;
                            a++;
                            pc++;
                            sql0 += sql1;
                            if (prodman.prodmanID==1)  console.log(cmfunc.getTimeStamp()  + ", sql1: " + sql1)
                        }
                    } else {
                        let sql1 = `UPDATE box SET palletID=${datn[pc].palletID}, status=1 WHERE (boxID >= ${data[i].boxID-1}) AND (boxID < ${data[i].boxID + data.length - i});` ;
                        sql1 += `UPDATE pallet SET status=1, productID=${prodman.productID}, boxQty=${i>0?(data.length - i+1):data.length - i}, prodbatchID=${prodman.prodmanID} WHERE (palletID = ${datn[pc].palletID});` ;
                        sql0 += sql1;
                        pc++;
                        if (prodman.prodmanID==1)  console.log(cmfunc.getTimeStamp()  + ", sql1xxxxx: " + sql1)
                        break;
                    }
                        
                }
                if (data.length > 0) {
                    tbls[tblx].execSQL(sql0, function(error, data) {
                        if (error) {  reject(error);
                        } else {
                            resolve(data);
                        }
                    })
                } else {
                    resolve(1)
                }
            }
        })
    })
}
var fn = function getProditem(prodman){
    return new Promise(function(resolve, reject) {
        var sql0 = '';
        var sql = `SELECT a.* FROM proditem a WHERE (a.status=0) AND (a.prodmanID=${prodman.prodmanID})`;
        //console.log("sql: " + sql)
        tbls[tblx].execSQL(sql, function(error, data) {
            if (error) {  
                console.log("ERROR: " + error);
                reject(error);
            } else {
                var a = 0;
                //console.log("boxID length: " + datm.length)
                //console.log("palletID length: " + datn.length)
                console.log("prodmanID: " + prodman.prodmanID)
                console.log("proditem length: " + data.length)
                for (var i=0;  i < data.length; i++) {
                    //console.log("i: " + i, "a: " + a, "qtyperBox: " + prodman.qtyperBox )
                    if ((data.length - (prodman.qtyperBox * a)) >= prodman.qtyperBox) {
                        if (((i+1)%prodman.qtyperBox)==0){
                            let sql1 = `UPDATE proditem SET boxID=${datm[bc].boxID}, status=1 WHERE (proditemID >= ${data[i].proditemID - prodman.qtyperBox}) AND (proditemID < ${data[i].proditemID });` ;
                            sql1 += `UPDATE box SET status=1, productID=${prodman.productID}, itemQty=${prodman.qtyperBox}, prodbatchID=${prodman.prodmanID}  WHERE (boxID = ${datm[bc].boxID});` ;
                            sql0 += sql1;
                            a++;
                            bc++;
                            if (prodman.productID==4) console.log(cmfunc.getTimeStamp() + ", sql0: " + sql1)
                        }
                    } else {
/*
                        let sql1 = `UPDATE proditem SET boxID=${datm[bc].boxID}, status=1 WHERE (proditemID >= ${data[i].proditemID-1}) AND (proditemID < ${data[i].proditemID + data.length - i});` ;
                        sql1 += `UPDATE box SET status=1, productID=${prodman.productID}, itemQty=${data.length - i - prodman.qtyperBox + 1}, prodbatchID=${prodman.prodmanID} WHERE (boxID = ${datm[bc].boxID});` ;
                        sql0 += sql1;
                        bc++;
                        a++;
                        console.log(cmfunc.getTimeStamp()  + ", sql0xxxxx: " + sql1)
                        break;
*/                        
                        break;    
                    } 
                }
                console.log("box generated: " + a)
                if (data.length > 0) {
                    tbls[tblx].execSQL(sql0, function(error, datc) {
                        if (error) {  reject(error);
                        } else {
                            resolve(datc);
                        }
                    })
                } else {
                    resolve(1)
                }
            }
        })
    })
}

    tbls[tblx].execSQL(`
    TRUNCATE TABLE stock;
    UPDATE proditem SET boxID = 0, status = 0;
    UPDATE box SET  prodbatchID = 0, productID = 0,palletID = 0, status = 0;
    UPDATE pallet SET prodbatchID = 0, productID = 0, status = 0;
    `, function(error, data) {
        if (error) {
            console.log("error: " + error) ;
        } else {
            //console.log(data)
            var sql0 = `SELECT a.*, b.qtyperBox, b.boxperPallet, b.productName FROM prodman a, product b WHERE (a.groupID = 2) AND (a.productID = b.productID) AND (a.productID > 2)`;
            tbls[tblx].execSQL(sql0, function(errorb, data) {
                if (errorb) {
                    console.log("error: " + errorb) ;
                } else {
                    var sql1 = `SELECT a.* FROM box a WHERE (a.status=0) ORDER BY a.boxID `;
                    tbls[tblx].execSQL(sql1, function(errorx, datx) {
                        if (errorx) {   console.log("errorx: " + errorx) ;
                        } else {
                            datm = datx;
                            var sql2 = `SELECT a.* FROM pallet a WHERE (a.status=0) ORDER BY a.palletID`;
                            tbls[tblx].execSQL(sql2, function(errory, daty) {
                                if (errory) {   console.log("errory: " + errory) ;
                                } else {
                                    datn = daty;
                                    //console.table(data)
                                    var actions = data.map(fn);
                                    var results = Promise.all(actions).then( function (da1) {
                                        console.log("Connect proditems into box");
                                        var actions1 = data.map(fn1);
                                        var results1 = Promise.all(actions1).then( function (da2) {
                                            console.log("Connect boxes into pallet ");
                                            var actions2 = data.map(fn2);
                                            var results2 = Promise.all(actions2).then( function (da3) {
                                                console.log("Update stock inventory ");
                                                process.exit()
                                            })
                                        })
                                    })
                                    
                                }
                            })
                        }
                    })
                    
                }
            })
        }
    })




