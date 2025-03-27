
$(() => {
    $('.pagetitle').html(`${formatMessage("language")}`);
    var langTxt = ``;
    locales.forEach(m => {
        langTxt += `
            <li class="radio square-radio">
                <label class="radio-label">${m.name}
                    <input type="radio" ${locale==m.value?'checked':''} name="langradio" value="${m.value}">
                    <span class="checkmark"></span>
                </label>
            </li>
        `;
    })
    console.log(langTxt);
    $('.lanuage-area').html(langTxt);

    $('[name="langradio"]').on('change',function(){
        changeLocale($(this).val())
    });

})
