/**
 * Unburyme.LoanApp
 * The main controller for the application
 * @constructor
 */
Unburyme.LoanApp = function () {

    // Initialize application   
    this.config = new Unburyme.Config();
    this.loanArray = [];
    this.initLoanArray = [];
    this.loanCount = 0;
    this.uidIterator = 0;
    this.paymentType = 'avalanche';
    this.totalPayment = 0;
    this.totalMinPayment = 0;
    this.validPayment = 0;
    this.possibleCalc = 1;
    this.autoCalc = 0;
    this.errorTimeout = 0;
    this.extraPayment = null;
    this.rollover = null;
    this.rolloverMonth = new Unburyme.Date();
    this.graph = new Unburyme.Graph(this);
    this.totalResults = new Unburyme.TotalResults(this);

};


/**
 * @param {number} uid Unique ID of a loan
 * @return {Unburyme.Loan}
 */
Unburyme.LoanApp.prototype.getLoan = function (uid) {

    var loanIndex = -1;
    for (var i = 0; i < this.loanCount; i++) {
        if (this.loanArray[i].uid == uid)
            loanIndex = i;
    }
    return this.loanArray[loanIndex];
};


/**
 * Converts a loan's Unique ID with its position in this.loanArray
 * @param {number} uid Unique ID of a loan
 * @return {number} Position in this.loanArray
 */
Unburyme.LoanApp.prototype.getLoanIndex = function (uid) {

    var loanIndex = -1;
    for (var i = 0; i < this.loanCount; i++) {
        if (this.loanArray[i].uid == uid)
            loanIndex = i;
    }
    return loanIndex;
};


/**
 * Creates a new Loan object
 */
Unburyme.LoanApp.prototype.createLoan = function () {

    this.loanArray.push(new Unburyme.Loan(this.uidIterator, this));
    this.loanCount++;
    this.uidIterator++;

};


/**
 * Destroys selected Unburyme.Loan object
 * @param {number} uid Unique ID of a loan
 */
Unburyme.LoanApp.prototype.destroyLoan = function (uid) {

    this.getLoan(uid).destroy();
    this.loanArray.splice(this.getLoanIndex(uid), 1);
    this.loanCount--;
    this.refreshInitLoanArray();

    if (this.autoCalc == 1 && this.initLoanCount() == 0) {
        this.clearData();
    }

};


/**
 * Update an Unburyme.Loan object's members
 * @param {number} uid Unique ID of a loan
 * @param {string} field Field that is to be modified
 * @param {number} value Update field to this value
 */
Unburyme.LoanApp.prototype.updateLoan = function (uid, field, value) {

    switch (field) {
        case 'name':
            this.getLoan(uid).setName(value);
            break;
        case 'balance':
            this.getLoan(uid).setBalance(value);
            break;
        case 'minPayment':
            this.getLoan(uid).setMinPayment(value);
            this.updateTotalMinPayment();
            break;
        case 'interest':
            this.getLoan(uid).setInterest(value);
            break;
    }
    this.refreshInitLoanArray();

};


/**
 * Updates the total minimum payment
 */
Unburyme.LoanApp.prototype.updateTotalMinPayment = function () {

    var totalMin = 0;
    for (var i = 0; i < this.loanCount; i++) {
        totalMin += this.loanArray[i].getMinPayment();
    }
    this.totalMinPayment = totalMin;
    if (this.totalMinPayment > this.totalPayment) {
        this.totalPayment = this.totalMinPayment;
        $('#totalMonthlyPayment').val(this.totalPayment);
        $('#totalMonthlyPayment').removeClass('invalidField');
        this.validPayment = true;
    }

};

/**
 * Updates monthly payment
 * @param {number} value Upate monthly payment to value
 */
Unburyme.LoanApp.prototype.updatePayment = function (value) {

    this.totalPayment = value;
    this.updateTotalMinPayment();
    this.validPayment = true;
    this.validatePaymentDisplay(true);

};


/**
 * Check if the updated payment is valid
 * @param {number} value Value to check if valid
 * @return {boolean} Whether or not value is valid
 */
Unburyme.LoanApp.prototype.validatePayment = function (value) {

    var validChars = "0123456789., ",
        validTest = true,
        character = null;
    for (i = 0; i < value.length && validTest == true; i++) {
        character = value.charAt(i);
        if (validChars.indexOf(character) == -1)
            validTest = false;
    }
    if (value == '')
        validTest = false;
    this.validatePaymentDisplay(validTest);
    if (validTest)
        this.validPayment = true;
    else
        this.validPayment = false;
    return validTest;
};


/**
 * Update interface for validity
 * @param {boolean} valid Whether or not value is valid
 */
