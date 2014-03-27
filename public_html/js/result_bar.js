/**
 * Unburyme.ResultBar
 * Stores the values used in the resulting information bar for each loan
 * @constructor
 */
Unburyme.ResultBar = function (uid, loan, loanApp) {

    this.uid = uid;
    this.loan = loan;
    this.loanApp = loanApp;
    this.totalInterestPaid = 0;
    this.payOffDate = new Unburyme.Date();
    this.graph = this.loanApp.graph;
    this.graphData_princData = [];
    this.graphData_princPaid = [];
    this.graphData_totalInterestPaid = [];
    this.graphData_monthlyPayment = [];
    this.htmlMain = '';
    this.htmlMonthly = '';

};


/**
 * Destroys this
 */
Unburyme.ResultBar.prototype.destroy = function () {

    $('#resultsContainer' + this.uid).slideUp(this.loanApp.config.slideSpeed, function () {
        $('#resultsContainer' + this.uid).remove();
    });

};


/*
 * Draws extended loan information
 */
Unburyme.ResultBar.prototype.drawStart = function () {

    //Reset graph data
    this.clearGraphData();
    this.totalInterestPaid = 0;

    this.htmlMonthly = '<div class=\'monthlyResults\' id=\'monthlyResults' + this.uid + '\'>\n';
    this.htmlMonthly += '<table class=\' table table-striped\'><tr>';
    this.htmlMonthly += '<td class=\'tHead month\'>Month</td>\n';
    this.htmlMonthly += '<td class=\'tHead monthlyPayment\'>Payment</td>\n';
    this.htmlMonthly += '<td class=\'tHead princPaid\'>Principal Paid</td>\n';
    this.htmlMonthly += '<td class=\'tHead interestPaid\'>Interest Paid</td>\n';
    this.htmlMonthly += '<td class=\'tHead principle\'>Principal</td>\n';
    this.htmlMonthly += '<td class=\'tHead totalInterest\'>Total Interest</td>\n';
    this.htmlMonthly += '</tr>\n';

};


/**
 * Draws extended loan information
 */
Unburyme.ResultBar.prototype.drawMain = function (iterator, currentMonth, payment, princPaid, interestPaid, princRemaining) {

    var alternateRows = currentMonth.getMonth() % 2;
    this.htmlMonthly += '<tr class=\'alternateRows' + alternateRows + '\'>\n';
    this.htmlMonthly += '   <td class=\'tBody month\'>' + currentMonth.print() + '</td>\n';
    this.htmlMonthly += '   <td class=\'tBody monthlyPayment\'>$' + payment.toFixed(2) + '</td>\n';
    this.htmlMonthly += '   <td class=\'tBody princPaid\'>$' + princPaid.toFixed(2) + '</td>\n';
    this.htmlMonthly += '   <td class=\'tBody interestPaid\'>$' + interestPaid.toFixed(2) + '</td>\n';
    this.htmlMonthly += '   <td class=\'tBody princRemaining\'>$' + princRemaining.toFixed(2) + '</td>\n';
    this.htmlMonthly += '   <td class=\'tBody totalInterestPaid\'>$' + this.totalInterestPaid.toFixed(2) + '</td>\n';
    this.htmlMonthly += '</tr>\n';

    //Store graph data  
    this.graphData_princRemaining.push([iterator, princRemaining.toFixed(2)]);
    this.graphData_princPaid.push([iterator, princPaid.toFixed(2)]);
    this.graphData_totalInterestPaid.push([iterator, this.totalInterestPaid.toFixed(2)]);
    this.graphData_monthlyPayment.push([iterator, payment.toFixed(2)]);

};

/**
 * Draws extended loan information
 */
Unburyme.ResultBar.prototype.drawFinal = function () {

    this.htmlMonthly += '</table></div>';
    this.htmlMonthly = '<div class=\'row\'><div class=\'col-md-12\'>'  + this.htmlMonthly + '</div></div>';
    this.htmlMain = '<a class=\'resultBarLink\' >' ;
    this.htmlMain += '<div class=\'resultBar row blue\' id=\'resultBar' + this.uid + '\'>' ;
    this.htmlMain += '<div class=\'loanName col-md-4 \'>' + this.loan.getName() + '</div>\n';
    this.htmlMain += '<div class=\'payoffDateText col-md-4 \'>paid off by ' + this.payOffDate.print() + '</div>\n';
    this.htmlMain += '<div class=\'totalInterestText col-md-4 \'>total interest paid $' + this.totalInterestPaid.toFixed(2) + '</div>';
    this.htmlMain += '</div>\n';
    this.htmlMain += this.htmlMonthly;
    this.htmlMain += '</a>';

    //Create #resultBar if it doesn't exist
    if ($('#resultBar' + this.uid).length) {
        $('#resultsContainer' + this.uid).html(this.htmlMain);
        $('#monthlyResults' + this.uid).css('display', 'none');
    }
    else {
        this.htmlMain = '<div class=\'resultsContainer\' id=\'resultsContainer' + this.uid + '\'>\n' + this.htmlMain + '</div>\n';
        $('#allResultsContainer').append(this.htmlMain).fadeIn(this.loanApp.config.fadeSpeed);
        $('#monthlyResults' + this.uid).css('display', 'none');
    }
};


/**
 * Clears graph data
 */
Unburyme.ResultBar.prototype.clearGraphData = function () {

    this.graphData_princRemaining = [];
    this.graphData_princPaid = [];
    this.graphData_totalInterestPaid = [];
    this.graphData_monthlyPayment = [];
};


/**
 * Return requested graph data for appropriate field
 * @param {string} field Graph information that's requested
 * @return {number[]} Graph data
 */
Unburyme.ResultBar.prototype.getGraphData = function (field) {

    var dataToReturn;
    switch (field) {
        case 'princRemaining':
            dataToReturn = this.graphData_princRemaining;
            break;
        case 'princPaid':
            dataToReturn = this.graphData_princPaid;
            break;
        case 'totalInterestPaid':
            dataToReturn = this.graphData_totalInterestPaid;
            break;
        case 'monthlyPayment':
            dataToReturn = this.graphData_monthlyPayment;
            break;
    }
    return dataToReturn;

};


/**
 * Display extended result information
 */
Unburyme.ResultBar.prototype.click = function () {

    if ($('#monthlyResults' + this.uid).css('display') == 'none')
        $('#monthlyResults' + this.uid).slideDown(this.loanApp.config.slideSpeed);
    else
        $('#monthlyResults' + this.uid).slideUp(this.loanApp.config.slideSpeed);

};
