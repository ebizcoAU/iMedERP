
$(() => {

var top10id  = $('#top10id').text();
if (top10id == 0 ) {
    $('#pagetitle').html(`${formatMessage('top10products')}`);
} else if (top10id == 1) {
    $('#pagetitle').html(`${formatMessage('top10agent')}`);
} else if (top10id == 2) {
    $('#pagetitle').html(`${formatMessage('top10agentstaff')}`);
} else {
    $('#pagetitle').html(`${formatMessage('top10diststaff')}`);
}

var top10space = document.getElementById('top10space');
if (top10space !== null) {
    if (top10id == 0 ) {
        const deferred = $.Deferred();
        $.ajax({
            url: `/top10products`,
            method: "GET",
            dataType: "json",
            success: function(data) {
                if (data.length == 0) {
                    deferred.resolve(data);
                } else {
                    var itemList =``;
                    data.forEach((m, index)=>{
                        itemList += `
                        <div class="col-12">
                            <div class="card add-banner" style="background-image: url(public/logoblank.png);">
                                <div class="circle-3"><img src="public/${subdir}/${m.imgLink}" alt="product image"></div>
                                <div class="circle-2"></div>
                                <div class="card-body">
                                    <div class="card-info">
                                        <span class="font-16 font-w500 text-dark">${m.productName.split("-").length>0?m.productName.split("-")[0].trim():''}</span>
                                        <text>${m.productName.split("-").length > 1? m.productName.split("-")[1].trim():''}</text>
                                        <h1 data-text=" ${index+1}" class="title mb-2" style="font-size:48px"> ${index+1}</h1>
                                        <text>${formatMessage("qtysold")}: ${m.subtotal}</text>
                                    </div>
                                </div>
                            </div>       
                        </div>
                        `;
                    })
                    top10space.innerHTML = itemList;
                    deferred.resolve(false);
                }
            },
            error: function() {
                deferred.reject("Data Loading Error");
            },
            timeout: 5000
        });
        deferred.promise();
    } else if (top10id==1) {
        const deferred = $.Deferred();
        $.ajax({
            url: `/top10agent`,
            method: "GET",
            dataType: "json",
            success: function(data) {
                if (data.length == 0) {
                    deferred.resolve(data);
                } else {
                    var itemList =``;
                    data.forEach((m, index)=>{
                        if ((m.imgLink === 'undefined') || (m.imgLink === null) || (m.imgLink === '')) m.imgLink = 'logoblank.png';
                        itemList += `
                        <div class="col-12">
                            <div class="card add-banner" style="background-image: url(public/logoblank.png);">
                                <div class="circle-5"><img src="public/${subdir}/${m.imgLink}" width="90" alt="agent"></div>
                                <div class="circle-2"></div>
                                <div class="card-body">
                                    <div class="card-info">
                                        <span class="font-16 font-w500 text-dark">${m.name.slice(0,20)}</span>
                                        <small>${m.company.slice(0,20)}</small>
                                        <h1 data-text=" ${index+1}" class="title mb-2" style="font-size:48px"> ${index+1}</h1>
                                        <text>${formatMessage("qtysold")}: ${m.subtotal}</text>
                                    </div>
                                </div>
                            </div>       
                        </div>
                        `;
                    })
                    top10space.innerHTML = itemList;
                    deferred.resolve(false);
                }
            },
            error: function() {
                deferred.reject("Data Loading Error");
            },
            timeout: 5000
        });
        deferred.promise();
    } else if (top10id==2) {   
        const deferred = $.Deferred();
        $.ajax({
            url: `/top10agentstaff`,
            method: "GET",
            dataType: "json",
            success: function(data) {
                if (data.length == 0) {
                    deferred.resolve(data);
                } else {
                    var itemList =``;
                    data.forEach((m, index)=>{
                        if ((m.imgLink === 'undefined') || (m.imgLink === null) || (m.imgLink === '')) m.imgLink = 'logoblank.png';
                        itemList += `
                        <div class="col-12">
                            <div class="card add-banner" style="background-image: url(public/logoblank.png);">
                                <div class="circle-4"><img src="public/${subdir}/${m.imgLink}" alt="agentstaff"></div>
                                <div class="circle-2"></div>
                                <div class="card-body">
                                    <div class="card-info">
                                        <span class="font-16 font-w500 text-dark">${m.name.slice(0,20)}</span>
                                        <small>${m.company.slice(0,20)}</small>
                                        <h1 data-text=" ${index+1}" class="title mb-2" style="font-size:48px"> ${index+1}</h1>
                                        <text>${formatMessage("qtysold")}: ${m.subtotal}</text>
                                    </div>
                                </div>
                            </div>       
                        </div>
                        `;
                    })
                    top10space.innerHTML = itemList;
                    deferred.resolve(false);
                }
            },
            error: function() {
                deferred.reject("Data Loading Error");
            },
            timeout: 5000
        });
        deferred.promise(); 
    } else {
        const deferred = $.Deferred();
        $.ajax({
            url: `/top10diststaff`,
            method: "GET",
            dataType: "json",
            success: function(data) {
                if (data.length == 0) {
                    deferred.resolve(data);
                } else {
                    var itemList =``;
                    data.forEach((m, index)=>{
                        if (m.imgLink === 'undefined') m.imgLink = 'logoblank.png';
                        itemList += `
                        <div class="col-12">
                            <div class="card add-banner" style="background-image: url(public/logoblank.png);">
                                <div class="circle-4"><img src="public/${subdir}/${m.imgLink}" alt="diststaff"></div>
                                <div class="circle-2"></div>
                                <div class="card-body">
                                    <div class="card-info">
                                        <span class="font-16 font-w500 text-dark">${m.name.slice(0,20)}</span>
                                        <small>${m.company.slice(0,20)}</small>
                                        <h1 data-text=" ${index+1}" class="title mb-2" style="font-size:48px"> ${index+1}</h1>
                                        <text>${formatMessage("qtysold")}: ${m.subtotal}</text>
                                    </div>
                                </div>
                            </div>       
                        </div>
                        `;
                    })
                    top10space.innerHTML = itemList;
                    deferred.resolve(false);
                }
            },
            error: function() {
                deferred.reject("Data Loading Error");
            },
            timeout: 5000
        });
        deferred.promise();
    }
}


function screenLog(msg, typex='info') {
    const message = msg;
    const type = typex;
    toast.option({ message, type });
    toast.show(); 
}

const toast = $('#toast').dxToast({ 
    displayTime: 1000,
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