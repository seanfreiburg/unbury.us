var GraphController = function () {

};


GraphController.graph = function () {

    var data = GraphController.get_data();
    var graph_div = $("#graph");
    if (!$("#myChart").length) {
        var canvas_html = "<canvas id=\"myChart\"  height=\"400\"></canvas>";
        graph_div.append(canvas_html);
    }

    respChart($("#myChart"), data);
};


GraphController.get_data = function() {
    var data = {
        labels: ["January", "February", "March", "April", "May", "June", "July"],
        datasets: [
            {
                fillColor: "rgba(151,187,205,0.5)",
                strokeColor: "rgba(151,187,205,1)",
                pointColor: "rgba(151,187,205,1)",
                pointStrokeColor: "#fff",
                data: [28, 48, 40, 19, 96, 27, 100]
            }
        ]
    };

    return data;
};