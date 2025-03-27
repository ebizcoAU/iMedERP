//*************** Table declaration ****************
const { columnTransformDependencies } = require('mathjs');
var tblconn = require('./tblconn');

var groupx = new tblconn('groupx', {
  groupID: 'integer',
  groupType: 'integer',
  name: 'string',
  abn: 'string',
  address: 'string',
  phone: 'string',
  email: 'string',
  countryID: 'string',
  imgLink: 'string',
  weburl:'string',
  dateAdded: 'string',
  subdir:'string',
  status:'integer',
  referPromo:'string',
  portID: 'integer'
});

var groupxregos = new tblconn('groupxrego', {
  groupxregosID: 'integer',
  groupID: 'integer',
  name: 'string',
  size: 'integer',
  dateAdded:'string'
});

var awardtypes = new tblconn('awardtype', {
  awardtypeID: 'integer',
  country: 'string',
  awardName: 'integer',
  hourlyRate: 'string',
  ratecasual: 'string',
  hourperWeek: 'string',
  rateovertime: 'string',
  rateeveningTime: 'string',
  rateSaturday: 'string',
  rateSunday: 'string',
  ratePublicday: 'string',
  employersuper: 'string',
  employeesuper: 'string',
  unionfee: 'string',
  monthlyWages: 'string',
  weeklyWages: 'string',
  sickLeave: 'string',
  annualLeave: 'string',
  longserviceLeave: 'string',
  status: 'integer',
});
var members = new tblconn('memberx', {
  memberID: 'integer',
  groupID: 'integer',
  parentID: 'integer',
  roleID: 'integer',
  typeID: 'integer',
  divisionID: 'integer',
  consultantID: 'integer',
  name: 'string',
  email: 'string',
  phone: 'string',
  address: 'string',
  wardsID: 'integer',
  provincesID: 'integer',
  phuongID: 'integer',
  pass: 'string',
  dob: 'string',
  abn: 'string',
  awardtypeID: 'integer',
  company: 'string',
  dateAdded: 'string',
  momoAccount: 'string',
  imgLink: 'string',
  themeID: 'integer',
  otp: 'string',
  cccd: 'string',
  cccdfront: 'string',
  cccdback: 'string',
  status: 'integer',
  lastChanged: 'string',
  lastPerson: 'integer',
  refID: 'integer'
});

var memberregos = new tblconn('memberrego', {
  memberregoID: 'integer',
  memberID: 'integer',
  name: 'string',
  size: 'integer',
  dateAdded:'string'
});

var brand = new tblconn('brand', {
  brandID: 'integer',
  groupID: 'integer',
  brandName: 'string',
  logo: 'string',
  website: 'string',
  description: 'string',
  lastChanged: 'string',
  lastPerson: 'integer',
  dateAdded: 'string',
  status:'integer',
});

var category = new tblconn('category', {
  categoryID: 'integer',
  groupID: 'integer',
  categoryName: 'string',
  logo: 'string',
  description: 'string',
  lastChanged: 'string',
  lastPerson: 'integer',
  dateAdded: 'string',
  status:'integer',
});


var illness = new tblconn('illness', {
  illnessID: 'integer',
  groupID: 'integer',
  illness_vi: 'string',
  illness_en: 'string',
  illness_cn: 'string',
  illness_kr: 'string',
  illness_ru: 'string',
  logo: 'string',
  lastChanged: 'string',
  lastPerson: 'integer',
  dateAdded: 'string',
  status:'integer',
});

var symptom = new tblconn('symptom', {
  symptomID: 'integer',
  symptomName: 'string',
  description: 'string',
  lastChanged: 'string',
  lastPerson: 'integer',
  dateAdded: 'string',
  status:'integer',
});

var illnessSymptom = new tblconn('illnessSymptom', {
  illnessSymptomID: 'integer',
  illnessID: 'integer',
  symptomID: 'integer'
});


var toa = new tblconn('toa', {
  toaID: 'integer',
  groupID: 'integer',
  illnessID: 'integer',
  agegroup: 'integer',
  weight: 'integer',
  cough: 'integer',
  headacefever: 'integer',
  stomach: 'integer',
  sleepy: 'integer',
  diabetic: 'integer',
  huyetap: 'integer',
  allergy: 'integer',
  lastChanged: 'string',
  lastPerson: 'integer',
  dateAdded: 'string',
  status:'integer',
  comment: 'string',
  priceoption:'integer',
  toaprice: 'string',
  toacost: 'string'

});

