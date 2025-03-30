const rolexSource = [
    { status: 1, statext: formatMessage('directorboard') },
    { status: 4, statext: formatMessage('distributor') },
    { status: 6, statext: formatMessage('agent') },
];
const manDivisionSource = [
    { status: 1, statext: formatMessage('manstaff') },
    { status: 2, statext: formatMessage('accstaff') },
    { status: 3, statext: formatMessage('salemantaff') },
    { status: 4, statext: formatMessage('salestaff') },
    { status: 5, statext: formatMessage('storeman') },
    { status: 6, statext: formatMessage('techstaff') },
    { status: 7, statext: formatMessage('manman') },
];

const agentDivisionSource = [
    { status: 1, statext: formatMessage('agentadmin') },
    { status: 2, statext: formatMessage('agentman') },
    { status: 3, statext: formatMessage('agentstaff') },

];
const adminDivisionSource = [
    { status: 1, statext: formatMessage('superadmin') },
    { status: 2, statext: formatMessage('investor') },
];
const supplierDivisionSource = [
    { status: 1, statext: formatMessage('private') },
    { status: 2, statext: formatMessage('government') }
];
const statusSource = [
    { status: 0, statext: formatMessage('inactive') },
    { status: 1, statext: formatMessage('active') },
    { status: -1, statext: formatMessage('locked') },
];
const statusSource2 = [
    { status: 0, statext: formatMessage('inactive') },
    { status: 1, statext: formatMessage('active') },
    { status: -1, statext: formatMessage('reordering') }
];
const statusSource3 = [
    { status: 0, statext: formatMessage('StockIn') },
    { status: 1, statext: formatMessage('StockOut') }
];
const diarySource = [
    { status: 0, statext: formatMessage('propose') },
    { status: 1, statext: formatMessage('checked') },
    { status: 2, statext: formatMessage('important') },
    { status: 3, statext: formatMessage('closed') },
    { status: 4, statext: formatMessage('noaction') },
];
const esmsstatusSource = [
    { status: 0, statext: formatMessage('success') },
    { status: 1, statext: formatMessage('failed') },
];
const esmsSource = [
    { status: -1, statext: formatMessage('esms_1') },
    { status: -2, statext: formatMessage('esms_2') },
    { status: -3, statext: formatMessage('esms_3') },
    { status: -4, statext: formatMessage('esms_4') },
    { status: -5, statext: formatMessage('esms_5') },
    { status: -6, statext: formatMessage('esms_6') },
    { status: -7, statext: formatMessage('esms_7') },
    { status: -8, statext: formatMessage('esms_8') },
    { status: -9, statext: formatMessage('esms_9') },
    { status: -10, statext: formatMessage('esms_10') },
    { status: -11, statext: formatMessage('esms_11') },
    { status: -12, statext: formatMessage('esms_12') },
    { status: -13, statext: formatMessage('esms_13') },
    { status: -14, statext: formatMessage('esms_14') },
    { status: -16, statext: formatMessage('esms_16') },
    { status: -18, statext: formatMessage('esms_18') },
    { status: -19, statext: formatMessage('esms_19') },
    { status: -20, statext: formatMessage('esms_20') },
    { status: -21, statext: formatMessage('esms_21') },
    { status: -22, statext: formatMessage('esms_22') },
    { status: -23, statext: formatMessage('esms_23') }
    
];

const topupSource = [
    { status: 0, statext: formatMessage('topup_0') },
    { status: 1, statext: formatMessage('topup_1') },
    { status: 2, statext: formatMessage('topup_2') },
    { status: 3, statext: formatMessage('topup_3') },
    { status: 4, statext: formatMessage('topup_4') },
    { status: 5, statext: formatMessage('topup_5') },
    { status: 6, statext: formatMessage('topup_6') },
    { status: 7, statext: formatMessage('topup_7') },
    { status: 8, statext: formatMessage('topup_8') },
    { status: 9, statext: formatMessage('topup_9') },
    { status: 10, statext: formatMessage('topup_10') },
    { status: 11, statext: formatMessage('topup_11') },
    { status: 13, statext: formatMessage('topup_13') },
    { status: 14, statext: formatMessage('topup_14') }
];

const availableSource = [
    { status: 0, statext: formatMessage('stockavailable') },
    { status: 1, statext: formatMessage('nostock') },
    { status: 2, statext: formatMessage('stockdispatched') }
];

