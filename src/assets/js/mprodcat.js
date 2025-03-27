
$(() => {

    var catid  = $('#catid').text();
    var groupID = $('#groupid').text();
    var roleid = $('#roleid').text();
    var subcatid  = $('#subcatid').text();
    
    var subcatlist = document.getElementById('subcatlist');
    if (subcatlist !== null) {
        const deferred = $.Deferred();
        $.ajax({
            url: `/getrecord/category/${catid}`,
            method: "POST",
            dataType: "json",
            success: function(data) {
                var datx = data.description.split(",");
                if (datx.length == 0) {
                    deferred.resolve(true);
                } else {
                    var itemList =``;
                    datx.forEach((m, index)=>{
                        itemList += `
                        <div class="col-3 pt-2" >
                            <a href="/mprodcat?${catid}&${index}">
                                <div class="categore-box smx bg-${index+1}">
                                    <span class="text-white">${m.trim()}</span>
                                </div>
                            </a>
                        </div>
                        `;
                    })
                    subcatlist.innerHTML = itemList;
                    deferred.resolve(datx);
                }
            },
            error: function() {
                screenLog('Data Loading Error', 'error')
                deferred.reject("Data Loading Error");
            },
            timeout: 5000
        });
        deferred.promise();
        
    }
    
    var prodlisting = document.getElementById('prodlisting');
    if (prodlisting !== null) {
        const deferred = $.Deferred();
        $.ajax({
            url: `/product/${groupID}/0/${catid}&${subcatid}`,
            method: "POST",
            dataType: "json",
            success: function(data) {
                if (data.data.length == 0) {
                    $('#pagetitle').html(formatMessage("noproductavail"));
                    deferred.resolve(data);
                } else {
                    $('#pagetitle').html(data.data[0].categoryName);
                    var linebg = 'bg-light';
                    if (getCookie('themeVersion_value')=='theme-dark'){
                        linebg = 'bg-dark';
                    }
                    var itemList =``;
                    data.data.forEach((m, index)=>{
                        var newpricex = 0;
                        if ((roleid == 4) || (roleid==1)) {
                            newpricex = m.distributorRate;
                        } else if ((roleid==5) || (roleid==6)) {
                            newpricex = m.agentRate;
                        } else {
                            newpricex = m.onlineRate;
                        }
                        itemList += `
                        <li>
                            <div class="item-content ${index%2==0?linebg:''}  pt-2" >
                                <div class="item-media media media-95">
                                    <img src="public/${subdir}/${m.imgLink}" alt="logo">
                                </div>
                                <div class="item-inner">
                                    <div class="item-title-row">
                                        <h6 class="item-title sub-title"><a href="/mproddetail?${m.productID}">${m.productName}</a></h6>
                                        <div class="d-flex align-items-center">
                                            <h6 class="me-2 mb-0">${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(newpricex)}</h6>
                                            <del class="off-text"><h6 class="mb-0">${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(m.unitPrice)}</h6></del>
                                        </div>    
                                    </div>
                                    <div class="item-footer">
                                        <div class="d-flex align-items-center">
                                            <svg class="me-2" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <g clip-path="url(#clip0_361_453)">
                                                <path d="M14.6666 0.000106812H9.12485C8.75825 0.000106812 8.24587 0.212488 7.98685 0.471314L0.389089 8.06903C-0.129696 8.58723 -0.129696 9.43684 0.389089 9.95441L6.04624 15.6114C6.56385 16.1296 7.41263 16.1296 7.93103 15.6108L15.5288 8.01423C15.7876 7.75544 16 7.24224 16 6.87642V1.3335C16 0.600298 15.3998 0.000106812 14.6666 0.000106812ZM11.9998 5.33347C11.2634 5.33347 10.6664 4.73585 10.6664 4.00008C10.6664 3.26309 11.2634 2.66669 11.9998 2.66669C12.7362 2.66669 13.3334 3.26309 13.3334 4.00008C13.3334 4.73585 12.7362 5.33347 11.9998 5.33347Z" fill="#C29C1D"/>
                                                </g>
                                                <defs>
                                                <clipPath >
                                                <rect width="16" height="16" fill="white"/>
                                                </clipPath>
                                                </defs>
                                            </svg>
                                            <h6 class="font-12 text-accent mb-0 font-w400">${formatMessage('specialdiscount')} 50%</h6>
                                        </div>
                                        <a href="/mproddetail?${m.productID}" class="cart-btn">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <g clip-path="url(#clip0_361_436)">
                                                <path d="M18.1776 17.8443C16.6362 17.8428 15.3855 19.0912 15.3839 20.6326C15.3824 22.1739 16.6308 23.4247 18.1722 23.4262C19.7136 23.4277 20.9643 22.1794 20.9659 20.638V20.6353C20.9644 19.0955 19.7173 17.8473 18.1776 17.8443Z" fill="white"/>
                                                <path d="M23.1278 4.47972C23.061 4.46679 22.9932 4.46022 22.9251 4.46011H5.93181L5.66267 2.65957C5.49499 1.4638 4.47216 0.574121 3.26466 0.573753H1.07655C0.481978 0.573753 0 1.05573 0 1.6503C0 2.24488 0.481978 2.72686 1.07655 2.72686H3.26734C3.40423 2.72586 3.52008 2.82778 3.53648 2.96372L5.19436 14.3267C5.42166 15.7706 6.66363 16.8358 8.12528 16.8404H19.3241C20.7313 16.8423 21.9454 15.8533 22.2281 14.4747L23.9802 5.7412C24.0931 5.15745 23.7115 4.59268 23.1278 4.47972Z" fill="white"/>
                                                <path d="M11.3405 20.5158C11.2749 19.0196 10.0401 17.8418 8.54246 17.847C7.00233 17.9092 5.80425 19.2082 5.86648 20.7484C5.9262 22.2262 7.12833 23.4007 8.60707 23.4262H8.67435C10.2143 23.3587 11.4079 22.0557 11.3405 20.5158Z" fill="white"/>
                                                </g>
                                                <defs>
                                                <clipPath >
                                                <rect width="24" height="24" fill="white"/>
                                                </clipPath>
                                                </defs>
                                            </svg>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </li>
                        `;
                    })
                    prodlisting.innerHTML = itemList;
                    deferred.resolve(false);
                }
            },
            error: function() {
                screenLog('Data Loading Error', 'error');
                deferred.reject("Data Loading Error");
            },
            timeout: 5000
        });
        deferred.promise();
        
    }
    
    
    
    })