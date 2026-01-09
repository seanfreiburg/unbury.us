var ApplicationController = function () {

};

ApplicationController.auto_calculate = function(){
    ApplicationController.calculate();
};

ApplicationController.calculate = function(){
    console.log("calculated");
    var years_to_fi = 0;
    var assets = window.current_assets;
    var salary_in_retirement = (1-(window.savings_rate/100))*current_salary;
    while (assets < (window.years_of_savings*salary_in_retirement)){
        years_to_fi += 1;
        assets += (window.return_rate-window.inflation_rate)*assets;
        assets += window.current_salary*(window.savings_rate/100);
        if (years_to_fi > 122){
            console.log("never fi");
            return;
        }
    }
    console.log("years to fi " + years_to_fi);
    $("#years_to_fi").text(years_to_fi + " years to financial independence")
};

ApplicationController.current_salary_input_change = function(){
    ApplicationController.input_change("#current_salary");
};

ApplicationController.savings_rate_input_change = function(){
    ApplicationController.input_change("#savings_rate");
};

ApplicationController.current_assets_input_change = function(){
    ApplicationController.input_change("#current_assets");
};


ApplicationController.input_change = function(str){
    var selector = $(str);
    var value = selector.val();
    value = precise_round(value,2);
    window[str.substr(1, str.length)] = Number(value);
    console.log(str + " = " + value);
};