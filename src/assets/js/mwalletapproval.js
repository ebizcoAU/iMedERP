
$(() => {
    var roleID = $('#roleid').text();
    var groupID = $('#groupid').text();
    var walletlist = document.getElementById('walletlist');
    if (walletlist !== null) {
        const deferred = $.Deferred();
        $.ajax({
            url: `/walletoutstandingByDate/0/0`,
            method: "POST",
            dataType: "json",
            success: function(data) {
                if (data.length == 0) {
                    deferred.resolve(data);
                } else {
                    deferred.resolve(data);
                }
            },
            error: function() {
                deferred.reject("Data Loading Error");
            },
            timeout: 20000
        });
        deferred.promise().then((data)=>{
            var itemList =``;
            if ((groupID > 1) && (roleID == 6)) {
                itemList +=`
                <li>
                    <a href="javascript:void(0);" class="item-content item-link">
                        <div class="dz-inner d-flex align-items-center w-100">
                            <div class="title mb-0 flex-1">${formatMessage('date')}</div>
                            <span class="badge badge-primary me-4 mb-1">${formatMessage('activatenum')}</span>
                            <span class="badge badge-primary me-4 mb-1">${formatMessage('total')}</span>
                        </div>
                    </a>
                </li>`;
                data.forEach((m, index)=>{
                    itemList += `
                    <li>
                        <a href="/mwalletapprovaldaily?${m.dateAdded}" class="item-content item-link">
                            <div class="dz-inner d-flex align-items-center w-100">
                                <div class="title mb-0 flex-1">${new Date(m.dateAdded).toLocaleDateString('vi-VN')}</div>
                                <span class="badge badge-light me-4 mb-1">${m.Qty}</span>
                                <span class="badge badge-light me-4 mb-1">${formatVNcurrency(m.tCredit)}</span>
                            </div>
                        </a>
                    </li>
                    `;

                })
            }
            walletlist.innerHTML = itemList;

        });
    }

    $("#confirmButton").dxButton({
        text: formatMessage('confirm'),
        type: 'normal',
        onClick: function() {
          var myDialog = DevExpress.ui.dialog.custom({
            title: formatMessage('confirmtoproceed'),
            messageHtml: `<b>${formatMessage('proceedtocomplete')}</b>`,
            buttons: [{
                text: formatMessage('yes'),
                onClick: function(e) {
                    return { buttonText:'Y'  }
                }
              }, {
                text: formatMessage('no'),
                onClick: function(e) {
                    return { buttonText: 'N'}
                }
              } 
            ]
          });
          myDialog.show().done(function(dialogResult) {
              if (dialogResult.buttonText == 'Y') {
                $.ajax({
                  url: `/approvedwallet`,
                  method: "POST",
                  data: {
                  },
                  dataType: "json",
                  success: function(data) {
                      if (data.status == 0) {
                        location.reload();
                      } else {
                        const message = formatMessage("errorupdating");
                        const type = 'warning';
                        toast.option({ message , type });
                        toast.show(); 
                      }
                  },
                  error: function() {
                    const message = formatMessage("errorupdating");
                    const type = 'warning';
                    toast.option({ message , type });
                    toast.show(); 
                  },
                  timeout: 5000
              });
              }
          });
        } 
    });


})