const qrcodeSource = [
    { status: 0, statext: formatMessage('inactive') },
    { status: 1, statext: formatMessage('active') },
    { status: 2, statext: formatMessage('activated') }
];

const orderxSource = [
    { status: 0, statext: formatMessage('propose') },
    { status: 1, statext: formatMessage('ready') },
    { status: 2, statext: formatMessage('completed') }
];

const progressSource = [
    { status: 0, statext: formatMessage('propose') },
    { status: 1, statext: formatMessage('confirmed') },
    { status: 2, statext: formatMessage('ready') },
    { status: 3, statext: formatMessage('shipped') },
    { status: 4, statext: formatMessage('completed') }
];

const purchasexSource = [
    { status: 0, statext: formatMessage('propose') },
    { status: 1, statext: formatMessage('reordering') },
    { status: 2, statext: formatMessage('completed') }
];

const payrollSource = [
    { status: 0, statext: formatMessage('propose') },
    { status: 1, statext: formatMessage('ready') },
    { status: 2, statext: formatMessage('fullypaid') }
];

const manSource = [
    { status: 0, statext: formatMessage('propose') },
    { status: 1, statext: formatMessage('issueqrcode') },
    { status: 2, statext: formatMessage('ready') },
    { status: 3, statext: formatMessage('inproduction') },
    { status: 4, statext: formatMessage('completed') },
    { status: 5, statext: formatMessage('instock') }
];

const countrySource = [
    { status: 'AU', statext: "AUSTRALIA" },
    { status: 'VN', statext:"VIETNAM" }
];


const yesnoSource = [
    { status: 0, statext: formatMessage('no')},
    { status: 1, statext: formatMessage('yes')}
];
const paySource = [
    { status: 1, statext: formatMessage('topupphone')},
    { status: 2, statext: 'MomoPay'}
];

const roleSource = [
    { status: 0, statext: 'SuperAdmin'},
    { status: 1, statext: formatMessage('admin')},
    { status: 2, statext: formatMessage('manstaff')},
    { status: 3, statext: formatMessage('customer')},
    { status: 4, statext: formatMessage('distributor')},
    { status: 5, statext: formatMessage('diststaff')},
    { status: 6, statext: formatMessage('agent')},
    { status: 7, statext: formatMessage('agestaff')},
    { status: 8, statext: formatMessage('supplier')}
];

