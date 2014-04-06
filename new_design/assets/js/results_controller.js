var ResultsController = function() {

};


ResultsController.results = function() {
    var results = ResultsController.compute_results();
    ResultsController.draw_total_results(results);
    ResultsController.draw_loan_results(results);
};

ResultsController.compute_results = function(){
   return {year: 2016, total_interest: 20.23, loans: [{id: 1, loan_name: "fg",year: 2016, total_interest: 20.23 },
       {id: 2, loan_name: "fg",year: 2016, total_interest: 20.23 },
       {id: 3, loan_name: "fg",year: 2016, total_interest: 20.23 }]};

};


ResultsController.draw_total_results = function(results){
    var source = $("#total-results-template").html();
    var template = Handlebars.compile(source);
    var context = results;
    var html = template(context);
    $("#total-results").append(html);
    $("#total-results").hide().fadeIn('500');
};

ResultsController.draw_loan_results= function(results){
    var source = $("#loan-results-template").html();
    var template = Handlebars.compile(source);
    var context = results;
    var html = template(context);
    $("#loan-results").append(html);
    $("#loan-results").hide().fadeIn('500');
    for(var i = 0; i < context.loans.length; i++){
        Router.add_loan_table_result_listener(context.loans[i].id);
    }
};