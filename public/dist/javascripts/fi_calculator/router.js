function Router() {

}


Router.init = function () {
    Router.add_current_assets_listener();
    Router.add_savings_rate_listener();
    Router.add_current_salary_listener();
    Router.add_calculate_listener();
};


Router.add_current_salary_listener = function () {
    $("#current_salary").change(function () {
        ApplicationController.current_salary_input_change();
        ApplicationController.auto_calculate();
    });
};

Router.add_savings_rate_listener = function () {
    $("#savings_rate").change(function () {
        ApplicationController.savings_rate_input_change();
        ApplicationController.auto_calculate();
    });
};

Router.add_current_assets_listener = function () {
    $("#current_assets").change(function () {
        ApplicationController.current_assets_input_change();
        ApplicationController.auto_calculate();
    });
};

Router.add_calculate_listener = function () {
    $("#calculate").click(function () {
        ApplicationController.calculate();
    });
};
