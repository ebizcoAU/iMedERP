$(() => {
    
    proddetails = `
    <p class="text-dark">
    Hệ thống không tìm thấy mã tham khảo. <br/>
    <b class="text-danger">Quí Khách thận trọng không sử dụng đường kết nối này.</b><br/>
    <text class="text-dark">Vui lòng báo cho chúng tôi về trường hợp này bằng cách bấm vào nút 'Kích hoạt'.</text>  
    </p> `;  
   
    var textdisplay = `
    <img class="pt-3 mx-auto"  src="" width="200" class="px-6" id="prodimg">
    <div class="card-img-overlay d-flex justify-content-around">
        <div class="card-block mx-auto ps-1">
        </div>
        <div class="card-block pe-2 mx-auto">
            <img src="" width="60" id="prodstatus">
        </div>
    </div>
    <div class="card-body" style="background-color: rgba(248, 244, 243, 0.8);border-radius: 5%">
        <p class="card-text">
            <div id="proddetails" style="font-size:17px"></div> 
        </p>
    </div>`;
    $('#maindisplay').html(textdisplay);
    $('#proddetails').html(proddetails);
    $('#prodimg').attr("src", `./assets/images/icons/stop.png`);
    
    $('#prodimg').attr("src", `assets/images/icons/stop.png`);
    $('#prodstatus').attr("visibility", false);

    
})