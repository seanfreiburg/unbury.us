$().ready(function () {

    var params = getSearchParameters();
    console.log(params);
    if (params.empty()) {
        load_empty_loans();
    }
    else {
        load_url_loans(params);
    }

});


// http://localhost:63342/unbury.us/public_html/index.html?name_0=1&balance_0=2&payment_0=4&rate_0=2
var url_loans_valid = function (params) {

};

var load_url_loans = function (params) {
    if (url_loans_valid(params)) {

    }
    else {
        load_empty_loans();
    }
};


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
    var prmstr = window.location.search.substr(1);
    return prmstr != null && prmstr != "" ? transformToAssocArray(prmstr) : {};
};

var transformToAssocArray = function (prmstr) {
    var params = {};
    var prmarr = prmstr.split("&");
    for (var i = 0; i < prmarr.length; i++) {
        var tmparr = prmarr[i].split("=");
        params[tmparr[0]] = tmparr[1];
    }
    return params;
};



