
$(() => {
    var roleID = $('#roleid').text();
    var groupID = $('#groupid').text();
    $('#pagetitle').html(formatMessage("checkwallet"));
    var walletlist = document.getElementById('walletlist');
    if (walletlist !== null) {
        const deferred = $.Deferred();
        $.ajax({
            url: `/walletlist`,
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
            if ((groupID > 1) && ((roleID == 3)||(roleID == 7))) {
                itemList +=`
                <li>
                    <a href="javascript:void(0);" class="item-content item-link">
                        <div class="dz-inner d-flex align-items-center w-100">
                            <div class="title mb-0 flex-1">${formatMessage('salenumber')}</div>
                            <span class="badge badge-primary me-4 mb-1">${formatMessage('inoutamount')}</span>
                            <span class="badge badge-primary me-4 mb-1">${formatMessage('total')}</span>
                        </div>
                    </a>
                </li>`;
                data.forEach((m, index)=>{
                    itemList += `
                    <li class="${m.status < 2?'bg-warning':'' }" >`;
                    if (m.saleID == 0) {
                        itemList += `<a href="javascript:void(0);" class="item-content">`;
                    } else { 
                        itemList += `<a href="/mwalletdetails?${m.walletID}&${m.saleID}" class="item-content item-link">`;
                    }
                    itemList += `
                            <div class="dz-inner d-flex align-items-center w-100">
                                <div class="title mb-0 flex-1 ps-1">${m.wallettype}</div>
                                <span class="badge badge-light me-4 mb-1">${m.walletpay}</span>
                                <span class="badge badge-light me-4 mb-1">${m.balance}</span>
                            </div>
                        </a>
                    </li> `;

                })
            } else if ((groupID > 1) && ((roleID == 1)||(roleID == 5)||(roleID == 6))) {
                itemList +=`
                <li>
                    <a href="javascript:void(0);" class="item-content item-link">
                        <div class="dz-inner d-flex align-items-center w-100">
                            <div class="title mb-0 flex-1">${formatMessage('dateadded')}</div>
                            <span class="badge badge-primary me-4 mb-1">${formatMessage('inoutamount')}</span>
                            <span class="badge badge-primary me-4 mb-1">${formatMessage('total')}</span>
                        </div>
                    </a>
                </li>`;
                data.forEach((m, index)=>{
                    itemList += `
                    <li class="${m.status < 2?'bg-warning':'' }" >
                        <a href="/mwalletdetex?${m.dateAdded}" class="item-content item-link">
                            <div class="dz-inner d-flex align-items-center w-100">
                                <div class="title mb-0 flex-1">${new Date(m.dateAdded).toLocaleDateString('vi-VN')}</div>
                                <span class="badge badge-light me-4 mb-1">${m.walletpay}</span>
                                <span class="badge badge-light me-4 mb-1">${m.balance}</span>
                            </div>
                        </a>
                    </li>
                    `;

                })
            }
            walletlist.innerHTML = itemList;

        });
    }

    $("#confirmButton").on('click', function(e){
        e.preventDefault();
        window.location = `/mwithdraw`;
    })


})