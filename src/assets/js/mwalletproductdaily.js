
$(() => {
    var roleID = $('#roleid').text();
    var groupID = $('#groupid').text();
    var dateadded = $('#dateadded').text();
    $('#pagetitle').html(`${formatMessage('xchangetransaction')}: ${new Date(dateadded).toLocaleDateString('vi-VN')} `)
    var walletlist = document.getElementById('walletlist');
    if (walletlist !== null) {
        const deferred = $.Deferred();
        $.ajax({
            url: `/walletoutstandingByDate/2/${dateadded}`,
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
                            <div class="title mb-0 flex-1">${formatMessage('product')}</div>
                            <span class="badge badge-primary me-4 mb-1">${formatMessage('qty')}</span>
                        </div>
                    </a>
                </li>`;
                data.forEach((m, index)=>{
                    itemList += `
                    <li>
                        <a href="javascript:void(0);" class="item-content ">
                            <div class="dz-inner d-flex align-items-center w-100">
                                <div class="title mb-0 flex-1">${m.name}</div>
                                <span class="badge badge-light me-4 mb-1">${m.Qty}</span>
                            </div>
                        </a>
                    </li>
                    `;

                })
            }
            walletlist.innerHTML = itemList;

        });
    }




})