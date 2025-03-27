
$(() => {

$('#withdraw').html(formatMessage('withdraw'));
var roleID  = parseInt($('#roleid').text());
var name  = $('#name').text();
var phone  = $('#phonevalue').text();
var address  = $('#addressee').text();
var provincesID = parseInt($('#provincesid').text());
var wardsID = parseInt($('#wardsid').text());
var balance = $('#walletvalue').text();
var email = $('#email').text();
var momoAccount = $('#momoaccount').text();
var province = provincesSource.filter(m => m.provincesID ==provincesID)[0].title;
var ward = wardsID > 0 ? wardsSource.filter(m => m.wardsID ==wardsID)[0].title:''; 
if (roleID == 3) {
    address = `${ward} ${province}`;
} else {
    address += `<br/> ${ward} ${province}`;
}
$('.addressex').html(address);	
$('#withdrawrule').html(formatMessage('topuprule'));

$('.balancex').html(`${formatMessage('account')}: ${formatVNcurrency(balance)}`);

$('.momoaccountx').html(`Momo: ${momoAccount}`);
$('.namex').html(name);
$('.emailx').html(email);

var amountValue = 10000;

const topupEntities = [
    { id: 10000, text: '10,000' },
    { id: 20000, text: '20,000' },
    { id: 100000, text: '100,000' },
    { id: 30000, text: '30,000' },
    { id: 50000, text: '50,000' },
    { id: 200000, text: '200,000' },
  ];
var paytypeValue = 1;
var topupGroup = $('#topupx').dxRadioGroup({
    items: topupEntities,
    label:  formatMessage('moneytotopup'),
    valueExpr: 'id',
    displayExpr: 'text',
    layout:'horizontal',
    onValueChanged: function(e) {
        amountValue = e.value;
    }
}).dxRadioGroup('instance');
topupGroup.option('value', topupEntities[0].id);

var amount = $('#amountx').dxNumberBox({
    label:  formatMessage('moneytowithdraw'),
    format: '$ #,##0.##',
    mode: 'number',
    value: 1000000,
    visible: false,
    inputAttr: { 'aria-label': 'Currency Format' },
    min:1000000,
    onChange: function(e) {
        amountValue = amount.option("value");
    }
}).dxNumberBox('instance');
  
$('input[type=radio][name=btnradio]').on("change", function(e) {
    if (this.value == '2') {
        $('#withdrawrule').html(formatMessage('momorule'));
        topupGroup.option("visible", false);	
        amount.option("visible", true);
        paytypeValue = 2;	
    } else {
        $('#withdrawrule').html(formatMessage('topuprule'));	
        topupGroup.option("visible", true);	
        amount.option("visible", false);
        paytypeValue = 1;	
    }
    return false;
});

$('.withdrawBtn').on('click', function(){
    var proceed = false;
    if (amountValue <= balance) {
        if (paytypeValue==2) {
            if (momoAccount.length < 12) {
                screenLog(formatMessage("nomomoaccount"), 'warning');
            }
        } else {
            if (roleID > 4) {
                if (address.length > 8) {
                    if (name.split(" ").length > 1) {
                        if (email.split("@").length > 1) {
                            proceed = true;
                        } else {
                            screenLog(formatMessage("noemail"), 'warning');
                            proceed = false;
                        }
                    } else {
                        screenLog(formatMessage("nonameprovided"), 'warning');
                        proceed = false;
                    }
                } else {
                    screenLog(formatMessage("noaddress"), 'warning');
                    proceed = false;
                }
            } else if (roleID==3) {
                if (wardsID > 0) {
                    proceed = true;
                } else {
                    screenLog(formatMessage("nosuburb"), 'warning');
                    proceed = false;
                }
            }
        }
        if (proceed) {
            var paytypex = paytypeValue;
            var result = false;
            if (paytypex==2){
                result = DevExpress.ui.dialog.confirm(`<i>${formatMessage("requesttowithdraw")} ${formatVNcurrency(amountValue)} ${formatMessage("intomomoaccount")} ${momoAccount} </i>`, `${formatMessage("confirmtoproceed")}?`);
            } else {
                result = DevExpress.ui.dialog.confirm(`<i>${formatMessage("requesttotopup")} ${formatVNcurrency(amountValue)} ${formatMessage("intophonenumber")} ${phone} </i>`, `${formatMessage("confirmtoproceed")}?`);
            }
            result.done(function(dialogResult) {
                if (dialogResult) {
                    $.post(`/savewithdraw`, [
                        {name:'amount', value: amountValue},
                        {name:'paytype', value: paytypex}
                    ], function(data) {
                        if (data.status == 1) { 
                            window.location.href = '/mindex';
                        } else {
                            $('.loginmsg').removeClass('text-soft').addClass('text-danger').html(`${data.message}`);
                        }
                    }, "json");
                }
            });
        }
    } else {
        screenLog(formatMessage("notenoughmoney"), 'warning')

    }
});

function screenLog(msg, typex='info') {
    const message = msg;
    const type = typex;
    toast.option({ message, type });
    toast.show(); 
}

const toast = $('#toast').dxToast({ 
    displayTime: 3000,
    width: 'auto',
    show: {
        type: 'fade',
        duration: 400,
        from: 0,
        to: 1
    },
    hide: {
        type: 'fade',
        duration: 400,
        from: 1,
        to: 0
    }
}).dxToast('instance');

})