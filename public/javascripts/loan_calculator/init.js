$().ready(function () {

    var params = getSearchParameters();
    console.log(params);

    load_url_loans(params);

});

String.prototype.contains = function (it) {
    return this.indexOf(it) !== -1;
};

Math.sign = Math.sign || function sign(x) {
    x = +x; // convert to a number
    if (x === 0 || isNaN(x)) {
        return x;
    }
    return x > 0 ? 1 : -1;
};

var deep_copy = function(string) {
    return JSON.parse(JSON.stringify(string))
};


// http://localhost:63342/unbury.us/public_html/index.html#name_0=1&balance_0=2&payment_0=4&rate_0=2
var url_loans_valid = function (params) {

    var loan_keys = [];
    Object.keys(params).forEach(function (key) {
        if (key.contains("name")) {
            loan_keys.push(key);
        }
    });

    for (var i =0; i < loan_keys.length; i++) {
        var id = loan_keys[i].split('_')[1];
        if (params["balance_" + id] != null && params["payment_" + id] != null && params["rate_" + id] != null) {

        }
        else {
            console.log("invalid");
            console.log(loan_keys);
            console.log(i);
            console.log(id);
            return false;

        }
    }


    return true;
};

var load_url_loans = function (params) {

    window.loans = {};
    window.auto_increment = -1;
    window.monthly_payment = 0;
    ApplicationController.monthly_payment_input_change();


    window.payment_type = "avalanche";

    Router.init();
    Router.add_monthly_payment_listener();
    Router.add_calculate_listener();

    Handlebars.registerPartial("row", $("#loan-table-row-partial").html());

    if (url_loans_valid(params)) {
        console.log("Valid loan parameter found in URL");

        if (params["monthly_payment"]){
            $("#monthly-payment").val(params["monthly_payment"]);
        }

        var loan_keys = [];
        Object.keys(params).forEach(function (key) {
            if (key.contains("name")) {
                loan_keys.push(key);
            }
        });

        console.log("Before URL processing loop");
        for (var i =0; i < loan_keys.length; i++) {
            var loan_id = loan_keys[i].split('_')[1];
            console.log("Inside URL processing loop");
            window.auto_increment = loan_id;
            var id = loan_id;
            var source = $("#loan-input-template").html();
            var template = Handlebars.compile(source);
            var context = {id: id};
            var html = template(context);
            $("#loan-inputs").append(html);
            $("#loan" + id).hide().fadeIn('500');
            window.loans[id] = new Loan(id, 0, 0, 0, 0);
            Router.add_loan_destroy_listener(id);
            Router.add_loan_input_listeners(id);
            $("#loan-name-" + id).val(unescape(params["name_" + loan_id]));
            $("#current-balance-" + id).val(params["balance_" + loan_id]);
            $("#minimum-payment-" + id).val(params["payment_" + loan_id]);

            $("#interest-rate-" + id).val(params["rate_" + loan_id]);

            var event = 'change';

            $("#loan-name-" + id).trigger(event);
            $("#current-balance-" + id).trigger(event);
            $("#minimum-payment-" + id).trigger(event);

            $("#interest-rate-" + id).trigger(event);


        }
    }
};


/*
 window.auto_increment += 1;
 var id = window.auto_increment;
 var source = $("#loan-input-template").html();
 var template = Handlebars.compile(source);
 var context = {id: id};
 var html = template(context);
 $("#loan-inputs").append(html);
 $("#loan" + id).hide().fadeIn('500');
 window.loans[id] = new Loan(id, 0, 0, 0, 0);
 Router.add_loan_destroy_listener(id);
 Router.add_loan_input_listeners(id);
 */

var load_empty_loans = function () {
    window.loans = {};
    window.auto_increment = -1;
    window.monthly_payment = 0;
    ApplicationController.monthly_payment_input_change();


    window.payment_type = "avalanche";

    Router.init();

    LoanController.add_loan();
    Router.add_monthly_payment_listener();
    Router.add_calculate_listener();

    Handlebars.registerPartial("row", $("#loan-table-row-partial").html());
};


var getSearchParameters = function () {
    var prmstr = window.location.hash;
    return prmstr != null && prmstr != "" ? transformToAssocArray(prmstr) : {};
};

var transformToAssocArray = function (prmstr) {
    var params = {};
    var prmarr = prmstr.substr(1).split("&");
    for (var i = 0; i < prmarr.length; i++) {
        var tmparr = prmarr[i].split("=");
        params[tmparr[0]] = tmparr[1];
    }
    return params;
};



