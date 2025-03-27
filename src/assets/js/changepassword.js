

$(() => {
  //****** label header ******/
  $('#pagetitle').html(formatMessage('changepassword'));
  //**************************/
  const memberID = $('#memberid').text();
  var newFormData = {};
  const tbl = "memberx";
  const primekey = "memberID";

const form = $('#profileContainer').dxForm({
    width: 560,
    formData: {
        username: $('#phone').text(),
        password: '',
        confirmedpassword: ''
    },
    readOnly: false,
    showColonAfterLabel: true,
    labelLocation: 'left',
    minColWidth: 300,
    colCount: 1,
    items: [{
        dataField: 'username',
        label: {
            text: formatMessage('username')+ ' (Phone hoặc Email i.e. 0911123456)',
        },
        validationRules: [{
            type: 'required',
            message: formatMessage('enterusername'),
        }, {
            type: 'stringLength',
            min: 10,
            message: formatMessage('username10charslong'),  
          }]
    }, {
        dataField: 'password',
        label: {
            text: formatMessage('password') + ' (' + formatMessage('passwordrestriction') + ')',
        },
        editorOptions: {
            mode: 'password',
        },
        validationRules: [{
            type: 'required',
            message: formatMessage('enternewpassword'),
          }, {
            type: 'stringLength',
            min: 8,
            message: formatMessage('password8charslong'),
          }]
    }, {
        dataField: 'confirmedpassword',
        label: {
            text: formatMessage('confirm') + ' '+ formatMessage('password') + ' (gõ lại mật mã lần nữa)',
        },
        editorOptions: {
            mode: 'password',
        },
        validationRules: [{
            type: 'required',
            message: formatMessage('enternewpassword'),
        }, {
            type: 'stringLength',
            min: 8,
            message: formatMessage('password8charslong'),
        }]
    }],
    onFieldDataChanged: function(e) {
        newFormData = e.component.option("formData");
    }
    
}).dxForm('instance');

$('#submitbutton').dxButton({
    icon: 'save',
    type: 'success',
    text: 'Done',
    onClick() {
        if (newFormData.password === newFormData.confirmedpassword ) {
            DevExpress.ui.notify(formatMessage('processing'));
            newFormData[primekey] = memberID;
            console.log("newFormData: " + JSON.stringify(newFormData, false, 4))
            sendRequest(`/resetpwd`, 'POST', {
                data:  newFormData 
            }, function(error, data){
                if (error > 0) DevExpress.ui.notify(data)
                else {
                    console.log("data: " + JSON.stringify(data, false, 4))
                    if (data.status == 0) {
                        DevExpress.ui.notify(data.title);
                    } else {
                        DevExpress.ui.notify(formatMessage('updatesuccess'));
                    }
                }
            })
        } else {
            DevExpress.ui.notify(formatMessage('passwordnotmatch'));

        }
        
    },
});

//***************************************************** */
  function sendRequest(url, method = 'GET', data, callback) {
    console.log("url: " + url)
    $.ajax(url, {
      method,
      data,
      cache: false,
      xhrFields: { withCredentials: true },
    }).done((result) => {
        console.log(JSON.stringify(result, false, 4))
        callback(0, result);
      
    }).fail((xhr) => {
      console.log(xhr.responseJSON ? xhr.responseJSON.Message : xhr.statusText);
      callback(1, xhr.responseJSON ? xhr.responseJSON.Message : xhr.statusText);
    });
  }

});
