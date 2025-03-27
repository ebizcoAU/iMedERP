
$(() => {
    var roleID = $('#roleid').text();
    var groupID = $('#groupid').text();
    var oid = parseInt($('#orderxID').text());
    var orderNumber = $('#orderNumber').text();
    $('.ordersx').html(`${formatMessage('ordersx')}: ${orderNumber}`);
    var parentGroupID = $('#groupid').text();

    var memberid = $('#memberid').text();
    var roleid = $('#roleid').text();
    var taxVal = 0;
    var subtotalVal = 0;
    var totalVal = 0;
    var shopcartx = [];

 //************************************************ */
 $.post(`/orderxitemlist/${oid}`, {}, function (data){
    console.log(data)
    data.forEach((m, index) => {
        shopcartx.push({
            productID: m.productID,
            categoryID: m.categoryID,
            subcatID: m.subcatID,
            catName: m.categoryName,
            prodName: m.productName,
            imgLink: m.imgLink,
            price: m.recomPrice,
            newprice: m.unitPrice,
            taxrate: m.taxrate,
            discount: Math.round((m.recomPrice - m.unitPrice)/m.recomPrice *100)/100,
            qty: m.qty,
            qtyperBox: m.qtyperBox,
            unitMeasure: m.unitMeasure
        });
    })
    cartlisting(); 
    
 })
 //************************************************ */

 function cartlisting () {
     var linebg = 'bg-light';
     if (getCookie('themeVersion_value')=='theme-dark'){
         linebg = 'bg-dark';
     }
     var prodlisting = document.getElementById('prodlisting');
     if (prodlisting !== null) {
         var itemList =``;
         shopcartx.forEach((m, index)=>{
             var umeasure = (m.unitMeasure > 0) ? unitmeasureSource.filter(n => n.status == m.unitMeasure)[0].statext: '';
             var umeasureTxt = `${m.qtyperBox} ${umeasure}/${formatMessage('box')}`;   
             itemList += `
             <li>
                 <div class="item-content ${index%2==0?linebg:''}  pt-2" >
                     <div class="item-media media media-60">
                         <img src="public/${subdir}/${m.imgLink}" alt="logo">
                     </div>
                     <div class="item-inner">
                         <div class="item-title-row">
                             <h5 class="item-title sub-title"><a href="/mproddetail?${m.productID}">${m.prodName}</a></h5>
                             <div class="item-subtitle text-soft"><a href="/mprodcat?${m.categoryID}&${m.subcatID}">${m.catName} (${umeasureTxt})</a></div>
                         </div>
                         <div class="item-footer">
                             <div class=" align-items-center">
                                 <h6 class="me-2 mb-0">${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(m.newprice * m.qtyperBox)}</h6>
                                 <del class="off-text" style="color:#999"><h6 class="mb-0" style="color:#999">${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(m.price * m.qtyperBox)}</h6></del>
                             </div>   
                             <div class=" align-items-center">
                                 <p class="me-2 mb-0" style="font-size:14px; color:#333;font-weight:600">${formatMessage('qty')}</p>
                                 <h5 class="me-2 mb-0 align-items-right">${m.qty}</h5>
                             </div>  
                         </div>
                     </div>
                 </div>
             </li>
             `;
         })
         prodlisting.innerHTML = itemList;
         calcTotal();
     }
 }
 
 function calcTotal() {
     subtotalVal = 0;
     taxVal = 0;
     shopcartx.forEach((f) => {
         subtotalVal+= (f.newprice * f.qty * f.qtyperBox);
         taxVal+= (f.newprice * f.qty * f.qtyperBox * f.taxrate );
     })
     totalVal = subtotalVal + taxVal;

     $('#subtotal').html(formatMessage('subtotal'));
     $('#tax').html(formatMessage('tax'));
     $('#total').html(formatMessage('total'));
     
     $('#subtotalVal').html(`${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(subtotalVal)}`);
     $('#taxVal').html(`${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(taxVal)}`);
     $('#totalVal').html(`${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalVal)}`);
     
 }

})