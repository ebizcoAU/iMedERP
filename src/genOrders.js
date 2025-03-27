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
var tblx = "orderx";
var sqlTxt= '';

const orderqty = [10, 20, 30, 50, 100, 200, 500]; //lua chon - So luong mua moi thang
const orderperday = 5;
const itemperorder = 2;
const groupID = 2;
const distributorID = [5,108];
const salestaffID = [2,4];
const daynum = 2;
const loop = 1;



var taskRec;
var product = [];
var batchnum = 0;


const startDate =  moment();

function genOrderx () { //prod = product list, dist= distributor list
    sqlTxt = `INSERT INTO ${tblx} (groupID, distributorID, salestaffID, dateDispatched, dateConfirmed, dateCompleted, datePaid, isPaid, status) VALUES `; 
    taskRec = [];   
    for (var i=0; i < daynum; i++) {
        let mand = moment(startDate).subtract((daynum*(batchnum+1))-i, 'days');
        let mandt = mand.format("YYYY-MM-DD")
        for (var x=0; x < orderperday; x++) {
            let taskx = {
                'groupID': groupID, 
                'distributorID': distributorID[generateRandom(0,2)],
                'salestaffID': salestaffID[generateRandom(0,2)],
                'dateConfirmed': mandt,
                'dateDispatched': mandt,
                'dateCompleted': mandt,
                'datePaid': mandt,
                'isPaid': 1,
                'status': 4,
            }
            taskRec.push(taskx);
        }
    }
    //console.log("taskRec: " + JSON.stringify(taskRec, false, 4));
    console.log("Count taskRec: " + taskRec.length);
    let romList = [];
    taskRec.some(function(romx){
        //console.log("romx: " + JSON.stringify(Object.values(romx), false, 4));
        let rom = Object.values(romx);
        let romTxt = '(';
        rom.some (function(r){
            if (typeof r === 'string'|| r instanceof String)
            romTxt+= `'${r}',`;
            else   romTxt+= `${r},`;
        })
        //console.log("romTxt: " + romTxt)
        romTxt = romTxt.substring(0, romTxt.length - 1);
        romTxt = romTxt + `)`;
        romList.push(romTxt);
    })
    //console.log("romList: " + JSON.stringify(romList, false, 4));
    sqlTxt += romList.join(",");
    sqlTxt += ";"
    //console.log(sqlTxt);
    return sqlTxt;
  }

  let fn = function genOrderxitems(dat) {
    return new Promise(function(resolve, reject) {
      let sql="";
      for (var i=0; i < itemperorder; i++) {
        let productidx = product[generateRandom(0,product.length)].productID;
        let unitPricex = product.filter(f=>f.productID==productidx)[0].unitPrice;
        sql += `INSERT INTO orderxitem(orderxID, productID, qty, unitPrice, status) VALUES (${dat.orderxID}, ${productidx}, ${orderqty[generateRandom(0,6)]}, ${unitPricex}, 1 ); `;
      }
      //console.log(sql)
      tbls["orderxitem"].execSQL(sql, function(error, data) {
        if (error) { resolve(0) ;
        } else {
            sql = `SELECT SUM(a.qty * a.unitPrice * b.qtyperBox) AS 'amount', ROUND(SUM(a.unitPrice*a.qty* b.qtyperBox*c.taxrate)) AS 'tax', a.orderxID `;
            sql += ` FROM orderxitem a, product b, category c WHERE (a.orderxID = ${dat.orderxID}) `;
            sql += ` AND (a.productID=b.productID) AND (b.categoryID=c.categoryID) GROUP BY a.orderxID`;
            tbls["orderxitem"].execSQL(sql, function(error, datx) {
                if (error) { resolve(0) ;
                } else {
                    let datb = Object.values(JSON.parse(JSON.stringify(datx)));
                    //console.log(datb)
                    sql = `UPDATE orderx SET orderNumber=CONCAT('MOT',${dat.orderxID}), amount='${datb[0].amount}', tax='${datb[0].tax}'  WHERE (orderxID = ${dat.orderxID}) `;
                    tbls["orderxitem"].execSQL(sql, function(error, data) {
                        if (error) { resolve(0) ;
                        } else {
                            resolve(1);
                        }
                    })
                }
            })
        }
      })
    })
  }

    
    tbls[tblx].execSQL(`
    TRUNCATE TABLE orderx;
    TRUNCATE TABLE orderxitem;
    `, function(error, data) {
        if (error) {
            console.log("error: " + error) ;
        } else {
            sql0 = `SELECT a.*, b.taxrate FROM product a, category b WHERE (a.productID > 2) AND (a.categoryID=a.categoryID)`;
            tbls[tblx].execSQL(sql0, function(errorb, data) {
                if (errorb) {
                    console.log("error: " + errorb) ;
                } else {
                    product = Object.values(JSON.parse(JSON.stringify(data)));
                    //console.log(product)
                    genData();
                    let timer = setInterval(function () {
                        batchnum++;
                        if (batchnum < loop) {
                            genData();
                        } else {
                            clearInterval(timer);
                            process.exit();
                        }
                    }, 3000);

                    function genData() {
                        let sqlTxtO = genOrderx();
                        tbls[tblx].execSQL(sqlTxtO, function(errorc, datc) {
                            if (errorc) {
                                console.log("error: " + errorc) ;
                            } else {
                                console.log("Successfully generating orderx: " + taskRec.length);
                                sql0 = `SELECT * FROM orderx LIMIT ${orderperday*daynum} OFFSET ${batchnum*orderperday*daynum}`;
                                console.log(sql0);
                                tbls[tblx].execSQL(sql0, function(errorc, orderx) {
                                    if (errorc) {
                                        console.log("error: " + errorc) ;
                                    } else {
                                        actions = orderx.map(fn);
                                        results = Promise.all(actions).then( function (d1) {
                                            console.log('Batch ID: '  + (batchnum+1))
                                        })
                                    }
                                })
                                
                            }
                        })
                    }
                }
            })
        }
    })




