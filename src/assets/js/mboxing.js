
$(() => {

$('#addmember').html(formatMessage('addmember'));
$('#chooseproduct').html(`${formatMessage('chooseproduct')} &nbsp;&nbsp;`);
$('.instruction').html(formatMessage('packprodintobox'));
$('.profileBtn').html(formatMessage('submit'));

var groupID  = $('#groupid').text();
var subdir  = $('#subdir').text();

var productStore = {  
    store: new DevExpress.data.CustomStore({
      key: "productID",
      loadMode: "raw",
      load: function() {
        return sendRequest(`/product/${groupID}`);
      },
    })
}  
var product = $("#productx").dxDropDownButton({
    label:  formatMessage('chooseproduct'),
    labelMode: 'floating',
    dataSource: productStore,
    keyExpr: 'productID',
    displayExpr: "productName",
    dropDownOptions: {
        width: 320
    },
    onItemClick: function (e) {
        e.component.option("id", e.itemData.productID)
        e.component.option("text", e.itemData.productName.substring(0,60))
        $('#prodimg').attr("src", `public/${subdir}/${e.itemData.imgLink}`)
        
    },
}).dxDropDownButton('instance');


$('#profileForm1').on('submit', (e) => {
    if (product.option('id')) {
        window.location = `/mboxpacking?${product.option('id')}`;
    } else {
        screenLog(formatMessage('invalidproduct', 'error'))
    }
    e.preventDefault();
});

$('.profileBtn').dxButton({
    width: '100%',
    text: 'Register',
    type: 'success',
    useSubmitBehavior: true,
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

//***************************************************** */
function sendRequest(url, method = 'GET', data) {
    const d = $.Deferred();
    //console.log("url: " + url)
    $.ajax(url, {
      method,
      data,
      cache: false,
      xhrFields: { withCredentials: true },
    }).done((result) => {
        //console.log(JSON.stringify(result, false, 4))
        d.resolve(result.filter(m=> parseInt(m.productID) > 0));
      
    }).fail((xhr) => {
      d.reject(xhr.responseJSON ? xhr.responseJSON.Message : xhr.statusText);
    });

    return d.promise();
  }



})