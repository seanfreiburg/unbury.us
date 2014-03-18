$(function () {

    // Setup
    var loanApp = new Unburyme.LoanApp();
    loanApp.createLoan();

    var emailLink = '<a href=\'mailto:jsantell@gmail.com\' title=\'email Jordan Santell\'>jsantell@gmail.com</a>';
    $('#email').html(emailLink);


    // Creating/destroying Loans, Payment Type

    $(".paymentTypeButtonLink").click(function () {

        if ($(this).is('.avaLink')) {
            $('#avalanche').removeClass('unselectedPaymentType').addClass('selectedPaymentType');
            $('#snowball').removeClass('selectedPaymentType').addClass('unselectedPaymentType');
            loanApp.paymentType = 'avalanche';
        }
        else {
            $('#snowball').removeClass('unselectedPaymentType').addClass('selectedPaymentType');
            $('#avalanche').removeClass('selectedPaymentType').addClass('unselectedPaymentType');
            loanApp.paymentType = 'snowball';
        }
        calculate();

    });


    $('.createLoanPlus').live('click', function () {

        loanApp.createLoan();
    });


    $('.destroyLoan').live('click', function () {

        var deleteID = $(this).attr('id').substr(6);
        loanApp.destroyLoan(deleteID);
        calculate();
    });


    // Slider
    $('#paymentSlider').slider({

        value: 100,
        min: 0,
        max: 5000,
        animate: true,
        slide: function (event, ui) {
            $('#totalMonthlyPayment').val(logPositionToPayment(ui.value));
            loanApp.updatePayment(logPositionToPayment(ui.value));
            sliderCalculate(logPositionToPayment(ui.value));
        }
    });


    var timeout = null;
    var sliderCalculate = function (position) {
        if (timeout)
            clearTimeout(timeout);
        timeout = setTimeout(function () {
            if (loanApp.autoCalc)
                $('input.uninitialized').addClass('invalidField');
            if (logPositionToPayment(position) < loanApp.totalMinPayment)
                $('#paymentSlider').slider('option', 'value', logPaymentToPosition(loanApp.totalMinPayment));
            calculate();
        }, loanApp.config.sliderWaitToCalculate);
    };


    // TODO 
    // Not a fan of log curve, needs tweeked; linear for now
    logPaymentToPosition = function (payment) {

        //return (payment.log2() / loanApp.config.sliderMax.log2()) * 1000;
        return payment;
    };


    // TODO
    // Again, linear for now
    logPositionToPayment = function (pos) {

        /*
         var payment = (pos / 1000) * loanApp.config.sliderMax.log2();
         payment = Math.pow(2,payment);
         payment = Math.round(payment*100)/100;
         return payment;
         */
        return pos;
    };


    // Viewing Results
    $('.resultsContainer').live('click', function () {
        var uid = $(this).attr('id').substr(16);
        loanApp.getLoan(uid).results.click();
    });

    $('.graphView').click(function () {
        if ($(this).attr('id') == 'graph_princRemaining') {
            loanApp.graph.draw('princRemaining');
        }
        else if ($(this).attr('id') == 'graph_princPaid') {
            loanApp.graph.draw('princPaid');
        }
        else if ($(this).attr('id') == 'graph_totalInterestPaid') {
            loanApp.graph.draw('totalInterestPaid');
        }
        else if ($(this).attr('id') == 'graph_monthlyPayment') {
            loanApp.graph.draw('monthlyPayment');
        }
    });


    // Events
    $('#totalMonthlyPayment').live('change', function () {

        var value = $(this).val();
        if (loanApp.validatePayment(value)) {
            loanApp.updatePayment(value);
            $('#paymentSlider').slider('option', 'value', logPaymentToPosition(value));
            calculate();
        }
    });

    $('#loanBarInputContainer input').live('change', function () {

        var uid;
        var field;
        var value = $(this).val();

        // Setting input

        if ($(this).hasClass('name')) {
            uid = $(this).attr('id').substr(8);
            field = 'name';
        }
        else if ($(this).hasClass('balance')) {
            uid = $(this).attr('id').substr(11);
            field = 'balance';
        }
        else if ($(this).hasClass('minPayment')) {
            uid = $(this).attr('id').substr(14);
            field = 'minPayment';
        }
        else if ($(this).hasClass('interest')) {
            uid = $(this).attr('id').substr(12);
            field = 'interest';
        }


        // Validate input
        if (loanApp.getLoan(uid).validate(field, value)) {

            loanApp.updateLoan(uid, field, formatNumber(value));
            if (field == 'minPayment')
                $('#paymentSlider').slider('option', 'value', logPaymentToPosition(loanApp.totalPayment));
        }
        resetEmptyEntry(uid, field, value);

        // If it's an initialized loan, attempt to recalculate
        // and make all uninitialized inputs invalid
        if (loanApp.getLoan(uid).isInitialized['loan'] && loanApp.autoCalc) {

            $('input.uninitialized').addClass('invalidField');
            calculate();
        }

    });


    var calculate = function (firstCall) {

        if (firstCall || loanApp.autoCalc) {

            // If no invalidFields, calculate and set blank fields to default values
            if ($('input').hasClass('invalidField')) {
                // @TODO Flash red divs?
            }
            loanApp.calculatePrep();
        }
    };


    var resetEmptyEntry = function (uid, field, value) {

        if (field == 'name') {
            if (value == '') {
                value = 'Loan ' + (parseInt(uid) + 1);
                $('#loan' + field + uid).val(value);
                $('#loan' + field + uid).css('color', '#cccccc');
            }
            else
                $('#loan' + field + uid).css('color', '#444444');
            loanApp.updateLoan(uid, field, value);
        }
    };

    var formatNumber = function (s) {

        s = s.replace(' ', '');
        s = s.replace(',', '');
        s = parseFloat(s);
        return s;
    };


    // Calculate, Links, Tooltip
    $('#calculate').click(function () {

        if ($('input').hasClass('uninitialized'))
            $('input.uninitialized').addClass('invalidField');
        else
            calculate(1);
    });

    $('#export').click(function () {

        alert("holy cow!");
    });

    $('.link').click(function () {

        if ($(this).attr('id') == 'link_help') {
            $('#help').show();
            $('#about').hide();
            $('#feedback').hide();
        }
        else if ($(this).attr('id') == 'link_about') {
            $('#help').hide();
            $('#about').show();
            $('#feedback').hide();
        }
        else if ($(this).attr('id') == 'link_feedback') {
            $('#help').hide();
            $('#about').hide();
            $('#feedback').show();
        }
    });

    $('body').click(function (e) {

        var target = $(e.target);
        if (!target.hasClass('link'))
            $('.moreInfo').hide();
    });


    $('.help').mouseover(function (e) {

        var x = e.pageX + 30;
        var y = e.pageY - 20;
        $('#helpPopup').css({left: x + 'px', top: y + 'px'});

        if ($(this).attr('id') == 'totalMonthlyPaymentHelp')
            $('#help_tmp').show();
        else if ($(this).attr('id') == 'paymentTypeHelp')
            $('#help_pt').show();
    });

    $('.help').mouseout(function () {

        if ($(this).attr('id') == 'totalMonthlyPaymentHelp')
            $('#help_tmp').hide();
        else if ($(this).attr('id') == 'paymentTypeHelp')
            $('#help_pt').hide();
    });

});


// From Safalra (Stephen Morley)'s Number-extension.js
Number.prototype.log2 =

    function () {
        return Math.log(this) / Math.LN2;
    };


// IE Array.indexOf fix
if (!Array.indexOf) {
    Array.prototype.indexOf = function (obj) {
        for (var i = 0; i < this.length; i++) {
            if (this[i] == obj) {
                return i;
            }
        }
        return -1;
    }
}
;


