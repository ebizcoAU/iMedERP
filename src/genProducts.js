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
const { customAlphabet } = require('nanoid');
var nanoid = customAlphabet('1234567890ABCDEFGHIJKLMNOPQRSTVWXYZabcdefghijklmnopqrstvuwxyz', 8);

var tbls = require('./tables').tbls;
const fs = require('fs');
const csv = require('csv-parser');
var moment = require('moment');
var tblx = "product";
var sqlTxt= '';

const mysql = require('mysql2');

// MySQL Database configuration
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'cableman',
    database: 'c1imed',
});

// Connect to the database
db.connect((err) => {
    if (err) {
        console.error('Database connection error:', err);
        process.exit(1);
    }
    console.log('Connected to the database.');
});


var taskRec;
var product = [];
var batchnum = 0;


const startDate =  moment();

tbls[tblx].execSQL(`
    TRUNCATE TABLE product;
`, function(error, data) {
    if (error) {
        console.log("error: " + error) ;
    } else {
        // Function to parse CSV and convert to array of objects
        const readCSVAndInsertToDB = (filePath) => {
        const results = [];

        fs.createReadStream(filePath)
            .pipe(csv(['productName', 'category', 'costperitem',  'DonViSi', 'DonViLe', 'qtyperBox', 'unitPrice', 'unitPrice2', 'priceID','hoadon', 'Audited', 'typeName', 'typeID', 'categoryID','unitMeasure', 'unitMeasure2', 'accountID', 'unitText']))
            .on('data', (row) => {
                results.push({
                    accountID: row.accountID,
                    groupID: 2,
                    productName: row.productName,
                    categoryID: row.categoryID,
                    typeID: row.typeID,
                    costperitem: row.costperitem,
                    unitMeasure: row.unitMeasure,
                    unitMeasure2: row.unitMeasure2,
                    unitPrice: row.unitPrice,
                    unitPrice2: row.unitPrice2,
                    qtyperBox: row.qtyperBox,
                    barcode: 'ANLOC'+nanoid()
                });
            })
            .on('end', () => {
                console.log('CSV file successfully processed.');
                //console.log(results)
                insertIntoDatabase(results);
            })
            .on('error', (err) => {
                console.error('Error reading the CSV file:', err);
            });
        };

        // Function to insert data into MySQL table
        const insertIntoDatabase = (data) => {
            const sql = `
                INSERT INTO product (accountID, groupID, productName, categoryID, typeID, costperitem, unitMeasure, unitMeasure2, unitPrice, unitPrice2, qtyperbox, barcode )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;

            data.forEach((item) => {
                console.log(item)
                db.query(sql, [
                    item.accountID,
                    item.groupID,
                    item.productName,
                    item.categoryID,
                    item.typeID,
                    item.costperitem,
                    item.unitMeasure,
                    item.unitMeasure2,
                    item.unitPrice,
                    item.unitPrice2,
                    item.qtyperBox,
                    item.barcode
                ], (err) => {
                    if (err) {
                        console.error('Error inserting data:', err);
                    }
                });
            });             

            console.log('Data inserted into the database.');
        };  

        // Run the function with your CSV file
        readCSVAndInsertToDB('product.csv');
    }
})




