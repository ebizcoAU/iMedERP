$(() => {
    $('#pagetitle').html(formatMessage('salediary'));
    var roleID = $('#roleid').text();
    var memberID = $('#memberid').text();
    var divisionID = $('#divisionid').text();
    var memberName = $('#name').text();
    var diaryID = $('#diaryid').text();
    var cid = $('#cid').text();
    var subdir = $('#subdir').text();
    const delayMin = 15;
    getDiary();
    
/************************************************ */
function getDiary() {
    $.post(`/getdiarynv`, { 
        'diaryID': diaryID
    }).done(function (datx){
        if (datx.length > 0) {
            var data = datx[0];
            if ((data.status > 2) || ((data.status==2) && (data.dtype==1))) {
                $('.right-content').html(`
                    <a href="/mi" class="ps-2">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="black" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9.14373 20.7821V17.7152C9.14372 16.9381 9.77567 16.3067 10.5584 16.3018H13.4326C14.2189 16.3018 14.8563 16.9346 14.8563 17.7152V20.7732C14.8562 21.4473 15.404 21.9951 16.0829 22H18.0438C18.9596 22.0023 19.8388 21.6428 20.4872 21.0007C21.1356 20.3586 21.5 19.4868 21.5 18.5775V9.86585C21.5 9.13139 21.1721 8.43471 20.6046 7.9635L13.943 2.67427C12.7785 1.74912 11.1154 1.77901 9.98539 2.74538L3.46701 7.9635C2.87274 8.42082 2.51755 9.11956 2.5 9.86585V18.5686C2.5 20.4637 4.04738 22 5.95617 22H7.87229C8.19917 22.0023 8.51349 21.8751 8.74547 21.6464C8.97746 21.4178 9.10793 21.1067 9.10792 20.7821H9.14373Z" fill="#777"></path>
                        </svg>
                    </a> 
                `);
            } else {
                if (data.dtype == 1) {
                    let jstext = ``;
                    if ((roleID==1)||((roleID==2)&&(divisionID==3))) {
                        jstext += `<a href="javascript:void(0)" class="px-2 checkedBtn">						
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 256 256" >
                                        <g style="stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: none; fill-rule: nonzero; opacity: 1;" transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)" >
                                            <circle cx="45" cy="45" r="45" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(40,201,55); fill-rule: nonzero; opacity: 1;" transform="  matrix(1 0 0 1 0 0) "/>
                                            <path d="M 38.478 64.5 c -0.01 0 -0.02 0 -0.029 0 c -1.3 -0.009 -2.533 -0.579 -3.381 -1.563 L 21.59 47.284 c -1.622 -1.883 -1.41 -4.725 0.474 -6.347 c 1.884 -1.621 4.725 -1.409 6.347 0.474 l 10.112 11.744 L 61.629 27.02 c 1.645 -1.862 4.489 -2.037 6.352 -0.391 c 1.862 1.646 2.037 4.49 0.391 6.352 l -26.521 30 C 40.995 63.947 39.767 64.5 38.478 64.5 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(255,255,255); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" />
                                        </g>
                                    </svg>
                                 </a>`;
                    }    
                    jstext += `
                        <a href="javascript:void(0)" class="px-2" data-bs-toggle="offcanvas" data-bs-target="#offcanvasLeft" aria-controls="offcanvasLeft">						
                            <svg width="24" height="24"  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
                                <g style="stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: none; fill-rule: nonzero; opacity: 1;" transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)" >
                                    <path d="M 55.924 69.479 H 6.402 C 2.866 69.479 0 66.612 0 63.076 V 26.924 c 0 -3.536 2.866 -6.402 6.402 -6.402 h 49.522 c 3.536 0 6.402 2.866 6.402 6.402 v 36.152 C 62.326 66.612 59.46 69.479 55.924 69.479 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" />
                                    <path d="M 84.501 61.379 l -17.991 -6.39 V 35.011 l 17.991 -6.39 C 87.183 27.669 90 29.658 90 32.504 v 24.993 C 90 60.342 87.183 62.331 84.501 61.379 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" />
                                </g>                                
                            </svg>
                        </a>
                        <a href="/mindex" class="ps-2">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="black" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9.14373 20.7821V17.7152C9.14372 16.9381 9.77567 16.3067 10.5584 16.3018H13.4326C14.2189 16.3018 14.8563 16.9346 14.8563 17.7152V20.7732C14.8562 21.4473 15.404 21.9951 16.0829 22H18.0438C18.9596 22.0023 19.8388 21.6428 20.4872 21.0007C21.1356 20.3586 21.5 19.4868 21.5 18.5775V9.86585C21.5 9.13139 21.1721 8.43471 20.6046 7.9635L13.943 2.67427C12.7785 1.74912 11.1154 1.77901 9.98539 2.74538L3.46701 7.9635C2.87274 8.42082 2.51755 9.11956 2.5 9.86585V18.5686C2.5 20.4637 4.04738 22 5.95617 22H7.87229C8.19917 22.0023 8.51349 21.8751 8.74547 21.6464C8.97746 21.4178 9.10793 21.1067 9.10792 20.7821H9.14373Z" fill="#777"></path>
                            </svg>
                        </a> 
                    `;

                    $('.right-content').html(jstext);
                
                } else if (data.dtype == 3) {
                    let jstext = ``;
                    if ((roleID==1)||((roleID==2)&&(divisionID==3))) {
                        jstext += `<a href="javascript:void(0)" class="px-2 checkedBtn">						
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 256 256" >
                                        <g style="stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: none; fill-rule: nonzero; opacity: 1;" transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)" >
                                            <circle cx="45" cy="45" r="45" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(40,201,55); fill-rule: nonzero; opacity: 1;" transform="  matrix(1 0 0 1 0 0) "/>
                                            <path d="M 38.478 64.5 c -0.01 0 -0.02 0 -0.029 0 c -1.3 -0.009 -2.533 -0.579 -3.381 -1.563 L 21.59 47.284 c -1.622 -1.883 -1.41 -4.725 0.474 -6.347 c 1.884 -1.621 4.725 -1.409 6.347 0.474 l 10.112 11.744 L 61.629 27.02 c 1.645 -1.862 4.489 -2.037 6.352 -0.391 c 1.862 1.646 2.037 4.49 0.391 6.352 l -26.521 30 C 40.995 63.947 39.767 64.5 38.478 64.5 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(255,255,255); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" />
                                        </g>
                                    </svg>
                                 </a>`;
                    }    
                    jstext += `
                        <a href="javascript:void(0)" class="px-2" data-bs-toggle="offcanvas" data-bs-target="#offcanvasLeft2" aria-controls="offcanvasLeft2">						
                            <svg width="24" height="24"  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
                                <g style="stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: none; fill-rule: nonzero; opacity: 1;" transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)" >
                                    <path d="M 78.637 81.733 H 11.363 C 5.098 81.733 0 76.605 0 70.302 V 31.613 c 0 -6.303 5.098 -11.432 11.363 -11.432 h 4.552 c 0.554 0 1.098 -0.096 1.617 -0.286 c 1.105 -0.405 2.021 -1.206 2.579 -2.256 l 1.374 -2.591 c 2.218 -4.184 6.522 -6.782 11.234 -6.782 h 24.563 c 4.712 0 9.017 2.599 11.233 6.782 l 1.375 2.592 c 0.831 1.567 2.438 2.542 4.195 2.542 h 4.552 C 84.902 20.182 90 25.31 90 31.613 v 38.688 c 0 3.828 -1.892 7.384 -5.06 9.513 C 83.072 81.069 80.893 81.733 78.637 81.733 z M 11.363 26.182 C 8.406 26.182 6 28.618 6 31.613 v 38.688 c 0 2.995 2.406 5.432 5.363 5.432 h 67.273 c 1.06 0 2.082 -0.311 2.957 -0.899 C 83.101 73.822 84 72.128 84 70.302 V 31.613 c 0 -2.995 -2.406 -5.432 -5.363 -5.432 h -4.552 c -3.983 0 -7.623 -2.196 -9.496 -5.732 l -1.375 -2.591 c -1.175 -2.216 -3.447 -3.593 -5.933 -3.593 H 32.719 c -2.485 0 -4.758 1.376 -5.933 3.592 l -1.374 2.592 c -1.252 2.361 -3.318 4.165 -5.818 5.08 c -1.183 0.432 -2.42 0.651 -3.679 0.651 H 11.363 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" />
                                    <path d="M 45 71.412 c -12.075 0 -21.899 -9.894 -21.899 -22.054 c 0 -5.886 2.275 -11.421 6.406 -15.586 c 2.113 -2.13 4.586 -3.776 7.351 -4.892 c 2.591 -1.046 5.331 -1.576 8.143 -1.576 c 12.075 0 21.899 9.893 21.899 22.054 c 0 2.824 -0.524 5.578 -1.558 8.185 c -1.105 2.782 -2.736 5.272 -4.849 7.401 C 56.355 69.115 50.854 71.412 45 71.412 z M 45 33.305 c -2.039 0 -4.023 0.383 -5.897 1.14 c -2.005 0.81 -3.8 2.005 -5.336 3.554 c -3.009 3.033 -4.666 7.068 -4.666 11.36 c 0 8.852 7.132 16.054 15.899 16.054 c 4.242 0 8.231 -1.667 11.233 -4.693 c 1.539 -1.551 2.727 -3.364 3.531 -5.39 c 0.753 -1.897 1.135 -3.907 1.135 -5.971 C 60.899 40.506 53.767 33.305 45 33.305 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" />
                                    <ellipse cx="75.184" cy="33.831" rx="3.234" ry="3.261" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) "/>
                                </g>
                            </svg>
                        </a>
                        <a href="/mindex" class="ps-2">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="black" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9.14373 20.7821V17.7152C9.14372 16.9381 9.77567 16.3067 10.5584 16.3018H13.4326C14.2189 16.3018 14.8563 16.9346 14.8563 17.7152V20.7732C14.8562 21.4473 15.404 21.9951 16.0829 22H18.0438C18.9596 22.0023 19.8388 21.6428 20.4872 21.0007C21.1356 20.3586 21.5 19.4868 21.5 18.5775V9.86585C21.5 9.13139 21.1721 8.43471 20.6046 7.9635L13.943 2.67427C12.7785 1.74912 11.1154 1.77901 9.98539 2.74538L3.46701 7.9635C2.87274 8.42082 2.51755 9.11956 2.5 9.86585V18.5686C2.5 20.4637 4.04738 22 5.95617 22H7.87229C8.19917 22.0023 8.51349 21.8751 8.74547 21.6464C8.97746 21.4178 9.10793 21.1067 9.10792 20.7821H9.14373Z" fill="#777"></path>
                            </svg>
                        </a>
                    `;

                    $('.right-content').html(jstext);
                } else if (data.dtype == 4) {
                    if ((roleID==1)||((roleID==2)&&(divisionID==3))) {
                        $('.right-content').html(` 
                            <a href="javascript:void(0)" class="px-2 checkedBtn">						
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 256 256" >
                                    <g style="stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: none; fill-rule: nonzero; opacity: 1;" transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)" >
                                        <circle cx="45" cy="45" r="45" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(40,201,55); fill-rule: nonzero; opacity: 1;" transform="  matrix(1 0 0 1 0 0) "/>
                                        <path d="M 38.478 64.5 c -0.01 0 -0.02 0 -0.029 0 c -1.3 -0.009 -2.533 -0.579 -3.381 -1.563 L 21.59 47.284 c -1.622 -1.883 -1.41 -4.725 0.474 -6.347 c 1.884 -1.621 4.725 -1.409 6.347 0.474 l 10.112 11.744 L 61.629 27.02 c 1.645 -1.862 4.489 -2.037 6.352 -0.391 c 1.862 1.646 2.037 4.49 0.391 6.352 l -26.521 30 C 40.995 63.947 39.767 64.5 38.478 64.5 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(255,255,255); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" />
                                    </g>
                                </svg>
                            </a>
                            <a href="javascript:void(0)" class="px-2 importantBtn">						
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 256 256" >
                                    <g style="stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: none; fill-rule: nonzero; opacity: 1;" transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)" >
                                        <path d="M 45 90 C 20.187 90 0 69.813 0 45 C 0 20.187 20.187 0 45 0 c 24.813 0 45 20.187 45 45 C 90 69.813 69.813 90 45 90 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(229,0,0); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" />
                                        <path d="M 45 57.469 L 45 57.469 c -1.821 0 -3.319 -1.434 -3.399 -3.252 L 38.465 23.95 c -0.285 -3.802 2.722 -7.044 6.535 -7.044 h 0 c 3.813 0 6.82 3.242 6.535 7.044 l -3.137 30.267 C 48.319 56.036 46.821 57.469 45 57.469 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(255,255,255); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" />
                                        <circle cx="45" cy="67.67" r="5.42" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(255,255,255); fill-rule: nonzero; opacity: 1;" transform="  matrix(1 0 0 1 0 0) "/>
                                    </g>
                                </svg>
                            </a>
                            <a href="javascript:void(0)" class="px-2 closedBtn">						
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 256 256" >
                                    <g style="stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: none; fill-rule: nonzero; opacity: 1;" transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)" >
                                        <circle cx="45" cy="45" r="45" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(32,143,232); fill-rule: nonzero; opacity: 1;" transform="  matrix(1 0 0 1 0 0) "/>
                                        <path d="M 67.5 26.867 H 56.375 v -3.973 c 0 -1.104 -0.896 -2 -2 -2 s -2 0.896 -2 2 v 3.973 h -14.75 v -3.973 c 0 -1.104 -0.896 -2 -2 -2 s -2 0.896 -2 2 v 3.973 H 22.5 c -1.104 0 -2 0.896 -2 2 v 12.9 v 25.339 c 0 1.104 0.896 2 2 2 h 45 c 1.104 0 2 -0.896 2 -2 V 41.767 v -12.9 C 69.5 27.763 68.604 26.867 67.5 26.867 z M 24.5 30.867 h 9.125 v 2.837 c 0 1.104 0.896 2 2 2 s 2 -0.896 2 -2 v -2.837 h 14.75 v 2.837 c 0 1.104 0.896 2 2 2 s 2 -0.896 2 -2 v -2.837 H 65.5 v 8.9 h -41 V 30.867 z M 65.5 65.106 h -41 V 43.767 h 41 V 65.106 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(255,255,255); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" />
                                    </g>
                                </svg>
                            </a> 
                            <a href="/mindex" class="ps-2">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="black" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9.14373 20.7821V17.7152C9.14372 16.9381 9.77567 16.3067 10.5584 16.3018H13.4326C14.2189 16.3018 14.8563 16.9346 14.8563 17.7152V20.7732C14.8562 21.4473 15.404 21.9951 16.0829 22H18.0438C18.9596 22.0023 19.8388 21.6428 20.4872 21.0007C21.1356 20.3586 21.5 19.4868 21.5 18.5775V9.86585C21.5 9.13139 21.1721 8.43471 20.6046 7.9635L13.943 2.67427C12.7785 1.74912 11.1154 1.77901 9.98539 2.74538L3.46701 7.9635C2.87274 8.42082 2.51755 9.11956 2.5 9.86585V18.5686C2.5 20.4637 4.04738 22 5.95617 22H7.87229C8.19917 22.0023 8.51349 21.8751 8.74547 21.6464C8.97746 21.4178 9.10793 21.1067 9.10792 20.7821H9.14373Z" fill="#777"></path>
                                </svg>
                            </a>  
                        `);
                    } else {
                        $('.right-content').html(` 
                            <a href="javascript:void(0)" class="px-2 reloadBtn">						
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 256 256" >
                                    <g style="stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: none; fill-rule: nonzero; opacity: 1;" transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)" >
                                        <path d="M 7.288 48.34 c 0.061 0.04 0.129 0.068 0.193 0.105 c 0.18 0.105 0.363 0.201 0.559 0.277 c 0.093 0.036 0.19 0.06 0.286 0.089 c 0.175 0.053 0.351 0.098 0.535 0.127 c 0.049 0.008 0.094 0.028 0.144 0.034 C 9.164 48.99 9.322 49 9.481 49 c 0 0 0 0 0.001 0 c 0 0 0 0 0 0 c 0 0 0 0 0 0 c 0.267 0 0.531 -0.028 0.79 -0.08 c 0.154 -0.031 0.297 -0.086 0.443 -0.134 c 0.101 -0.033 0.206 -0.054 0.304 -0.094 c 0.162 -0.067 0.31 -0.158 0.46 -0.245 c 0.075 -0.043 0.156 -0.075 0.228 -0.124 c 0.217 -0.146 0.42 -0.311 0.604 -0.495 c 0 0 0 0 0 0 l 7.492 -7.492 c 1.562 -1.562 1.562 -4.095 0 -5.657 c -1.149 -1.149 -2.822 -1.445 -4.249 -0.903 c 4.535 -11.868 16.033 -20.322 29.475 -20.322 c 12.266 0 23.516 7.2 28.658 18.342 c 0.926 2.004 3.3 2.881 5.309 1.956 c 2.005 -0.926 2.881 -3.302 1.955 -5.308 C 74.503 14.478 60.403 5.455 45.027 5.455 c -17.837 0 -32.947 11.873 -37.859 28.129 c -1.224 -1.611 -3.48 -2.084 -5.247 -1.008 c -1.887 1.148 -2.486 3.609 -1.338 5.496 l 5.481 9.007 c 0.014 0.023 0.035 0.041 0.049 0.063 c 0.125 0.195 0.268 0.375 0.424 0.545 c 0.036 0.039 0.064 0.085 0.101 0.122 C 6.835 48.009 7.053 48.186 7.288 48.34 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" />
                                        <path d="M 89.416 51.929 l -5.48 -9.008 c -0.014 -0.023 -0.035 -0.04 -0.049 -0.063 c -0.125 -0.195 -0.268 -0.375 -0.424 -0.546 c -0.035 -0.039 -0.063 -0.084 -0.1 -0.121 c -0.197 -0.199 -0.415 -0.376 -0.65 -0.531 c -0.061 -0.04 -0.129 -0.067 -0.192 -0.104 c -0.18 -0.105 -0.364 -0.201 -0.56 -0.277 c -0.093 -0.036 -0.19 -0.06 -0.287 -0.089 c -0.174 -0.053 -0.35 -0.098 -0.534 -0.127 c -0.049 -0.008 -0.095 -0.028 -0.144 -0.034 c -0.07 -0.008 -0.138 0.003 -0.208 -0.001 C 80.697 41.021 80.611 41 80.519 41 c -0.082 0 -0.159 0.019 -0.239 0.024 c -0.121 0.007 -0.24 0.018 -0.36 0.036 c -0.172 0.026 -0.338 0.065 -0.503 0.113 c -0.105 0.03 -0.209 0.058 -0.312 0.097 c -0.178 0.067 -0.344 0.152 -0.509 0.243 c -0.082 0.045 -0.166 0.082 -0.245 0.133 c -0.237 0.153 -0.46 0.326 -0.659 0.524 c 0 0 -0.001 0.001 -0.001 0.001 l 0 0 l 0 0 l -7.492 7.492 c -1.562 1.562 -1.562 4.095 0 5.656 c 1.148 1.15 2.822 1.446 4.249 0.904 c -4.535 11.868 -16.033 20.321 -29.475 20.321 c -12.707 0 -24.117 -7.563 -29.068 -19.268 c -0.861 -2.034 -3.209 -2.988 -5.242 -2.125 c -2.035 0.86 -2.986 3.207 -2.126 5.242 c 6.206 14.671 20.508 24.151 36.436 24.151 c 17.831 0 32.937 -11.864 37.854 -28.111 c 0.774 1.015 1.96 1.574 3.176 1.574 c 0.708 0 1.426 -0.188 2.075 -0.584 C 89.966 56.276 90.565 53.816 89.416 51.929 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" />
                                    </g>
                                </svg>
                            </a>
                            <a href="/mindex" class="ps-2">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="black" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9.14373 20.7821V17.7152C9.14372 16.9381 9.77567 16.3067 10.5584 16.3018H13.4326C14.2189 16.3018 14.8563 16.9346 14.8563 17.7152V20.7732C14.8562 21.4473 15.404 21.9951 16.0829 22H18.0438C18.9596 22.0023 19.8388 21.6428 20.4872 21.0007C21.1356 20.3586 21.5 19.4868 21.5 18.5775V9.86585C21.5 9.13139 21.1721 8.43471 20.6046 7.9635L13.943 2.67427C12.7785 1.74912 11.1154 1.77901 9.98539 2.74538L3.46701 7.9635C2.87274 8.42082 2.51755 9.11956 2.5 9.86585V18.5686C2.5 20.4637 4.04738 22 5.95617 22H7.87229C8.19917 22.0023 8.51349 21.8751 8.74547 21.6464C8.97746 21.4178 9.10793 21.1067 9.10792 20.7821H9.14373Z" fill="#777"></path>
                                </svg>
                            </a>  
                        `);

                    }
                }
  
            }
        
            let htmlTxt = ` `;
            if (data.dtype ==1) {
                htmlTxt += `
                <div class="card-body ">
                    <div class="row">
                        <div style="text-align: center;" id="videoplayer"></div>
                    </div>
                    <div class="row">
                        <input style="display:none;"
                            type="file"
                            id="videocapture"
                            capture="environment"
                            accept="video/*"
                        >
                    </div>
                    <div class="row">
                        <button class="btn btn-warning btn-sm delVideo" style="font-size:'30px';" ${data.status>0?'hidden':''} >
                            ${formatMessage('delete')} Video &nbsp;&nbsp;
                            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="20" height="20"  fill="white" viewBox="0 0 109.484 122.88" enable-background="new 0 0 109.484 122.88" xml:space="preserve">
                                <g><path fill-rule="evenodd" clip-rule="evenodd" d="M2.347,9.633h38.297V3.76c0-2.068,1.689-3.76,3.76-3.76h21.144 c2.07,0,3.76,1.691,3.76,3.76v5.874h37.83c1.293,0,2.347,1.057,2.347,2.349v11.514H0V11.982C0,10.69,1.055,9.633,2.347,9.633 L2.347,9.633z M8.69,29.605h92.921c1.937,0,3.696,1.599,3.521,3.524l-7.864,86.229c-0.174,1.926-1.59,3.521-3.523,3.521h-77.3 c-1.934,0-3.352-1.592-3.524-3.521L5.166,33.129C4.994,31.197,6.751,29.605,8.69,29.605L8.69,29.605z M69.077,42.998h9.866v65.314 h-9.866V42.998L69.077,42.998z M30.072,42.998h9.867v65.314h-9.867V42.998L30.072,42.998z M49.572,42.998h9.869v65.314h-9.869 V42.998L49.572,42.998z"/></g>
                            </svg>
                        </button>
                    </div>
                </div>
                `;
                //console.log(htmlTxt)
                $('.card').html(htmlTxt);
            
            } else if (data.dtype ==3) {
                htmlTxt += `
                    <div class="card-body ">
                        <div class="image-set" id="imagex"></div>
                    </div>
                `;
                //console.log(htmlTxt)
                $('.card').html(htmlTxt);
            } else if (data.dtype ==4) {
                htmlTxt += `<div class="fw-bold text-start bg-light"  id="diarytitle"></div>`;
                $.post(`/getdiarymsg`, { 
                    'diaryID': diaryID
                }).done(function (datx){
                    //console.log(datx)
                    htmlTxt += `<div class="card-body "> `;
                    if (datx.length > 0) {
                        datx.forEach((f, index) => {
                            let myDate = new Date(f.dateAdded);
                            let dateExp = formatAMPM(myDate);
                            let curDate = new Date();
                            const dateDifferenceInMinutes = (dateInitial, dateFinal) => Math.round((dateFinal - dateInitial) / 60000);
                              
                            let mindiff =  dateDifferenceInMinutes(myDate,curDate);
                            htmlTxt += `
                                <div class="chat-content ${f.teammemberID==f.staffID?'':'user'}" id="div_${f.diarymsgID}" >
                                    <div class="message-item">
                                        <div class="message-time">${f.teammember.substring(0,18) + ' '+dateExp}</div>  
                                        <div class="bubble">${f.note}</div>    
                                    </div>`;
                            if (mindiff < delayMin) {
                                htmlTxt += `        
                                    <div class="emoji-icon">
                                        <a href="javascript:void(0);" class="btn-msgdel" id="btn_${f.diarymsgID}">
                                            <i class="fa fa-minus-circle" style="font-size:16px;color:red"></i>
                                        </a>
                                    </div>  
                                    `;
                            }            
                            htmlTxt += `    
                                </div>
                            `;
                        })
                        htmlTxt += ` </div>`;
                        //console.log(htmlTxt)
                        initChat(htmlTxt, data) ;
                        $('.btn-msgdel').on('click', function(){
                            var idx = this.id.split("_")[1];
                            $.post(`/delete/diarymsg`, { data: JSON.stringify({diarymsgID: this.id.split("_")[1]})}, function(datx){
                                $(`#div_${idx}`).remove();
                            })
                        })
                    } else {
                        htmlTxt += `</div>`;
                        initChat(htmlTxt, data) ;
                        
                    }
                })
            }

            $('#videorecording').html(formatMessage('videorecording'));
            $('#imagerecording').html(formatMessage('imagerecording'));

            /***********************************************************/
            if (data.dtype == 1) { /************* VIDEO  **************/
                $('#videox').removeAttr("hidden");
                $('#videoplayer').html($('<video />', {
                    id: 'videox',
                    src: `./public/${subdir}/${data.note}`,
                    type: 'video/mp4',
                    controls: true,
                    autoplay: true,
                    width: 320,
                    height: 480
                }));
                $("#videox").css('object-fit:contain');
                $("#videox")[0].play();
                $('.delVideo').on('click', function(e) {
                    e.preventDefault();
                    let url = `/deletefiles/diary/diaryID/${diaryID}/${subdir}/note`;
                    $.post(url, { 
                    }).done(function (datx){
                        let result = JSON.parse(datx)
                        if (result.status == 1) {
                            window.location = `/mdiarylist?${cid}`
                        } else {
                            screenLog(formatMessage('updatefailed'), 'error')
                        }
                    })
                })
                $('.checkedBtn').on('click', function(e){
                    e.preventDefault();
                    $.post(`/update/diary`, {
                        diaryID: data.diaryID,
                        status: 1,
                    }, function(datx){
                        window.location = `/mdiarylisting?${cid}`;
                    })
                })
           
            } else if (data.dtype == 3) { /*************** IMAGES  ****************/
                if ( data.note &&  data.note != null) {
                    let imageText = '';
                    let imageA = data.note.split(",");
                    imageA.forEach((m, index)=> {
                        console.log(m)
                        imageText += `
                        <a data-title="${data.dateAdded}_${index}"
                            href="public/${subdir}/${m}" style="object-fit:cover">
                            <img src="public/${subdir}/${m}" alt="" width='75' height='80'>
                        </a>
                        `;
                    })
                    $('#imagex').html(imageText);
                    $('.image-set a').on('click', function (e) {
                        e.preventDefault();
                        var items = $('.image-set a').get().map(function (el) {
                            return {
                                src: $(el).attr('href'),
                                title: $(el).attr('data-title')
                            }
                        });
                        var options = {
                            index: $(this).index(),
                            resizable: false,
                            headerToolbar: ['close'],
                            multiInstances: false
                        };
                        new PhotoViewer(items, options);
                    });  
                    initImageView(imageA, data.status);          
                } else {
                    $('#imagex').html('');  
                    initImageView([], data.status);  
                }
                $('.checkedBtn').on('click', function(e){
                    e.preventDefault();
                    $.post(`/update/diary`, {
                        diaryID: data.diaryID,
                        status: 1,
                    }, function(datx){
                        window.location = `/mdiarylisting?${cid}`;
                    })
                })
            } else if (data.dtype == 4) { /*************** NOTE  ****************/
                let myDate = new Date(data.dateAdded);
                let dateExp =  myDate.getDate() + '/' + (myDate.getMonth() + 1)  + '/' + myDate.getFullYear();
                $('#diarytitle').html(data.note.substring(0,64) + '. ' + dateExp);
                $('.reloadBtn').on('click', function(e){
                    e.preventDefault();
                    getDiary();
                })
                $('.checkedBtn').on('click', function(e){
                    e.preventDefault();
                    $.post(`/update/diary`, {
                        diaryID: data.diaryID,
                        status: 1,
                    }, function(datx){
                        window.location = `/mdiarylisting?${cid}`;
                    })
                })
                $('.importantBtn').on('click', function(e){
                    e.preventDefault();
                    $.post(`/update/diary`, {
                        diaryID: data.diaryID,
                        status: 2,
                    }, function(datx){
                        window.location = `/mdiarylisting?${cid}`;
                    })
                })
                $('.closedBtn').on('click', function(e){
                    e.preventDefault();
                    $.post(`/update/diary`, {
                        diaryID: data.diaryID,
                        status: 3,
                    }, function(datx){
                        window.location = `/mdiarylisting?${cid}`;
                    })
                })
                
            }
            //var videoCanvas = document.getElementById('offcanvasLeft')
            //var vidcanvas = new bootstrap.Offcanvas(videoCanvas); 
            //vidcanvas.show();
        } else{
            screenLog(formatMessage('youhavemptydiary'), 'warning')
        }
        
    })
}

function initChat(htmlTxt, data) {
    //console.log(htmlTxt)
    $('.chat-box-area').html(htmlTxt);
    let myDate = new Date(data.dateAdded);
    let dateExp =  myDate.getDate() + '/' + (myDate.getMonth() + 1)  + '/' + myDate.getFullYear();
    $('#diarytitle').html(data.note.substring(0,64) + '. ' + dateExp);
    if (data.status < 3) {
        $('.footer').html(`
            <div class="container p-2">
                <div class="chat-footer">
                    <form>
                        <div class="form-group boxed">
                            <div class="input-wrapper message-area">
                                <input type="text" class="form-control" placeholder="Type message...">
                                <a href="javascript:void(0);" class="btn btn-chat btn-icon btn-secondary p-0 btn-rounded">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <path d="M21.4499 11.11L3.44989 2.11C3.27295 2.0187 3.07279 1.9823 2.87503 2.00546C2.67728 2.02862 2.49094 2.11029 2.33989 2.24C2.18946 2.37064 2.08149 2.54325 2.02982 2.73567C1.97815 2.9281 1.98514 3.13157 2.04989 3.32L4.99989 12L2.09989 20.68C2.05015 20.8267 2.03517 20.983 2.05613 21.1364C2.0771 21.2899 2.13344 21.4364 2.2207 21.5644C2.30797 21.6924 2.42378 21.7984 2.559 21.874C2.69422 21.9496 2.84515 21.9927 2.99989 22C3.15643 21.9991 3.31057 21.9614 3.44989 21.89L21.4499 12.89C21.6137 12.8061 21.7512 12.6786 21.8471 12.5216C21.9431 12.3645 21.9939 12.184 21.9939 12C21.9939 11.8159 21.9431 11.6355 21.8471 11.4784C21.7512 11.3214 21.6137 11.1939 21.4499 11.11ZM4.70989 19L6.70989 13H16.7099L4.70989 19ZM6.70989 11L4.70989 5L16.7599 11H6.70989Z" fill="#fff"/>
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </form>
                </div>    
            </div>
        `);
        $('.btn-chat').on('click', function() {
            var chatInput = $('.message-area .form-control');
            var chatMessageValue = chatInput.val();
            
            let myDate = new Date();
            let dateExp = formatAMPM(myDate);

            $.post(`/new/diarymsg`, {data:JSON.stringify({diaryID:data.diaryID, note:chatMessageValue, teammemberID:memberID})}, function(datx){
                var messageHtml = `
                <div class="chat-content ${memberID==data.staffID?'':'user'}" id="div_${datx.newid}">
                    <div class="message-item">
                        <div class="message-time">${memberName.substring(0,18) + ' '+dateExp}</div>
                        <div class="bubble">${chatMessageValue}</div>
                    </div>
                    <div class="emoji-icon">
                        <a href="javascript:void(0);" class="btn-msgdel" id="btn_${datx.newid}">
                            <i class="fa fa-minus-circle" style="font-size:16px;color:red"></i>
                        </a>
                    </div>  
                </div>
                `;
                if(chatMessageValue.length > 0){
                    $('.chat-box-area').append(messageHtml);
                    $('.btn-msgdel').on('click', function(){
                        let idx = this.id.split("_")[1];
                        $.post(`/delete/diarymsg`, { data: JSON.stringify({diarymsgID: this.id.split("_")[1]})}, function(datx){
                            $(`#div_${idx}`).remove();
                        })
                    })
                }
                
                window.scrollTo(0, document.body.scrollHeight);
                chatInput.val(''); 
            })
            
        });
    }
    
}

function formatAMPM(date) {
    var datex = date.getDate();
    var monthx = date.getMonth()+1;
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = datex + '/' +monthx + ' ' +hours + ':' + minutes + ' ' + ampm;
    return strTime;
  }

//************  VIDEO  *************/
$('#vrecordButton').html(`<i class="fa fa-video-camera fa-md" aria-hidden="true"></i>`);

$('#vrecordButton').on('click', function(e) {
    e.preventDefault();
    // button settings
    vrecordButton.disabled = true;
    
    $("#vrecordButton").addClass("button-animate");

    $('#videocapturex').click();

})

$('#videocapturex').on('change', function(e){
    $("#vrecordButton").removeClass("button-animate");
    vrecordButton.disabled = false;
    while (vrecordingsList.hasChildNodes()) {
        vrecordingsList.removeChild(vrecordingsList.lastChild);
    }
    
    var url = URL.createObjectURL(this.files[0]);
    var li = document.createElement('li');
    $('#videoplayerx').html($('<video />', {
        id: 'videoy',
        src: url,
        type: 'video/*',
        controls: true,
        autoplay: true,
        width: 270,
        height: 480
    }));
    
    var filenamex = 'DV'+ (Math.floor(new Date().getTime() / 1000)).toString()+ '.mp4';

     //upload link 
    var uploadx = document.createElement('a');
    var file = this.files[0];
    uploadx.href = "#";
    uploadx.classList.add("btn", "btn-success", "btn-md", "text-dark", "px-4", "py-3", "mt-3");
    uploadx.innerHTML = `<i class="fa fa-upload fa-lg" aria-hidden="true"></i>&nbsp;&nbsp;&nbsp;${formatMessage('save')}`;
    uploadx.addEventListener("click", function(event) {
        var xhr = new XMLHttpRequest();
        xhr.onload = function(e) {
            if (this.readyState === 4) {
                let data = JSON.parse(e.target.responseText)
                if (data.status == 1) {
                    window.location.reload(true);
                } else {
                    screenLog(formatMessage('updatefailed'), 'error')
                }
            } 
        };
        var fd = new FormData();
        fd.append("videonote", file, filenamex);
        xhr.open("POST", `/uploadfiles/diary/diaryID/${diaryID}/${subdir}`, true);
        xhr.send(fd);
    })
    li.appendChild(document.createTextNode(" ")) //add a space in between 
    li.style.display = 'flex';
    li.style.alignItems = 'center';
    li.style.flexDirection = 'column';

    li.appendChild(uploadx) //add the upload link to li

    vrecordingsList.appendChild(li);
})

/****************  IMAGES ************************ */
    function initImageView(r1, status) {

        const maxFileUpload = 6;
        var docImg=[];
        var docPreview=[];
        r1.forEach(function (datax) {
            //console.log('datax: '+JSON.stringify(datax));
            docImg.push(`public/${subdir}/${datax}`);
            let doc;
            if (status > 0) {
                doc = {width:"120px"}
            } else [
                doc = {width:"120px", url: `/deletefiles/diary/diaryID/${diaryID}/${subdir}/note/${datax}`}
            ]
            docPreview.push(doc);
        })
        //console.dir('docImg: '+docImg);
        //console.dir('docPreview: '+JSON.stringify(docPreview));

        var fileuploadOptions = {
            theme: 'fa5',
            append: true,
            language: 'vi',
            uploadAsync: false,
            browseOnZoneClick: false,
            overwriteInitial: true,
            initialPreviewAsData: true,
            initialPreview: docImg,
            initialPreviewConfig: docPreview,
            maxFileCount: maxFileUpload,
            maxFileSize: 10000,
            initialCaption: formatMessage('fileselect'),
            autoOrientImage: true,
        };
        //console.log('status: ' + status)
        if (status > 0) {
            $.extend(fileuploadOptions,{
                showUpload: false,
                showBrowse: false,
                showRemove: false,
                showCaption: false,
                fileActionSettings: {
                showDrag: false,
                showZoom: true,
                showUpload: false,
                showRemove: false,
                },
            });
            } else {
            $.extend(fileuploadOptions,{
                uploadUrl: `/uploadfiles/diary/diaryID/${diaryID}/${subdir}`,
                deleteUrl: `/deletefiles/diary/diaryID/${diaryID}/${subdir}/note`,
                uploadIcon : "<i class='fas fa-upload'></i>",
                removeIcon : "<i class='fas fa-trash-alt'></i>",
                browseIcon : "<i class='fas fa-folder-open'></i>",
                removeClass : 'btn btn-danger',
                allowedFileExtensions: ["jpg", "png", "gif", "pdf", "jpeg"]
            });
        }
        $("#file_upload").fileinput(fileuploadOptions)
        .on('fileuploaded', function(event, previewId, index, fileId) {
            console.log('File Uploaded', 'ID: ' + fileId + ', Thumb ID: ' + previewId);
            window.location.reload();
         }).on('filedeleted', function(event, previewId, index, fileId) {
            console.log('File Deleted');
            getDiary();
         }).on('fileuploaderror', function(event, data, msg) {
            console.log('File Upload Error');
         }).on('filebatchuploadcomplete', function(event, preview, config, tags, extraData) {
            console.log('File Batch Uploaded', preview, config, tags, extraData);
            getDiary();
         });;
    }


    $.fn.fileinputLocales['vi'] = {
        sizeUnits: ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'], 
        bitRateUnits: ['B/s', 'KB/s', 'MB/s', 'GB/s', 'TB/s', 'PB/s', 'EB/s', 'ZB/s', 'YB/s'],
        fileSingle: 'file',
        filePlural: 'files',
        browseLabel: `${formatMessage('browse')} &hellip;`,
        removeLabel: formatMessage('delete'),
        removeTitle: 'Clear selected files',
        cancelLabel: 'Cancel',
        cancelTitle: 'Abort ongoing upload',
        pauseLabel: 'Pause',
        pauseTitle: 'Pause ongoing upload',
        uploadLabel: formatMessage('upload'),
        uploadTitle: 'Upload selected files',
        msgNo: 'No',
        msgNoFilesSelected: 'No files selected',
        msgPaused: 'Paused',
        msgCancelled: formatMessage('cancel'),
        msgPlaceholder: 'Select {files} ...',
        msgZoomModalHeading: 'Detailed Preview',
        msgFileRequired: 'You must select a file to upload.',
        msgSizeTooSmall: 'File "{name}" (<b>{size}</b>) is too small and must be larger than <b>{minSize}</b>.',
        msgSizeTooLarge: 'File "{name}" (<b>{size}</b>) exceeds maximum allowed upload size of <b>{maxSize}</b>.',
        msgFilesTooLess: 'You must select at least <b>{n}</b> {files} to upload.',
        msgFilesTooMany: 'Number of files selected for upload <b>({n})</b> exceeds maximum allowed limit of <b>{m}</b>.',
        msgTotalFilesTooMany: 'You can upload a maximum of <b>{m}</b> files (<b>{n}</b> files detected).',
        msgFileNotFound: 'File "{name}" not found!',
        msgFileSecured: 'Security restrictions prevent reading the file "{name}".',
        msgFileNotReadable: 'File "{name}" is not readable.',
        msgFilePreviewAborted: 'File preview aborted for "{name}".',
        msgFilePreviewError: 'An error occurred while reading the file "{name}".',
        msgInvalidFileName: 'Invalid or unsupported characters in file name "{name}".',
        msgInvalidFileType: 'Invalid type for file "{name}". Only "{types}" files are supported.',
        msgInvalidFileExtension: 'Invalid extension for file "{name}". Only "{extensions}" files are supported.',
        msgFileTypes: {
            'image': 'image',
            'html': 'HTML',
            'text': 'text',
            'video': 'video',
            'audio': 'audio',
            'flash': 'flash',
            'pdf': 'PDF',
            'object': 'object'
        },
        msgUploadAborted: 'The file upload was aborted',
        msgUploadThreshold: 'Processing &hellip;',
        msgUploadBegin: 'Initializing &hellip;',
        msgUploadEnd: 'Done',
        msgUploadResume: 'Resuming upload &hellip;',
        msgUploadEmpty: formatMessage('nodataupload'),
        msgUploadError: 'Upload Error',
        msgDeleteError: 'Delete Error',
        msgProgressError: 'Error',
        msgValidationError: 'Validation Error',
        msgLoading: 'Loading file {index} of {files} &hellip;',
        msgProgress: 'Loading file {index} of {files} - {name} - {percent}% completed.',
        msgSelected: '{n} {files} selected',
        msgProcessing: 'Processing ...',
        msgFoldersNotAllowed: 'Drag & drop files only! Skipped {n} dropped folder(s).',
        msgImageWidthSmall: 'Width of image file "{name}" must be at least <b>{size} px</b> (detected <b>{dimension} px</b>).',
        msgImageHeightSmall: 'Height of image file "{name}" must be at least <b>{size} px</b> (detected <b>{dimension} px</b>).',
        msgImageWidthLarge: 'Width of image file "{name}" cannot exceed <b>{size} px</b> (detected <b>{dimension} px</b>).',
        msgImageHeightLarge: 'Height of image file "{name}" cannot exceed <b>{size} px</b> (detected <b>{dimension} px</b>).',
        msgImageResizeError: 'Could not get the image dimensions to resize.',
        msgImageResizeException: 'Error while resizing the image.<pre>{errors}</pre>',
        msgAjaxError: 'Something went wrong with the {operation} operation. Please try again later!',
        msgAjaxProgressError: '{operation} failed',
        msgDuplicateFile: 'File "{name}" of same size "{size}" has already been selected earlier. Skipping duplicate selection.',
        msgResumableUploadRetriesExceeded:  'Upload aborted beyond <b>{max}</b> retries for file <b>{file}</b>! Error Details: <pre>{error}</pre>',
        msgPendingTime: '{time} remaining',
        msgCalculatingTime: 'calculating time remaining',
        ajaxOperations: {
            deleteThumb: 'file delete',
            uploadThumb: 'file upload',
            uploadBatch: 'batch file upload',
            uploadExtra: 'form data upload'
        },
        dropZoneTitle: 'Drag & drop files here &hellip;',
        dropZoneClickTitle: '<br>(or click to select {files})',
        fileActionSettings: {
            removeTitle: 'Remove file',
            uploadTitle: 'Upload file',
            uploadRetryTitle: 'Retry upload',
            downloadTitle: 'Download file',
            rotateTitle: 'Rotate 90 deg. clockwise',
            zoomTitle: 'View details',
            dragTitle: 'Move / Rearrange',
            indicatorNewTitle: 'Not uploaded yet',
            indicatorSuccessTitle: 'Uploaded',
            indicatorErrorTitle: 'Upload Error',
            indicatorPausedTitle: 'Upload Paused',
            indicatorLoadingTitle:  'Uploading &hellip;'
        },
        previewZoomButtonTitles: {
            prev: 'View previous file',
            next: 'View next file',
            rotate: 'Rotate 90 deg. clockwise',
            toggleheader: 'Toggle header',
            fullscreen: 'Toggle full screen',
            borderless: 'Toggle borderless mode',
            close: 'Close detailed preview'
        }
    };


})