var toaproduct = new tblconn('toaproduct', {
  toaproductID: 'integer',
  toaID: 'integer',
  productID: 'integer',
  qty: 'string'
});


var provinces = new tblconn('provinces', {
  provincesID: 'integer',
  title: 'string',
  provtype: 'integer',
  status: 'integer'
});

var wards = new tblconn('wards', {
  wardsID: 'integer',
  title: 'string',
  wardtype: 'integer',
  provincesID:'integer'
});

var issues = new tblconn('issue', {
  issueID: 'integer',
  groupID: 'integer',
  roleID: 'integer',
  customerID: 'integer',
  issuetypeID: 'integer',
  description: 'string',
  dateAdded: 'string',
  status:'integer'
})
var issuetype = new tblconn('issuetype', {
  issuetypeID: 'integer',
  name: 'string',
  status:'integer'
})
var systeminfo = new tblconn('systeminfo', {
  systeminfoID: 'integer',
  numberofshares: 'integer',
  persharevalue: 'string',
  cashinbank: 'integer',
  email:'string',
  pass:'string',
  bankName:'string',
  BSB: 'string',
  accountNo: 'string',
  accountName: 'string',
  taxfilenumber: 'string',
  GSTVAT: 'string',
  lastChanged: 'string',
  lastPerson: 'integer',
  status: 'integer'
});

var proditems = new tblconn('proditem', {
  proditemID: 'integer',
  prodmanID: 'integer',
  promotionID: 'integer',
  boxID: 'integer',
  saleID: 'integer',
  uuID: 'string',
  refID: 'string',
  urlLink: 'string',
  status: 'integer',
  dateAdded:'string',
  lastChanged: 'string',
  lastPerson: 'integer'
});

var box = new tblconn('box', {
  boxID: 'integer',
  productID: 'integer',
  prodmanID: 'integer',
  palletID: 'integer',
  agentID: 'integer',
  itemQty: 'integer',
  uuID: 'string',
  refID: 'string',
  urlLink: 'string',
  agentreceivedDate: 'string',
  status: 'integer',
  dateAdded:'string',
  lastChanged: 'string',
  lastPerson: 'integer'
});

var pallet = new tblconn('pallet', {
  palletID: 'integer',
  productID: 'integer',
  prodmanID: 'integer',
  uuID: 'string',
  refID: 'string',
  urlLink: 'string',
  boxQty: 'integer',
  status: 'integer',
  dateAdded:'string',
  lastChanged: 'string',
  lastPerson: 'integer'
});

var palletitems = new tblconn('palletitems', {
  palletID: 'integer',
  orderxitemID: 'integer',
});

var stocks = new tblconn('stock', {
  stockID: 'integer',
  productID: 'integer',
  prodmanID: 'integer',
  orderxitemID: 'integer',
  qtyIn: 'integer',
  qtyOut: 'integer',
  unitCost: 'string',
  dateAdded:'string',
  lastChanged: 'string',
  lastPerson: 'integer',
  status: 'integer'
});

var rawstocks = new tblconn('rawstock', {
  rawstockID: 'integer',
  groupID: 'integer',
  rawstockName: 'string',
  refID: 'string',
  description: 'string',
  location: 'string',
  qrcodeID: 'string',
  unitMeasure: 'integer',
  costperitem: 'string',
  stockqty: 'string',
  reorderlevel: 'integer',
  daysperreorder: 'integer',
  itemreorderqty: 'integer',
  itemdiscontinued: 'integer',
  dateAdded:'string',
  lastChanged: 'string',
  lastPerson: 'integer',
  status: 'integer'
});

var rawstockXfer = new tblconn('rawstockXfer', {
  rawstockXferID: 'integer',
  groupID: 'integer',
  rawstockID: 'integer',
  xferType: 'integer',
  refID:'string',
  qty: 'integer',
  itemcost: 'integer',
  incltax: 'boolean',
  vendorID: 'integer',
  vendorItemNo: 'string',
  status: 'integer',
  dateAdded:'string',
  lastChanged: 'string',
  lastPerson: 'integer',
});

var prodformula = new tblconn('prodformula', {
  prodformulaID: 'integer',
  productID: 'integer',
  rawstockID: 'integer',
  qty: 'string',
  status: 'integer',
  dateAdded:'string',
  lastChanged: 'string',
  lastPerson: 'integer',
});


