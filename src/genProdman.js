function generateRandom(min = 0, max = 100) {

    // find diff
    let difference = max - min;

    // generate random number 
    let rand = Math.random();

    // multiply with difference 
    rand = Math.floor( rand * difference);
1
    // add with min value 
    rand = rand + min;

    return rand;
}

var tbls = require('./tables').tbls;
var moment = require('moment');
var random = require("node-random");
var tblx = "prodman";
var sqlTxt= '';

const monthnum = 6;
const prodstart = 3;
const prodend = 17;
const prodnum = prodend - prodstart + 1;

const manqty = [2000, 3000]; //lua chon - So luong san xuat moi thang
const orderqty = [100, 200, 300, 500]; //lua chon - So luong mua moi thang
const boxqty = 160  * prodnum; // So luong thung sx/thang
const palletqty = 8 * prodnum; // So luong pallet sx/thang
const groupID = 2;
const warehouseID = 1;


var sql0 = `SELECT a.* FROM product a WHERE (a.groupID = 2) AND ((a.productID >= ${prodstart}) AND (a.productID <= ${prodend}))`;


taskRec = [];

sqlTxt += `INSERT INTO ${tblx} (groupID, productID, warehouseID, batchNum, description, qty, unitCost, manDate, expiryDate, dateAdded, status) VALUES `;

const startDate =  moment();

function genProdman (prod) { //prod = product list, dist= distributor list
    
    for (var i=0; i < monthnum; i++) {
        let mand = moment(startDate).subtract(monthnum-i, 'months');
        let expdt = moment(mand).add(5, 'years').format("YYYY-MM-DD");
        let mandt = mand.format("YYYY-MM-DD")
        prod.forEach(function (p){
            let taskx = {
                'groupID': groupID, 
                'productID': p.productID,
                'warehouseID': warehouseID,
                'batchNum': `MAN${generateRandom(10000,99999)}`,
                'description': `San xuat dầu nhớt động cơ xe..`,
                'qty': p.qtyperBox >= 12 ? manqty[generateRandom(0,2)]:100,
                'unitCost' : p.unitPrice/4,
                'manDate' : mandt,
                'expiryDate': expdt,
                'dateAdded': mandt,
                'status' : 1
            }
            taskRec.push(taskx);
        })
        taskx = { //Add box
            'groupID': groupID, 
            'productID': 1,
            'warehouseID': warehouseID,
            'batchNum': 'N/A',
            'description': `Thung...`,
            'qty': boxqty,
            'unitCost' : 0,
            'manDate' : mandt,
            'expiryDate': expdt,
            'dateAdded': mandt,
            'status' : 1
        }
        taskRec.push(taskx);
        taskx = { //Add pallet
            'groupID': groupID, 
            'productID': 2,
            'warehouseID': warehouseID,
            'batchNum': 'N/A',
            'description': `Pallet`,
            'qty': palletqty,
            'unitCost' : 0,
            'manDate' : mandt,
            'expiryDate': expdt,
            'dateAdded': mandt,
            'status' : 1
        }
        taskRec.push(taskx);
    }
    console.log("taskRec: " + JSON.stringify(taskRec, false, 4));
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
        romTxt = romTxt + ")";
        romList.push(romTxt);
    })
    //console.log("romList: " + JSON.stringify(romList, false, 4));
    sqlTxt += romList.join(",");
    sqlTxt += ";"
  }
    console.log(sql0);
    tbls[tblx].execSQL(`
    TRUNCATE TABLE prodman;
    TRUNCATE TABLE proditem;
    TRUNCATE TABLE box;
    TRUNCATE TABLE pallet; 
    `, function(error, data) {
        if (error) {
            console.log("errorL " + error) ;
        } else {
            console.log(data);
            tbls[tblx].execSQL(sql0, function(errorb, datb) {
                if (errorb) {
                    console.log("error: " + errorb) ;
                } else {
                    genProdman(datb);
                    tbls[tblx].execSQL(sqlTxt, function(errorc, datc) {
                        if (errorc) {
                            console.log("error: " + errorc) ;
                        } else {
                            console.log("Successfully generating records: " + taskRec.length);
                            process.exit()
                        }
                    })
                }
            })
        }
    })




