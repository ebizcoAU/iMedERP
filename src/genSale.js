function generateRandom(min = 0, max = 100) {
    let difference = max - min;
    let rand = Math.random();
    rand = Math.floor( rand * difference);
    rand = rand + min;
    return rand;
}

var tbls = require('./tables').tbls;
var moment = require('moment');
var tblx = "sale";
var numSales = 10; //Number of Sales per day
var numDays = 730;  //Number of days 365, 730, 1096
const startDate =  moment();

var customers = [];
var agentStaff = [];


function genSaleRec() {
    var sqlTxt = `INSERT INTO sale (dateAdded, customerID, agentStaffID, status) VALUES `;
    var taskRec = []
    for (var i=0; i<numDays; i++) {
        let datex = moment(startDate).subtract((numDays-i), 'days').format("YYYY-MM-DD HH:mm:ss");
        for (var x=0; x < numSales; x++) { 
            let cid = generateRandom(0,customers.length-1);
            let aid = generateRandom(0,agentStaff.length-1);
            let taskx = {
                dateAdded: datex,
                customerID: customers[cid].memberID,
                agentStaffID: agentStaff[aid].memberID,
                status: 0
            };
            taskRec.push(taskx);
        }
    }
    //console.log("salelist: " + JSON.stringify(taskRec, false, 4));
    console.log("Count salelist: " + taskRec.length);
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
    return sqlTxt;
}

    tbls[tblx].execSQL(`
    TRUNCATE TABLE sale;
    TRUNCATE TABLE wallet;
    UPDATE proditem SET saleID = 0, status = 1 WHERE (boxID > 0);
    `, function(error, data) {
        if (error) {
            console.log("error: " + error) ;
        } else {
            //console.log(data)
            var sql0 = `SELECT a.memberID, a.roleID, a.name FROM memberx a WHERE (a.roleID = 3) AND (a.groupID = 2)`; //Select customers
            var sql1 = `SELECT a.memberID, a.roleID, a.name FROM memberx a WHERE (a.roleID = 7) AND (a.groupID = 2)`; //Select agentStaff
            tbls[tblx].execSQL(sql0, function(errora, data) {
                if (errora) {
                    console.log("error: " + errora) ;
                } else {
                    customers = data;
                    console.table(customers)
                    tbls[tblx].execSQL(sql1, function(errorb, datb) {
                        if (errorb) {   
                            console.log("errorb: " + errorb) ;
                        } else {
                            agentStaff = datb;
                            console.table(agentStaff)
                            var sqlTxt = genSaleRec();
                            tbls[tblx].execSQL(sqlTxt, function(errorc, datc) {
                                if (errorc) {
                                    console.log("error: " + errorc) ;
                                } else {
                                    console.log ("Done...")
                                    process.exit();
                                    
                                }
                            })
                        }
                    })
                    
                }
            })
        }
    })