var promotion = new tblconn('promotion', {
  promotionID: 'integer',
  groupID: 'integer',
  name: 'string',
  customerBonus: 'integer',
  agentstaffBonus: 'integer',
  agentBonus: 'integer',
  stockBonus: 'integer',
  diststaffBonus: 'integer',
  startDate: 'string',
  endDate: 'string',
  dateAdded: 'string',
  lastChanged: 'string',
  lastPerson: 'integer',
  status: 'integer',
});

var products = new tblconn('product', {
  productID: 'integer',
  accountID: 'integer',
  promotionID: 'integer',
  groupID: 'integer',
  typeID: 'integer',
  categoryID: 'integer',
  productName: 'string',
  imgLink: 'string',
  imgLink1: 'string',
  imgLink2: 'string',
  imgLink3: 'string',
  imgLink4: 'string',
  imgLink5: 'string',
  description: 'string',
  manprocedure: 'string',
  barcode: 'string',
  unitPrice: 'string',
  unitPrice2: 'string',
  qtyperBox: 'integer',
  qtyperPack: 'integer',
  boxperPallet: 'integer',
  unitMeasure: 'integer',
  unitMeasure2: 'integer',
  costperitem: 'string',
  taxrate: 'string',
  stockqty: 'string',
  countqty: 'string',
  reorderlevel: 'integer',
  daysperreorder: 'integer',
  itemreorderqty: 'integer',
  lastexpiryDate: 'string',
  dateAdded: 'string',
  lastChanged: 'string',
  lastPerson: 'integer',
  status: 'integer',
  lastChanged: 'string'
});

var prodcount = new tblconn('prodcount', {
  prodcountID: 'integer',
  productID: 'integer',
  stockqty: 'string',
  countqty: 'string',
  countedDate: 'string'
});

var productrego = new tblconn('productrego', {
  productregoID: 'integer',
  productID: 'integer',
  name: 'string',
  size: 'integer',
  dateAdded: 'string'
});

var prodformregos = new tblconn('prodformrego', {
  prodformregoID: 'integer',
  productID: 'integer',
  name: 'string',
  size: 'integer',
  dateAdded: 'string'
});

var prodXfer = new tblconn('prodXfer', {
  prodXferID: 'integer',
  productID: 'integer',
  vendorID: 'integer',
  refID:'string',
  qty: 'integer',
  itemcost: 'integer',
  itemcostoem: 'integer',
  gifts: 'boolean',
  incltax: 'boolean',
  expiryDate: 'string',
  prizeaward: 'string',
  status: 'integer',
  dateAdded:'string',
  lastChanged: 'string',
  lastPerson: 'integer',
});


var prodman = new tblconn('prodman', {
  prodmanID: 'integer',
  groupID: 'integer',
  productID: 'integer',
  warehouseID: 'integer',
  description: 'string',
  qty: 'integer',
  unitCost: 'integer',
  manDate: 'string',
  manEnd: 'string',
  expiryDate: 'string',
  dateAdded: 'string',
  lastChanged: 'string',
  lastPerson: 'integer',
  status: 'integer',
});

var warehouses = new tblconn('warehouse', {
  warehouseID: 'integer',
  groupID: 'integer',
  staffname: 'string',
  name: 'string',
  phone: 'string',
  address: 'string',
  wardsID: 'integer',
  provincesID: 'integer',
  phuongID: 'integer',
  dateAdded:'string',
  lastChanged: 'string',
  lastPerson: 'integer',
  status: 'integer',
});

var orderx = new tblconn('orderx', {
  orderxID: 'integer',
  groupID: 'integer',
  distributorID: 'integer',
  salestaffID: 'integer',
  orderNumber: 'string',
  dateConfirmed: 'string',
  dateDispatched: 'string',
  dateCompleted: 'string',
  amount: 'string',
  tax: 'string',
  incltax: 'boolean',
  paytype: 'integer',
  description: 'string',
  dateAdded:'string',
  lastChanged: 'string',
  lastPerson: 'integer',
  status: 'integer',
});

var orderxrego = new tblconn('orderxrego', {
  orderxregoID: 'integer',
  orderxID: 'integer',
  name: 'string',
  size: 'integer',
  dateAdded: 'string'
});

