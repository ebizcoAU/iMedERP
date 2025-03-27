
$(() => {

$('#addmember').html(formatMessage('addmember'));
$('#invitedcustomer').html(`${formatMessage('invitedcustomer')} &nbsp;&nbsp;`);
var name  = $('#name').text();
var company  = $('#company').text();
var subdir  = $('#subdir').text();
var weburl  = $('#weburl').text();
var memberID  = $('#memberid').text();
var cryptoID  = $('#cryptoid').text();
var roleID  = parseInt($('#roleid').text());
var roleIDx = 3;
$('.namex').html(`${name}`);
var rolesSource;
switch (roleID) {
case 1:
    roleIDx = 4;
    break;
case 2:
    break;
case 3:
    roleIDx = 3;
    break; 
case 4:
    roleIDx = 5;
    break;
case 5:
    roleIDx = 6;
    break;
case 6:
    roleIDx = 7;
    break;        
default:
    roleIDx = 3;
    break;    
}

$('.uuid').html(`ID: ${subdir}${memberID.toString().padStart(5, '0')}`);

if ((roleID !== 3) && (roleID !== 7)) {
    $("#namex").dxTextBox({
        label:  formatMessage('customername'),
        stylingMode: 'outline',
        labelMode: 'floating',
    }).dxValidator({
        validationRules: [{
        type: 'required',
        message: formatMessage('infomustbefilled'),
        }],
    });

    $("#phonex").dxTextBox({
        label:  formatMessage('contactphone'),
        stylingMode: 'outline',
        labelMode: 'floating',
    }).dxValidator({
        validationRules: [{
        type: 'required',
        message: formatMessage('infomustbefilled'),
        }],
    });
}

$('input[type=radio][name=btnradio]').on("change", function(e) {
    roleIDx = this.value;
    return false;
});

$('.loginmsg').dxValidationSummary({ });

$('#profileForm1').on('submit', (e) => {
    function onClick () {
        navigator.clipboard
        .writeText(document.getElementById("introlink").innerText)
        .then(
            (success) => console.log("text copied"),
            (err) => console.log("error copying text")
        );
        e.preventDefault();
    }
    if ((roleID ==  3) || (roleID ==7)) {
        $('.referralinstruction').html(`
            <p class="text-dark">${formatMessage('referralinstruction')} ${formatMessage('referralinstruction2')}</p>
            <text class="text-soft" id="introlink">${weburl}/referral?id=${cryptoID}</text>
        `);
        let btn = document.createElement("button");
        btn.className = 'btn btn-light btn-sm';
        btn.innerHTML = "Copy";
        btn.name = "copyx";
        btn.addEventListener("click", onClick, false);
        $('.referralinstruction')[0].appendChild(btn);
        
    } else {
        var phone = $("#phonex").dxTextBox('instance');
        var name = $("#namex").dxTextBox('instance');
        if (isValidPhoneNumber(phone.option('value'))) {
            $.post(`/sendinvite`, [
                {name:'name', value: name.option('value')},
                {name:'phone', value: phone.option('value')},
                {name:'roleID', value: roleIDx}
            ], function(data) {
                if (data.status == 1) { 
                    $('.referralinstruction').html(`
                        <p class="text-dark">${formatMessage('referralinstruction')} ${formatMessage('referralinstruction3')}</p>
                        <text class="text-soft" id="introlink">${weburl}/referral?id=${cryptoID}</text>
                    `);
                    let btn = document.createElement("button");
                    btn.className = 'btn btn-light btn-sm';
                    btn.innerHTML = "Copy";
                    btn.name = "copyx";
                    btn.addEventListener("click", onClick, false);
                    $('.referralinstruction')[0].appendChild(btn);
                } else {
                    if (data.message == '203')  {
                        $('.loginmsg').removeClass('text-soft').addClass('text-danger').html(`${formatMessage("phonealreadyinuse")}`);
                    } else  if (data.message == '202')  {
                        $('.loginmsg').removeClass('text-soft').addClass('text-danger').html(`${formatMessage("phonealwaitotp")}`);
                    }
                    
                }
            }, "json");
        } else {
            $('.loginmsg').removeClass('text-soft').addClass('text-danger').html(`${formatMessage('invalidphone')}`);
        }
    }
    e.preventDefault();
  });

  $('.profileBtn').dxButton({
    width: '100%',
    text: 'Register',
    type: 'success',
    useSubmitBehavior: true,
  });

 


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