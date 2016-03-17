function responsive_chart(selector, data, options,steps,step_width){

    console.log("Steps: " + steps);
    console.log("Step width: " + step_width);
    // Define default option for line chart
    var option = {
        scaleOverlay : false,
        scaleOverride : true,
        scaleSteps : steps,
        scaleStepWidth : step_width,
        scaleStartValue : 0,
        scaleLineColor : "rgba(0,0,0,.1)",
        scaleLineWidth : 1,
        scaleShowLabels : true,
        scaleLabel : "<%=value%>",
        scaleFontFamily : "'HelveticaNeue-Light','Helvetica Neue','proxima-nova'",
        scaleFontSize : 12,
        scaleFontStyle : "normal",
        scaleFontColor : "#909090",
        scaleShowGridLines : true,
        scaleGridLineColor : "rgba(0,0,0,.05)",
        scaleGridLineWidth : 1,
        bezierCurve : false,
        pointDot : true,
        pointDotRadius : 3,
        pointDotStrokeWidth : 1,
        datasetStroke : true,
        datasetStrokeWidth : 2,
        datasetFill : true,
        animation : true,
        animationSteps : 60,
        animationEasing : "easeOutQuart",
        onAnimationComplete : null
    }

    // check if the option is override to exact options
    // (bar, pie and other)
    if (options ==  false || options == null){
        options = option;
    }

    // get selector by context
    var ctx = selector.get(0).getContext("2d");
    // pointing parent container to make chart js inherit its width
    var container = $(selector).parent();

    // enable resizing matter
    $(window).resize( generateChart );

    // this function produce the responsive Chart JS
    function generateChart(){
        // make chart width fit with its container
        var ww = selector.attr('width', $(container).width() );
        var ww = selector.attr('height', 400);
        // Initiate new chart or Redraw
        new Chart(ctx).Line(data, options);
    };

    // run function - render chart at first load
    generateChart();

}