Unburyme.LoanApp.prototype.validatePaymentDisplay = function (valid) {

    if (valid)
        $('#totalMonthlyPayment').removeClass('invalidField');
    else
        $('#totalMonthlyPayment').addClass('invalidField');

};


/**
 * Getter for payment validity
 * @return {boolean} Whether or not payment is valid
 */
Unburyme.LoanApp.prototype.isPaymentValid = function () {

    return this.validPayment;

};


/**
 * Get selected loan's member
 * @param {number} uid Unique ID for loan
 * @param {string} field Name of parameter to get
 */
Unburyme.LoanApp.prototype.getInfo = function (uid, field) {

    switch (field) {
        case 'name':
            return this.getLoan(uid).getName();
            break;
        case 'balance':
            return this.getLoan(uid).getBalance();
            break;
        case 'minPayment':
            return this.getLoan(uid).getMinPayment();
            break;
        case 'interest':
            return this.getLoan(uid).getInterest();
            break;
    }

};

/**
 * Does some tests before sending off to calculate
 */
Unburyme.LoanApp.prototype.calculatePrep = function () {

    if (this.areLoansValid() && this.isPaymentValid()) {
        // Resort and reset
        var monthlyPayment = $('#totalMonthlyPayment').val();
        var sortedLoans = this.sortLoans();
        this.extraPayment = this.totalPayment - this.totalMinPayment;
        this.rollover = 0;
        this.rolloverMonth = new Unburyme.Date();

        // Calculate, draw graph and results
        this.possibleCalc = true;
        this.calculate(sortedLoans);
        if (this.possibleCalc == true) {
            this.graph.draw();
            this.totalResults.calculate();

            // Hide Calculate button
            if (!this.autoCalc)
                $('#calculate').fadeOut(Unburyme.Config.fadeSpeed);

            // After first calculate, autocalculate subsequently if able
            this.autoCalc = 1;
        }
    }

};


/**
 * Calculates all current values -- does a brunt of the work
 * TODO This is a nightmare and needs cleaned up
 * @param {number[]} sortedLoans An array of the UID of loans
 */
Unburyme.LoanApp.prototype.calculate = function (sortedLoans) {

    var currentMonth = new Unburyme.Date(),
        calcName = [],
        calcBalance = [],
        calcInterest = [],
        calcMinPayment = [],
        calcInterestPaid = [],
        calcPrincPaid = [],
        calcMonthlyPayment = [],
        finishedCalculating = [],
        remainingLoans = this.initLoanCount(),
        iterator = 0;

    // Initialize and draw
    for (var i = 0; i < this.initLoanCount(); i++) {
        sortedLoans[i].results.totalInterestPaid = 0;
        sortedLoans[i].results.drawStart();
        calcName[i] = sortedLoans[i].getName();
        calcBalance[i] = sortedLoans[i].getBalance();
        calcInterest[i] = sortedLoans[i].getInterest() * 0.01;
        calcMinPayment[i] = sortedLoans[i].getMinPayment();
        finishedCalculating[i] = 0;
    }

    while (remainingLoans && this.possibleCalc) {
        var focusPayment = this.totalPayment;
        var firstPaymentPass = true;
        //Set monthly payments
        for (var i = 0; i < this.initLoanCount(); i++) {
            if (finishedCalculating[i] == 0) {
                calcInterestPaid[i] = (calcBalance[i] * (calcInterest[i] / 12));
                calcPrincPaid[i] = 0;
                sortedLoans[i].results.totalInterestPaid += calcInterestPaid[i];
                calcMonthlyPayment[i] = calcMinPayment[i];
                focusPayment = focusPayment - calcMinPayment[i];
            }
        }
        // Loops to ensure all focus payment is distributed
        while ((focusPayment > 0 || firstPaymentPass) && remainingLoans) {
            // Give rollover/focus money to priority loans
            for (var i = 0; i < this.initLoanCount(); i++) {
                if (focusPayment > 0 && calcBalance[i] > 0) {
                    calcMonthlyPayment[i] += focusPayment;
                    focusPayment = 0;
                }
            }

            // Payment pass
            for (var i = 0; i < this.initLoanCount(); i++) {
                if (calcBalance[i] > 0) {
                    if (calcMonthlyPayment[i] - calcInterestPaid[i] < calcBalance[i]) {
                        calcPrincPaid[i] = calcMonthlyPayment[i] - calcInterestPaid[i];
                        calcBalance[i] -= calcPrincPaid[i];
                    }
                    else {
                        calcPrincPaid[i] = calcBalance[i];
                        focusPayment = calcMonthlyPayment[i] - calcBalance[i] - calcInterestPaid[i];
                        calcMonthlyPayment[i] = calcBalance[i] + calcInterestPaid[i];
                        calcBalance[i] = 0;
                        remainingLoans -= 1;
                        sortedLoans[i].results.payOffDate.setDate(currentMonth.getYear(), currentMonth.getMonth());
                    }
                }
            }
            firstPaymentPass = false;
        } // while ((focusPayment>0 || firstPaymentPass) && remainingLoans)

        // Send monthly results to ResultBar
        for (var i = 0; i < this.initLoanCount(); i++) {
            if (finishedCalculating[i] == 0) {
                if (calcBalance[i] == 0)
                    finishedCalculating[i] = 1;
                sortedLoans[i].results.drawMain(iterator, currentMonth, calcMonthlyPayment[i], calcPrincPaid[i], calcInterestPaid[i], calcBalance[i])
            }
        }
        currentMonth.increment();
        iterator++;

        // Check to see current date is < year 2200 to prevent ridiculous calls
        if (currentMonth.getYear() > 2200)
            this.possibleCalc = false;
    }// while(remainingLoans)


    if (this.possibleCalc) {

        // Draw final
        for (var i = 0; i < this.initLoanCount(); i++) {
            sortedLoans[i].results.drawFinal();
        }

        //Move around the divs
        for (var l = 0; l < this.initLoanCount(); l++) {
            if (l == 0)
                $('#allResultsContainer').prepend($('#resultsContainer' + sortedLoans[l].getUID()));
            else
                $('#resultsContainer' + sortedLoans[l].getUID()).insertAfter($('#resultsContainer' + sortedLoans[l - 1].getUID()));
        }
    }
    else
        this.impossibleCalcDisplay();
};