var orderxitem = new tblconn('orderxitem', {
  orderxitemID: 'integer',
  orderxID: 'integer',
  productID: 'integer',
  qty: 'integer',
  unitPrice: 'string',
  description: 'string',
  status: 'integer',
});

var wallets = new tblconn('wallet', {
  walletID: 'integer',
  groupID: 'integer',
  memberID: 'integer',
  saleID: 'integer',
  momorefID: 'string',
  credit: 'string',
  debit:'string',
  paytype:'integer',
  refID: 'string',
  comment: 'string',
  dateAdded:'string',
  lastChanged: 'string',
  lastPerson: 'integer',
  status: 'integer'
});
var diary = new tblconn('diary', {
  diaryID: 'integer',
  staffID: 'integer',
  customerID: 'integer',
  note: 'string',
  dtype: 'integer',
  dateAdded:'string',
  status: 'integer',
  lastChanged: 'string',
  lastPerson: 'integer',
});

var diarymsg = new tblconn('diarymsg', {
  diarymsgID: 'integer',
  diaryID: 'integer',
  note: 'string',
  dateAdded:'string',
  teammemberID: 'integer',
});

var sales = new tblconn('sale', {
  saleID: 'integer',
  groupID: 'integer',
  saleno:'string',
  dateAdded:'string',
  datePaid:'string',
  lastChanged:'string',
  lastPerson: 'integer',
  customerID: 'integer',
  agentStaffID: 'integer',
  amount: 'string',
  tax: 'string',
  status: 'integer',
  imgLink: 'string',
  incltax: 'integer',
  paytype: 'integer',
  description: 'string',
  star: 'integer'
});

var saleitems = new tblconn('saleitems', {
  saleitemsID: 'integer',
  saleID: 'integer',
  productID: 'integer',
  qty: 'string',
  price:'string',
  costperitem: 'string',
  tax: 'string',
  unitMeasure2: 'integer',
  refID: 'integer'
});

var esms = new tblconn('esms', {
  esmsID: 'integer',
  phone: 'string',
  smsText: 'string',
  smsID: 'string',
  dateAdded:'string',
  status: 'integer',
  errorcode: 'integer',
  sendStatus: 'integer',
  telcoid: 'string',
  accountbalance: 'string'
});

var etopup = new tblconn('etopup', {
  etopupID: 'integer',
  provider: 'string',
  topupphone: 'string',
  amount: 'string',
  walletID: 'integer',
  dateAdded:'string',
  status: 'integer',
  errorcode: 'integer'
});

var staffrosters = new tblconn('staffroster', {
  staffrosterID: 'integer',
  memberID: 'integer',
  fromDT: 'string',
  toDT: 'string',
  comment: 'string',
  aux1: 'string',
  aux2: 'integer',
  status: 'integer',
  dateAdded: 'string'
});
var payrolls = new tblconn('payroll', {
  payrollID: 'integer',
  memberID: 'integer',
  fromDT: 'string',
  toDT: 'string',
  amount: 'string',
  allowance: 'string',
  rateperHour: 'string',
  tax: 'string',
  employersuper: 'string',
  employeesuper: 'string',
  unionfee: 'string',
  holidayentitlement: 'string',
  sickentitlement: 'string',
  longentitlement: 'string',
  numHours: 'string',
  totalPaid: 'string',
  includesuper: 'integer',
  payType: 'integer',
  status: 'integer',
  dateAdded: 'string',
  paidDate: 'string',
  lastChanged: 'string',
  lastPerson: 'integer'
});
var payrollitems = new tblconn('payrollitem', {
  payrollitemID: 'integer',
  payrollID: 'integer',
  workDate: 'string',
  numHours: 'string',
  numHours2: 'string',
  paytype2: 'integer',
  startTime: 'string',
  endTime: 'string',
  duration: 'string',
  authorizedID: 'integer',
  status: 'integer',

});
var accounts = new tblconn('account', {
  accountID: 'integer',
  parentID: 'integer',
  accType: 'integer',
  subType: 'integer',
  lastitem: 'integer',
  PLEnabled: 'integer',
  accountName_vi: 'string',
  accountName_en: 'string',
  balance: 'string',
  tax: 'string',
  status: 'integer'
});
var expenses = new tblconn('expenses', {
  expensesID: 'integer',
  groupID: 'integer',
  supplierID: 'integer',
  depreciationID: 'integer',
  accountID: 'integer',
  dateAdded: 'string',
  datePaid: 'string',
  amount: 'string',
  tax: 'string',
  imgLink: 'string',
  status: 'integer',
  paytype: 'integer',
  refID: 'string',
  comment: 'string',
  lastPerson: 'integer',
  lastChanged: 'string'
});
var expensesrego = new tblconn('expensesrego', {
  expensesregoID: 'integer',
  expensesID: 'integer',
  name: 'string',
  size: 'integer',
  dateAdded: 'string'
});

