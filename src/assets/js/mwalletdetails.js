
$(() => {
    var wid = $('#wid').text();
    var saleid = $('#saleid').text();
    var dateadded = $('#dateadded').text();
    var roleID = $('#roleid').text();
    var groupID = $('#groupid').text();
    var cansave = false;

    $('.ratingtext').html(formatMessage("servicerating"));
    function setRatingClick () {
        console.log("cansave:" + cansave);
        $("#st1").on("click", function() {
            if (cansave) {
                $(".fa-star").css("color", "#111111");
                $("#st1").css("color", "#f3da25");
                saveRating(1);
            } else {
                notifyRating();
            }
        });
        $("#st2").on("click", function() {
            if (cansave) {
                $(".fa-star").css("color", "#111111");
                $("#st1, #st2").css("color", "#f3da25");
                saveRating(2);
            } else {
                notifyRating();
            }
        });
        $("#st3").on("click", function() {
            if (cansave) {
                $(".fa-star").css("color", "#111111")
                $("#st1, #st2, #st3").css("color", "#f3da25");
                saveRating(3);
            } else {
                notifyRating();
            }
        });
        $("#st4").on("click", function() {
            if (cansave) {
                $(".fa-star").css("color", "#111111");
                $("#st1, #st2, #st3, #st4").css("color", "#f3da25");
                saveRating(4);
            } else {
                notifyRating(); 
            }
        });
        $("#st5").on("click", function() {
            if (cansave) {
                $(".fa-star").css("color", "#111111");
                $("#st1, #st2, #st3, #st4, #st5").css("color", "#f3da25");
                saveRating(5);
            } else {
                notifyRating(); 
            }
        });
    }
    
    function notifyRating() {
        if (roleID==3) {
            screenLog(formatMessage("alreadyrated"), 'info')
        } else {
            screenLog(formatMessage("authoritytodo"), 'info')
        }
        
    }
    function saveRating(rating) {
        $.post(`/saverating`, [
            {name:'star', value: rating},
            {name:'saleID', value: saleid}
        ], function(data) {
            if (data.status == 1) { 
                window.location.href = '/mindex';
            } else {
                $('.loginmsg').removeClass('text-soft').addClass('text-danger').html(`${data.message}`);
            }
        }, "json");
    }
    
    var walletlist = document.getElementById('walletlist');
    if ((walletlist !== null) && ((roleID==3) || (roleID==5) || (roleID==6) || (roleID==7))) {
        const deferred = $.Deferred();
        $.ajax({
            url: `/walletdetails/${wid}/${saleid}/${dateadded}`,
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
            if ((saleid > 0) && ((roleID == 3)||(roleID == 7))) {
                $('#transactiondetails').html(`${formatMessage('transactiondetails')}#${data.length>0?data[0].saleID:0}`);
                var subtotal = 0;
                itemList +=`
                <li>
                    <a href="javascript:void(0);" class="item-content">
                        <div class="dz-inner d-flex align-items-center w-100">
                            <div class="title mb-0 flex-1">${formatMessage('product')}</div>
                            <span class="badge badge-primary me-4 mb-1">${formatMessage('bonus')}</span>
                        </div>
                    </a>
                </li>`;
                data.forEach((m, index)=>{
                    itemList += `
                    <li class="${m.status < 2?'bg-warning':'' }" >
                        <a href="javascript:void(0);" class="item-content ">
                            <div class="dz-inner d-flex align-items-center w-100">
                                <div class="title mb-0 flex-1">${m.productName}</div>
                                <span class="badge badge-light me-4 mb-1">${formatVNcurrency((roleID==3)?m.customerBonus:m.agentstaffBonus)}</span>
                            </div>
                        </a>
                    </li>
                    `;
                    subtotal += (roleID==3)?m.customerBonus:m.agentstaffBonus;
                })
                var provincesIDx = parseInt(data.length>0?data[0].provincesID:0);
                var wardsIDx = parseInt(data.length>0?data[0].wardsID:0);
                var province = (provincesIDx > 0) ? provincesSource.filter(m => m.provincesID ==provincesIDx)[0].title: '';
                console.log("provincesIDx: " + provincesIDx)
                console.log("wardsIDx: " + wardsIDx)
                var ward = (wardsIDx > 0) ? wardsSource.filter(m => m.wardsID ==wardsIDx)[0].title: '';
                var address2 = `${ward} ${province}`;

                $('.companytext').html(`${formatMessage('agent')}`);
                $('.companyvalue').html(`${data.length>0?data[0].companyName:''}`);
                $('.addresstext').html(`${formatMessage('address')}`);
                $('.addressvalue').html(`${data.length>0?data[0].address:''}<br/>${address2}`);
                if (roleID == 7) {
                    $('.personidtext').html(`${formatMessage('customer')}`);
                    $('.personidvalue').html(`${subdir}${data.length>0?data[0].customerID.toString().padStart(6, '0'):'#####'}`);
                } else if (roleID == 3) {
                    $('.persontext').html(`${formatMessage('agestaff')}`);
                    $('.personvalue').html(`${data.length>0?data[0].agestaffName:''}(${subdir}${data.length>0?data[0].customerID.toString().padStart(6, '0'):'#####'})`);
                }
                $('.datetimetext').html(`${formatMessage('datetime')}`);
                $('.datetimevalue').html(`${data.length>0?data[0].xchangeDT:'#####'}`);
                $('.totaltext').html(`${formatMessage('total')}`);
                $('.totalvalue').html(`${formatVNcurrency(subtotal)}`);
                //************STAR RATING DISPLAY  ************ */
                if ((data.length > 0) && (data[0].star > 0)) {
                    for (var x=0; x < data[0].star; x++) {
                        $(`#st${x+1}`).css("color", "#f3da25");
                    }
                } else if (roleID==3) {
                    cansave = true;    
                } else {
                    cansave = false;
                }
                setRatingClick();
                //***********************************************/
            } else  if ((saleid == 0) && ((roleID == 3)||(roleID == 7))) {
                $('#transactiondetails').html(`${formatMessage('transactiondetails')}#${data.length>0?data[0].walletID:0}`);
                var subtotal = 0;
                itemList +=`
                <li>
                    <a href="javascript:void(0);" class="item-content ">
                        <div class="dz-inner d-flex align-items-center w-100">
                            <div class="title mb-0 flex-1">${formatMessage('comment')}</div>
                            <span class="badge badge-primary me-4 mb-1">${formatMessage('amount')}</span>
                        </div>
                    </a>
                </li>`;
                data.forEach((m, index)=>{
                    const paydetails = JSON.parse('{"' + decodeURI(m.comment).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}')
                    itemList += `
                    <li class="${m.status < 2?'bg-warning':'' }" >
                        <a href="javascript:void(0);" class="item-content ">
                            <div class="dz-inner d-flex align-items-center w-100">
                                <div class="title mb-0 flex-1">${paydetails.paytype}<br/>ID:${paydetails.id}</div>
                                <span class="badge badge-light me-4 mb-1">${formatVNcurrency(m.debit)}</span>
                            </div>
                        </a>
                    </li>
                    `;
                    subtotal += m.debit;
                })
                var provincesIDx = parseInt(data.length>0?data[0].provincesID:0);
                var wardsIDx = parseInt(data.length>0?data[0].wardsID:0);
                var province = (provincesIDx > 0) ? provincesSource.filter(m => m.provincesID ==provincesIDx)[0].title: '';
                var ward = (wardsIDx > 0) ? wardsSource.filter(m => m.wardsID ==wardsIDx)[0].title: '';
                var address2 = `${ward} ${province}`;

                $('.companytext').html(`${formatMessage('name')}`);
                $('.companyvalue').html(`${data.length>0?data[0].personName:''}`);
                $('.addresstext').html(`${formatMessage('address')}`);
                $('.addressvalue').html(`${data.length>0?data[0].address:''}<br/>${address2}`);
                $('.personidtext').html(`${formatMessage('id')}`);
                $('.personidvalue').html(`${subdir}${data.length>0?data[0].personID.toString().padStart(6, '0'):'#####'}`);
                $('.datetimetext').html(`${formatMessage('payrequest')}`);
                $('.datetimevalue').html(`${data.length>0?data[0].dateAdded:'#####'}`);
                $('.datetimepaidtext').html(`${formatMessage('paydate')}`);
                $('.datetimepaidvalue').html(`${data.length>0?data[0].xchangeDT:'#####'}`);
                $('.totaltext').html(`${formatMessage('total')}`);
                $('.totalvalue').html(`${formatVNcurrency(subtotal)}`);

            } else if ((groupID > 1) && ((roleID == 5)||(roleID == 6))) {
                $('#transactiondetails').html(`${formatMessage('transactiondetails')} ${new Date(dateadded).toLocaleDateString('vi-VN')}`);
                var totalcredit = 0;
                var totaldebit = 0;
                itemList +=`
                <li>
                    <a href="javascript:void(0);" class="item-content">
                        <div class="dz-inner d-flex align-items-center w-100">
                            <div class="title mb-0 flex-1">${formatMessage('salenumber')}</div>
                            <span class="badge badge-primary me-4 mb-1">${formatMessage('inoutamount')}</span>
                        </div>
                    </a>
                </li>`;
                data.forEach((m, index)=>{
                    console.log(m.walletpay)
                    itemList += `
                    <li class="${m.status < 2?'bg-warning':'' }" >
                        <a href="javascript:void(0);" class="item-content">
                            <div class="dz-inner d-flex align-items-center w-100">
                                <div class="title mb-0 flex-1">${m.wallettype}</div>
                                <span class="badge badge-light me-4 mb-1">${m.walletpay}</span>
                            </div>
                        </a>
                    </li>
                    `;
                    totalcredit += m.credit;
                    totaldebit += m.debit;
                })
                var provincesIDx = parseInt(data.length>0?data[0].provincesID:0);
                var wardsIDx = parseInt(data.length>0?data[0].wardsID:0);
                var province = (provincesIDx > 0) ? provincesSource.filter(m => m.provincesID ==provincesIDx)[0].title: '';
                var ward = (wardsIDx > 0) ? wardsSource.filter(m => m.wardsID ==wardsIDx)[0].title: '';
                var address2 = `${ward} ${province}`;

                $('.totaltext').html(`${formatMessage('total')}`);
                $('.totalvalue').html(`${formatVNcurrency(totalcredit - totaldebit)}`);
            }
            walletlist.innerHTML = itemList;
            

        });
    }



})