var GraphController = function () {

};


GraphController.graph = function (results) {

    var data = GraphController.get_data(results);
    var graph_div = $("#graph");
    if (!$("#myChart").length) {
        var title = "<h4 class='text-center'>Principal Remaining</h4>";
        var canvas_html = "<canvas id=\"myChart\"  height=\"400\"></canvas>";
        graph_div.append(title + canvas_html);
    }
     var steps = GraphController.get_steps();

    respChart($("#myChart"), data,false, steps, GraphController.get_step_width(results,steps));
};

GraphController.get_steps = function () {
    return 20;
};

GraphController.get_step_width = function (results,steps) {
    var max_val = 0
    for (var i = 0; i < results.loans.length; i++) {
        for (var j = 0; j < results.loans[i].rows.length; j++) {
         if (max_val < parseFloat(results.loans[i].rows[j].principal_remaining)){
             max_val = parseFloat(results.loans[i].rows[j].principal_remaining);
         }
        }

    }

    return Math.round(max_val/steps);

};

GraphController.get_data = function (results) {
    var max_row_length = 0;
    var max_row_index = 0;
    var datasets = [];
    results.loans.sort( function(a,b){
        return b.currentBalance - a.currentBalance;
    });
    for (var i = 0; i < results.loans.length; i++) {
        if (results.loans[i].rows.length > max_row_length) {
            max_row_length = results.loans[i].rows.length;
            max_row_index = i;
        }
        datasets[i] = GraphController.get_color_hash(i);
        datasets[i].data = [];
        for (var j = 0; j < results.loans[i].rows.length; j++) {
            datasets[i].data.push(results.loans[i].rows[j].principal_remaining);
        }
    }
    var labels = [];


    for (var i = 0; i < results.loans[max_row_index].rows.length; i++) {
        labels.push(results.loans[max_row_index].rows[i].date);
    }

    console.log(datasets);

    var data = {
        labels: labels,
        datasets: datasets
    };

    return data;
};


GraphController.get_color_hash = function (i) {
    var color_hash = {};
    switch (i % 5) {
        case 0:
            color_hash = {fillColor: "rgba(151,187,205,0.5)",
                strokeColor: "rgba(151,187,205,1)",
                pointColor: "rgba(151,187,205,1)",
                pointStrokeColor: "#fff" };
            break;
        case 1:
            color_hash = {fillColor: "rgba(200,0,0,0.5)",
                strokeColor: "rgba(200,0,0,1)",
                pointColor: "rgba(200,0,0,1)",
                pointStrokeColor: "#fff" };
            break;
        case 2:
            color_hash = {fillColor: "rgba(50,50,50,0.5)",
                strokeColor: "rgba(50,50,50,1)",
                pointColor: "rgba(50,50,50,1)",
                pointStrokeColor: "#fff" };
            break;
        case 3:
            color_hash = {fillColor: "rgba(0,200,0,0.5)",
                strokeColor: "rgba(0,200,0,1)",
                pointColor: "rgba(0,200,0,1)",
                pointStrokeColor: "#fff" };
            break;
        case 4:
            color_hash = {fillColor: "rgba(0,0,200,0.5)",
                strokeColor: "rgba(0,0,200,1)",
                pointColor: "rgba(0,0,200,1)",
                pointStrokeColor: "#fff" };
            break;
    }
    return color_hash;

};