var depreciations = new tblconn('depreciation', {
  depreciationID: 'integer',
  country: 'string',
  depCat: 'integer',
  depName: 'string',
  depMethod: 'integer',
  numYears: 'integer',
  depRate: 'string',
  lastChanged: 'string',
  status: 'integer'
});
var assets = new tblconn('asset', {
  assetID: 'integer',
  groupID: 'integer',
  expensesID: 'string',
  name: 'string',
  depreciationID: 'integer',
  dateAdded: 'string',
  status: 'integer'
});
var assetrego = new tblconn('assetrego', {
  assetregoID: 'integer',
  assetID: 'integer',
  name: 'string',
  size: 'integer',
  dateAdded: 'string'
});
var journals = new tblconn('journal', {
  journalID: 'integer',
  refID: 'string',
  accountID: 'integer',
  groupID: 'integer',
  debits: 'string',
  credits: 'string',
  dateAdded: 'string',
  pDate: 'string'
});

var maintainregos = new tblconn('maintainrego', {
  maintainregoID: 'integer',
  maintainID: 'integer',
  name: 'string',
  size: 'integer',
  dateAdded:'string'
});
var maintains = new tblconn('maintain', {
  maintainID: 'integer',
  groupID: 'integer',
  proditemID: 'integer',
  name: 'string',
  dateAdded: 'string',
  status: 'integer',
  lastPerson: 'integer',
  lastChanged: 'string'
});
var incidentregos = new tblconn('incidentrego', {
  incidentregoID: 'integer',
  incidentID: 'integer',
  name: 'string',
  size: 'integer',
  dateAdded:'string'
});
var incidents = new tblconn('incident', {
  incidentID: 'integer',
  groupID: 'integer',
  name: 'string',
  dateAdded: 'string',
  status: 'integer',
  lastPerson: 'integer',
  lastChanged: 'string'
});
var accinit = new tblconn('accinit', {
  accinitID: 'integer',
  groupID: 'integer',
  accountID: 'integer',
  initbalance: 'string',
  dateAdded: 'string',
  lastPerson: 'integer',
  lastChanged: 'string'
});


var tbls = {
  systeminfo: systeminfo,
  memberx: members,
  category: category,
  brand: brand,
  groupx: groupx,
  
  wards: wards,
  provinces:provinces,
  issue: issues,
  issuetype: issuetype,
  product: products,
  productrego:productrego,
  prodformrego:prodformregos,
  proditem: proditems,
  promotion: promotion,
  prodman: prodman,
  box: box,
  pallet: pallet,
  warehouse: warehouses,
  orderxitem: orderxitem,
  orderx : orderx,
  orderxrego: orderxrego,
  stock : stocks,
  palletitems : palletitems,
  wallet: wallets,
  sale: sales,
  saleitems:saleitems,
  esms: esms,
  etopup:etopup,
  rawstock:rawstocks,
  rawstockXfer: rawstockXfer,
  prodformula:prodformula,
  prodXfer:prodXfer,
  diary:diary,
  diarymsg:diarymsg,
  staffroster:staffrosters,
  payroll:payrolls,
  payrollitem: payrollitems,
  account:accounts,
  expenses: expenses,
  expensesrego:expensesrego,
  depreciation:depreciations,
  asset:assets,
  assetrego: assetrego,
  journal:journals,
  maintain: maintains,
  maintainrego: maintainregos,
  incident:incidents,
  incidentrego:incidentregos,
  awardtype:awardtypes,
  memberrego:memberregos,
  groupxrego: groupxregos,
  illness:illness,
  symptom:symptom,
  toa:toa,
  toaproduct:toaproduct,
  illnessSymptom:illnessSymptom,
  prodcount:prodcount,
  accinit:accinit,
  

  
  


 

};

module.exports = {
  tbls  : tbls
}
