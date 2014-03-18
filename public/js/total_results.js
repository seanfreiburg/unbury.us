/**
 * Unburyme.TotalResults
 * The total results bar for the application
 * @constructor
 * @param {Unburyme.LoanApp}
 */
Unburyme.TotalResults = function (loanApp) {

    this.loanApp = loanApp;
    this.finalPayOffDate = new Unburyme.Date();
    this.totalInterest = 0;

}


Unburyme.TotalResults.prototype.calculate = function () {

    this.clearData();
    for (var i = 0; i < this.loanApp.initLoanCount(); i++) {
        this.finalPayOffDate = this.finalPayOffDate.getLatest(this.loanApp.loanArray[i].results.payOffDate);
        this.totalInterest += this.loanApp.loanArray[i].results.totalInterestPaid;
    }
    this.draw();

};

Unburyme.TotalResults.prototype.draw = function () {

    var html = '<div id="totalResultsBar">';
    html += '   <div class="name">Loan Total</div>\n';
    html += '   <div class="payoffDateText">debt free by</div><div class="payoffDate">' + this.finalPayOffDate.print() + '</div>\n';
    html += '   <div class="totalInterestText">total interest paid</div><div class="totalInterest">$' + this.totalInterest.toFixed(2) + '</div>\n';
    html += '</div>\n';
    $('#totalResultsContainer').fadeIn(this.loanApp.config.fadeSpeed);
    $('#totalResultsContainer').html(html);

};


Unburyme.TotalResults.prototype.clearData = function () {

    this.finalPayOffDate.setCurrent();
    this.totalInterest = 0;

};


/**
 * Clear data and remove DOM element
 */
Unburyme.TotalResults.prototype.reset = function () {

    this.clearData();
    $('#totalResultsContainer').fadeOut(this.loanApp.config.fadeSpeed);

}