/**
 * Sorts this.loanArray according to sort type
 * TODO Sloppy O(n^2) sort, needs improvement
 * @return {number[]} An array of sorted unique IDs
 */
Unburyme.LoanApp.prototype.sortLoans = function () {

    var sortedArray = [],
        storedIDs = [],
        sortField = '';
    if (this.paymentType == 'avalanche')
        sortField = 'interest';
    else
        sortField = 'balance';

    while (sortedArray.length < this.loanCount) {
        var maxValue = 0,
            currentMaxUID = 0;

        for (var s = 0; s < this.initLoanCount(); s++) {
            var loanID = this.initLoanArray[s].uid;
            if (storedIDs.indexOf(loanID) == -1 && this.getInfo(loanID, sortField) > maxValue) {
                currentMaxUID = loanID;
                maxValue = this.getInfo(loanID, sortField);
            }
        }
        storedIDs.push(currentMaxUID);
        sortedArray.push(this.getLoan(currentMaxUID));
    }
    if (this.paymentType == 'avalanche')
        return sortedArray;
    else
        return sortedArray.reverse();
};


/**
 * Count the loans that are ready to be calculated
 * @return {number} Number of loans that are ready to be calculated
 */
Unburyme.LoanApp.prototype.initLoanCount = function () {

    return this.initLoanArray.length;

};


/**
 * Recheck to see which loans are ready to be calculated
 */
Unburyme.LoanApp.prototype.refreshInitLoanArray = function () {

    this.initLoanArray = [];
    for (var i = 0; i < this.loanCount; i++) {
        if (this.loanArray[i].isInitialized['loan'] && !this.loanArray[i].deleted)
            this.initLoanArray.push(this.loanArray[i]);
    }

};


/**
 * Clear data, used when users delete the last valid loan
 */
Unburyme.LoanApp.prototype.clearData = function () {

    this.autoCalc = 0;
    this.rolloverMonth.setCurrent();
    this.graph.reset();
    this.totalResults.reset();
    this.refreshInitLoanArray();
    $('.calculate').fadeIn(Unburyme.Config.fadeSpeed);
    this.createLoan();

};


/**
 * Sets up feedback when it is impossible to calculate given the parameters
 */
Unburyme.LoanApp.prototype.impossibleCalcDisplay = function () {

    var slideSpeed = this.config.slideSpeed;

    if ($('#error').length == 0) {
        var html = '<div id=\'error\'>\n';
        html += '    <p>One or more of the current loans will take <strong>centuries</strong> to pay off.</p>';
        html += '    <p>Please use more reasonable loan information.</p>';
        html += '</div>';
        $('#enclosure').prepend(html);
        $('#error').css('display', 'none');
    }
    $('#error').slideDown(this.config.slideSpeed);
    if (this.errorTimeout)
        window.clearTimeout(this.errorTimeout);
    this.errorTimeout = window.setTimeout(function () {
        $('#error').slideUp(slideSpeed);
    }, 3000);

};

/**
 * Checks to see if all the loans are valid or not
 * @return {boolean} Returns whether or not all the loans are valid
 */
Unburyme.LoanApp.prototype.areLoansValid = function () {

    var areLoansValid = true;
    for (var i = 0; i < this.loanCount; i++) {
        if (!this.loanArray[i].isValid['loan'])
            areLoansValid = false;
    }
    return areLoansValid;

};
