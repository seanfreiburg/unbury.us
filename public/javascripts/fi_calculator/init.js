var init = function(){


    window.current_assets = 0;
    window.savings_rate = 0;
    window.current_salary = 0;
    window.return_rate = .07;
    window.years_of_savings = 25;
    window.inflation_rate = .02;
    Router.init();
};


$().ready(function () {

    init();

});