const unitmeasureSource = [
    { status: 1, statext: formatMessage('box')},
    { status: 2, statext: formatMessage('block')},
    { status: 3, statext: formatMessage('tube')}, //tuyp boi
    { status: 4, statext: formatMessage('bag')},//Gói
    { status: 5, statext: formatMessage('bottle')}, //Lọ
    { status: 6, statext: formatMessage('jar')}, //hũ
    { status: 7, statext: formatMessage('piece')}, //cái
    { status: 8, statext: formatMessage('roll')}, //cuộn
    { status: 9, statext: formatMessage('stick')}, //que
    { status: 10, statext: formatMessage('bottleliquid')}, //chai
    { status: 11, statext: formatMessage('carton')} //Thùng
];
const unitmeasureSource2 = [
    { status: 1, statext: formatMessage('tablet')}, //vien
    { status: 2, statext: formatMessage('tube2')}, //ong
    { status: 3, statext: formatMessage('tube')}, //tuyp
    { status: 4, statext: formatMessage('bag')}, //goi
    { status: 5, statext: formatMessage('box')}, //Hộp
    { status: 6, statext: formatMessage('roll')}, //cuộn
    { status: 7, statext: formatMessage('bottle')}, //chai
    { status: 8, statext: formatMessage('pad')}, //Miếng
    { status: 9, statext: formatMessage('piece')}, //cái
    { status: 10, statext: formatMessage('bottleliquid')}, //chai
    { status: 11, statext: formatMessage('packet')}, //vi
];
const unitmeasureSource2x = [
    { status: 1, statext: 'vien'}, //vien
    { status: 2, statext: 'ong'}, //ong
    { status: 3, statext: 'tuyp'}, //tuyp
    { status: 4, statext: 'goi'}, //goi
    { status: 5, statext: 'hop'}, //Hộp
    { status: 6, statext: 'cuon'}, //cuộn
    { status: 7, statext: 'chai'}, //chai
    { status: 8, statext: 'mieng'}, //Miếng
    { status: 9, statext: 'cai'}, //cái
    { status: 10, statext: 'chai'}, //chai
    { status: 11, statext: 'vi'} //vi
];
const typeSource = [
    { status: 1, statext: formatMessage('mednoprescript'), statext2: formatMessage('lmednoprescript'), imglink: './assets/img/icon/medicine.svg' }, 
    { status: 2, statext: formatMessage('medprescript'), statext2: formatMessage('lmedprescript'), imglink: './assets/img/icon/lab-test.svg' }, 
    { status: 3, statext: formatMessage('supplementfood'), statext2: formatMessage('lsupplementfood'), imglink: './assets/img/icon/food-nutrition.svg' }, 
    { status: 4, statext: formatMessage('tradmed'), statext2: formatMessage('ltradmed'), imglink: './assets/img/icon/supplements.svg'}, 
    { status: 5, statext: formatMessage('medkit'), statext2: formatMessage('lmedkit'), imglink: './assets/img/icon/health-care.svg'},
    { status: 6, statext: formatMessage('cosmetic'), statext2: formatMessage('lcosmetic'), imglink: './assets/img/icon/medical-supplies.svg'},
    { status: 7, statext: formatMessage('monprescript'), statext2: formatMessage('lmonprescript'), imglink: './assets/img/icon/beauty-care.svg'},
    { status: 8, statext: formatMessage('sexualwellness'), statext2: formatMessage('lsexualwellness'), imglink: './assets/img/icon/sexual.svg'}, 
    { status: 9, statext: formatMessage('fitness'), statext2: formatMessage('lfitness'), imglink: './assets/img/icon/fitness.svg'}, 
    { status: 10, statext: formatMessage('babymomcare'), statext2: formatMessage('lbabymomcare'), imglink: './assets/img/icon/baby-mom-care.svg'}, 
    { status: 11, statext: formatMessage('medequip'), statext2: formatMessage('lmedequip'), imglink: './assets/img/icon/medical-equipements.svg'},
    { status: 12, statext: formatMessage('petcare'), statext2: formatMessage('lpetcare'), imglink: './assets/img/icon/pet-care.svg'}
];

const unitweightSource = [
    { status: 0, statext: 'Kg'},
    { status: 1, statext: 'Litre'},
    { status: 2, statext: formatMessage('each')},
    { status: 3, statext: formatMessage('box')}
   
];
const unitweightMinSource = [
    { status: 0, statext: 'gr (gram)'},
    { status: 1, statext: 'ml (milliLitre)'},
    { status: 2, statext: formatMessage('each')},
    { status: 3, statext: formatMessage('box')}
   
];

const paidStatus = [
    { status: 0, statext: formatMessage('notpaidyet')},
    { status: 1, statext: formatMessage('fullypaid')},
]

const paytypeDataSource = [
    { status: 0, statext: formatMessage('cash')},
    { status: 1, statext: formatMessage('bankxfer')},
    { status: 2, statext: formatMessage('creditcrd')},

]

const paytypeSource = [
    { status: 0, statext: formatMessage('overtime'), factor: 1.3},
    { status: 1, statext: formatMessage('publicholiday'), factor: 2.0}
]

const depreciationSource = [
    { status: 0, statext: formatMessage('depshort'), factor: 1.0},
    { status: 1, statext: formatMessage('depshort5'), factor: 0.20},
    { status: 2, statext: formatMessage('deplong10'), factor: 0.10},
]

