
$(() => {
    $('.pagetitle').html(`${formatMessage("antifakememberid")}`);
    setCountDown(60)

    function setCountDown (sec) {
        var timer = setInterval(function() {
           // $('#hideMsg span').animate({
           //     opacity: 0.25,
           // }, 500, function() {
                $('#hideMsg span').css('z-index', 100);
                $('#hideMsg span').css('opacity', 1);
                $('#hideMsg span').text(pad(sec--,2));
           // })
        
            if (sec == -1) {
                //$('#hideMsg').fadeOut('fast');
                clearInterval(timer);
                window.location.reload()
            }
        }, 1000);
    }


    function pad(num, size) {
        num = num.toString();
        while (num.length < size) num = "0" + num;
        return num;
      }
})
