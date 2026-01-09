var GraphController = function () {

};


GraphController.graph = function (results) {

    var data = GraphController.get_data(results);
    var graph_div = $("#graph");
    if (!$("#myChart").length) {
        var title = "<h4 class='text-center'>Balance Remaining</h4>";
        var canvas_html = "<canvas id=\"myChart\"  height=\"400\"></canvas>";
        graph_div.append(title + canvas_html);
    }
    var steps = GraphController.get_steps();

    responsive_chart($("#myChart"), data, false, steps, GraphController.get_step_width(results, steps));
};

GraphController.get_steps = function () {
    return 20;
};

GraphController.get_step_width = function (results, steps) {
    var max_val = 0;
    for (var i in results.loans) {
        for (var j = 0; j < results.loans[i].rows.length; j++) {
            if (max_val < parseFloat(results.loans[i].rows[j].balance_remaining)) {
                max_val = parseFloat(results.loans[i].rows[j].balance_remaining);
            }
        }

    }

    return Math.round(max_val / steps);

};

GraphController.get_data = function (results) {
    var max_row_length = 0;
    var max_row_index = 0;
    var num_labels = 20;
    var step_size;
    var datasets = [];
    var keys = Object.keys(results.loans);
    keys.sort(function (a, b) {
        return results.loans[b].starting_balance - results.loans[a].starting_balance;
    });

    console.log("keys");
    console.log(keys);


    var labels = [];
    for (var i = 0; i < keys.length; i++) {
        var loan_key = keys[i];
        console.log("loan key");
        console.log(loan_key);
        if (results.loans[loan_key].rows.length > max_row_length) {
            max_row_length = results.loans[loan_key].rows.length;
            max_row_index = loan_key;
        }
        if (results.loans[max_row_index].rows.length > num_labels) {
            step_size = Math.floor(results.loans[max_row_index].rows.length / num_labels);
        }
        else {
            step_size = 1;
        }
    }
    for (var i = 0; i < keys.length; i++) {
        var loan_key = keys[i];
        console.log(step_size);
        datasets[i] = GraphController.get_color_hash(loan_key);
        datasets[i].data = [];
        for (var j = 0; j < max_row_length; j += step_size) {
            if (results.loans[loan_key].rows[j]){
                datasets[i].data.push(results.loans[loan_key].rows[j].balance_remaining);
            }
            else {
                datasets[i].data.push(0);
            }
        }
    }

    for (var i = 0; i < results.loans[max_row_index].rows.length; i += step_size) {
        labels.push(results.loans[max_row_index].rows[i].date);
    }

    return {
        labels: labels,
        datasets: datasets
    };
};


GraphController.get_color_hash = function (i) {
    i = parseInt(i);
    console.log("color");
    console.log(i);
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