// Responsive Chart - Updated for Chart.js 4.x
var currentChart = null;

function responsive_chart(selector, data, options, steps, step_width) {
    console.log(steps);
    console.log(step_width);

    // Get canvas context
    var ctx = selector.get(0).getContext("2d");
    var container = $(selector).parent();

    // Destroy previous chart if exists
    if (currentChart) {
        currentChart.destroy();
    }

    // Convert old Chart.js 0.2 data format to Chart.js 4.x format
    var chartData = {
        labels: data.labels,
        datasets: data.datasets.map(function(dataset, index) {
            return {
                label: 'Loan ' + index,
                data: dataset.data,
                backgroundColor: dataset.fillColor || dataset.backgroundColor,
                borderColor: dataset.strokeColor || dataset.borderColor,
                pointBackgroundColor: dataset.pointColor || dataset.pointBackgroundColor,
                pointBorderColor: dataset.pointStrokeColor || dataset.pointBorderColor || '#fff',
                fill: true,
                tension: 0 // No bezier curve (was bezierCurve: false)
            };
        })
    };

    // Chart.js 4.x options
    var chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                max: steps * step_width,
                ticks: {
                    stepSize: step_width,
                    font: {
                        family: "'HelveticaNeue-Light','Helvetica Neue','proxima-nova'",
                        size: 12
                    },
                    color: '#909090'
                },
                grid: {
                    color: 'rgba(0,0,0,.05)'
                }
            },
            x: {
                ticks: {
                    font: {
                        family: "'HelveticaNeue-Light','Helvetica Neue','proxima-nova'",
                        size: 12
                    },
                    color: '#909090'
                },
                grid: {
                    color: 'rgba(0,0,0,.05)'
                }
            }
        },
        elements: {
            point: {
                radius: 3,
                borderWidth: 1
            },
            line: {
                borderWidth: 2
            }
        },
        animation: {
            duration: 1000,
            easing: 'easeOutQuart'
        }
    };

    // Set canvas size
    selector.attr('width', $(container).width());
    selector.attr('height', 400);

    // Create new chart
    currentChart = new Chart(ctx, {
        type: 'line',
        data: chartData,
        options: chartOptions
    });

    // Handle resize
    $(window).off('resize.chart').on('resize.chart', function() {
        if (currentChart) {
            selector.attr('width', $(container).width());
            currentChart.resize();
        }
    });
}