const priceIndexSource = [
    { status: 0, statext: formatMessage('priceindex')+'1.1', factorSi: 1.05, factorLe: 1.1},
    { status: 1, statext: formatMessage('priceindex')+'1.2', factorSi: 1.07, factorLe: 1.2},
    { status: 2, statext: formatMessage('priceindex')+'1.3', factorSi: 1.09, factorLe: 1.3},
    { status: 3, statext: formatMessage('priceindex')+'1.4', factorSi: 1.11, factorLe: 1.4},
    { status: 4, statext: formatMessage('priceindex')+'1.5', factorSi: 1.13, factorLe: 1.5},
    { status: 5, statext: formatMessage('priceindex')+'1.6', factorSi: 1.15, factorLe: 1.6},
    { status: 6, statext: formatMessage('priceindex')+'1.7', factorSi: 1.17, factorLe: 1.7},
    { status: 7, statext: formatMessage('priceindex')+'1.8', factorSi: 1.19, factorLe: 1.8},
    { status: 8, statext: formatMessage('priceindex')+'1.9', factorSi: 1.21, factorLe: 1.9},
    { status: 9, statext: formatMessage('priceindex')+'2.0', factorSi: 1.23, factorLe: 2.0},
    { status: 10, statext: formatMessage('priceindex')+'2.5', factorSi: 1.33, factorLe: 2.5},
    { status: 11, statext: formatMessage('priceindex')+'3.00', factorSi: 1.43, factorLe: 3.00},
    { status: 12, statext: formatMessage('priceindex')+'3.50', factorSi: 1.53, factorLe: 3.50},
    { status: 13, statext: formatMessage('priceindex')+'4.00', factorSi: 1.63, factorLe: 4.00},
    { status: 14, statext: formatMessage('priceindex')+'4.50', factorSi: 1.73, factorLe: 4.50},
    { status: 15, statext: formatMessage('priceindex')+'5.00', factorSi: 1.83, factorLe: 5.00},
    { status: 16, statext: formatMessage('priceindex')+'6.00', factorSi: 2.03, factorLe: 6.00},
    { status: 17, statext: formatMessage('priceindex')+'7.00', factorSi: 2.23, factorLe: 7.00},
    { status: 18, statext: formatMessage('priceindex')+'8.00', factorSi: 2.43, factorLe: 8.00},
    { status: 19, statext: formatMessage('priceindex')+'9.00', factorSi: 2.63, factorLe: 9.00},
    { status: 20, statext: formatMessage('priceindex')+'10.00', factorSi: 2.83, factorLe: 10.00},
    { status: 21, statext: formatMessage('priceindex')+'12.00', factorSi: 3.23, factorLe: 12.00},
    { status: 22, statext: formatMessage('priceindex')+'15.00', factorSi: 3.03, factorLe: 15.00},
]

const ageSource = [
    { ageid: 0, statext: formatMessage('adult')},
    { ageid: 1, statext: formatMessage('teanager')}, 
    { ageid: 2, statext: formatMessage('children')}, 
    { ageid: 3, statext: formatMessage('baby')}, 
];

const weightSource = [
    { weightid: 1, ageid:3, statext: formatMessage('wl12kg')}, 
    { weightid: 2, ageid:3, statext: formatMessage('w12kg')}, 
    { weightid: 3, ageid:2, statext: formatMessage('w12kg')}, 
    { weightid: 4, ageid:2, statext: formatMessage('w18kg')}, 
    { weightid: 5, ageid:2, statext: formatMessage('w25kg')},
    { weightid: 6, ageid:2, statext: formatMessage('w35kg')},
    { weightid: 7, ageid:2, statext: formatMessage('w45kg')},
    { weightid: 8, ageid:2, statext: formatMessage('w60kg')},
    { weightid: 9, ageid:2, statext: formatMessage('w75kg')},
    { weightid: 10, ageid:1, statext: formatMessage('w35kg')},
    { weightid: 11, ageid:1, statext: formatMessage('w45kg')},
    { weightid: 12, ageid:1, statext: formatMessage('w60kg')},
    { weightid: 13, ageid:1, statext: formatMessage('w75kg')},
    { weightid: 14, ageid:0, statext: formatMessage('w35kg')},
    { weightid: 15, ageid:0, statext: formatMessage('w45kg')},
    { weightid: 16, ageid:0, statext: formatMessage('w60kg')},
    { weightid: 17, ageid:0, statext: formatMessage('w75kg')}
];

  const coughSource = [
    { status: 0, statext: '---'},
    { status: 1, statext: formatMessage('drycough')},
    { status: 2, statext: formatMessage('mucuscough')}
  ];
  const choiceSource = [
    { status: 0, statext: '---'},
    { status: 1, statext: formatMessage('choiceno')},
    { status: 2, statext: formatMessage('choiceyes')}
  ];
  const choiceSource1 = [
    { status: 0, statext: formatMessage('choiceno')},
    { status: 1, statext: formatMessage('choiceyes')}
  ];
  const priceSource = [
    { status: 0, statext: formatMessage('budget')},
    { status: 1, statext: formatMessage('standard')},
    { status: 2, statext: formatMessage('premium')}
  ];

  const customerStatusSource = [
    { status: 0, statext: "INACTIVE" },
    { status: 1, statext:"ACTIVE" }
  ];



  