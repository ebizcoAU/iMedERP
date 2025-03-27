
$(() => {
    var roleID = $('#roleid').text();
    var groupID = $('#groupid').text();
    var dateadded = $('#dateadded').text();
    $('#pagetitle').html(`${formatMessage('xchangetransaction')}: ${new Date(dateadded).toLocaleDateString('vi-VN')} `)
    var walletlist = document.getElementById('walletlist');
    if (walletlist !== null) {
        const deferred = $.Deferred();
        $.ajax({
            url: `/walletoutstandingByDate/1/${dateadded}`,
            method: "POST",
            dataType: "json",
            success: function(data) {
                if (data.length > 0) {
                    deferred.resolve(data);
                } else { 
                    deferred.resolve([]);   
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
                            <div class="title mb-0 flex-1">${formatMessage('staffname')}</div>
                            <span class="badge badge-primary me-4 mb-1">${formatMessage('activatenum')}</span>
                            <span class="badge badge-primary me-4 mb-1">${formatMessage('total')}</span>
                        </div>
                    </a>
                </li>`;
                data.forEach((m, index)=>{
                    itemList += `
                    <li>
                        <a href="javascript:void(0);" class="item-content">
                            <div class="dz-inner d-flex align-items-center w-100">
                                <div class="title mb-0 flex-1">${m.memberName}</div>
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
          window.location = `/mwalletproductdaily?${dateadded}`;
        } 
    });


})