var ApplicationController = function () {

};

ApplicationController.changePaymentType = function (context) {
    var button = $(context);
    if (button.attr('id') == "avalanche-btn") {
        if (button.hasClass('btn-default')) {
            button.removeClass('btn-default').addClass('btn-primary');
            $("#snowball-btn").removeClass('btn-primary').addClass('btn-default');
            window.payment_type = "avalanche";
        }
    }
    else { //snowball clicked
        if (button.hasClass('btn-default')) {
            button.removeClass('btn-default').addClass('btn-primary');
            $("#avalanche-btn").removeClass('btn-primary').addClass('btn-default');
            window.payment_type = "snowball";
        }


    }
};