/**
 * Unburyme.Graph
 * Object to create and draw the graph used
 * @param {Unburyme.LoanApp} loanApp
 * @constructor
 */

Unburyme.Graph = function (loanApp) {

    this.loanApp = loanApp;
    this.loanDataSet = [];
    this.loanData = [];
    this.loanNames = [];
    this.dateSet = [];
    this.colorSet = this.loanApp.config.colorSet;
    this.lastFieldGraphed = 'princRemaining';
}


/**
 * Renders graph on screen
 * @param {string} field Field in which to graph
 */
Unburyme.Graph.prototype.draw = function (field) {

    if (!field)
        field = this.lastFieldGraphed;
    $('#graph').fadeIn(this.loanApp.config.fadeSpeed);
    $('#graphViewOptions').fadeIn(this.loanApp.config.fadeSpeed);
    this.drawTitle(field);
    this.getGraphData(field);
    this.makeDataSet();
    this.makeXAxis();
    this.lastFieldGraphed = field;

    $.plot($('#graph'), this.loanDataSet, {
        colors: this.colorSet,
        xaxis: {
            ticks: this.dateSet
        },
        yaxis: {
            tickFormatter: this.dollarFormatter
        }
    });

};


/**
 * @param {string} field Title of graph
 */
Unburyme.Graph.prototype.drawTitle = function (field) {

    var title = '';
    $('#graphTitle').fadeIn(this.loanApp.config.fadeSpeed);
    switch (field) {
        case 'princRemaining':
            title = 'Principle Remaining';
            break;
        case 'princPaid':
            title = 'Principle Paid';
            break;
        case 'totalInterestPaid':
            title = 'Total Interest Paid';
            break;
        case 'monthlyPayment':
            title = 'Monthly Payment'
            break;
    }
    $('#graphTitle').html(title);

};


/**
 * Make data set for the graph to display
 */
Unburyme.Graph.prototype.makeDataSet = function () {

    for (var i = 0; i < this.loanApp.loanCount; i++) {
        var dataDict = [];
        dataDict['label'] = this.loanNames[i];
        dataDict['data'] = this.loanData[i];
        this.loanDataSet.push(dataDict);
    }

};


/**
 * Format the x-axis on the graph
 */
Unburyme.Graph.prototype.makeXAxis = function () {

    var date = new Unburyme.Date(),
        month = date.getMonth(),
        year = date.getYear() + 1,
        monthMod = 1,
        yearMod = 1,
        untilNewYear = (12 - month) % 12,
        maxData = 0;
    date.setCurrent();

    //Find which data set is the largest
    for (var i = 0; i < this.loanApp.initLoanCount(); i++) {
        if (this.loanData[i].length > maxData)
            maxData = this.loanData[i].length;
    }

    // Convert entry point count to years        
    var yearsToPay = Math.ceil(maxData / 12);

    if (yearsToPay > 8) {
        monthMod = Math.ceil(yearsToPay / 8);
        yearMod = Math.ceil(yearsToPay / 8);
    }

    //Make x-axis ticks
    for (var i = 0; i < yearsToPay; i++) {
        var dataDict = [];
        dataDict.push(untilNewYear);
        dataDict.push(year + (i * yearMod));
        this.dateSet.push(dataDict);
        untilNewYear += (12 * monthMod);
    }

};


/**
 * Get needed data from loans
 * @param {string} field Field to display on graph
 */
Unburyme.Graph.prototype.getGraphData = function (field) {

    this.clearGraphData();
    for (var i = 0; i < this.loanApp.initLoanCount(); i++) {
        this.loanData.push(this.loanApp.initLoanArray[i].results.getGraphData(field));
        this.loanNames.push(this.loanApp.initLoanArray[i].getName());
    }
};


/**
 * Clear stored graph info
 */
Unburyme.Graph.prototype.clearGraphData = function () {

    this.loanDataSet = [];
    this.loanNames = [];
    this.loanData = [];
    this.dateSet = [];

};


/**
 * Format the value with a $ sign
 * @param {number} v Value to be formatted
 * @return {string} Formatted value
 */
Unburyme.Graph.prototype.dollarFormatter = function (v) {

    return "$" + v;

};


/**
 * Removes graph DOM elements and clears stored graph info
 */
Unburyme.Graph.prototype.reset = function () {

    $('#graph').fadeOut(this.loanApp.config.fadeSpeed);
    $('#graphViewOptions').fadeOut(this.loanApp.config.fadeSpeed);
    $('#graphTitle').fadeOut(this.loanApp.config.fadeSpeed);
    this.clearGraphData();
    this.lastFieldGraphed = 'princRemaining';

};
