/**
 * Unburyme.Loan
 * The loan object that stores individual loan information
 * @constructor
 * @param {number} uid Unique ID for the loan
 * @param {Unburyme.LoanApp} loanApp
 */
Unburyme.Loan = function (uid, loanApp) {

    this.uid = uid;
    this.loanApp = loanApp;
    this.name = 'Loan ' + (this.uid + 1);
    this.balance = 0;
    this.minPayment = 0;
    this.interest = 0;
    this.results = new Unburyme.ResultBar(this.uid, this, this.loanApp);
    this.create();
    this.isInitialized = {
        'loan': 0,
        'name': 0,
        'balance': 0,
        'minPayment': 0,
        'interest': 0
    }
    this.isValid = {
        'loan': 0,
        'name': 0,
        'balance': 0,
        'minPayment': 0,
        'interest': 0
    }
    this.deleted = 0;

};


/**
 * Set up loan in DOM
 */
Unburyme.Loan.prototype.create = function () {


    var html = '<div id=\'loanbar' + this.uid + '\' class=\'loanBarInput uninitialized row\'>\n';
    html += '   <a href=\'#\' class=\'destroyLoan\' id=\'delete' + this.uid + '\'><div class=\'destroyLoanX\'></div></a>\n';
    html += '   <div class=\'loanName col-md-3\'>\n';
    html += '                   <div class=\'fieldTitle\'><p>Loan Name</p></div>\n'
    html += '                   <div class=\'fieldInput\'><input id=\'loanname' + this.uid + '\' class=\'name\' /></div>\n';
    html += '           </div>\n';
    html += '   <div class=\'currentBalance col-md-3 \'>\n';
    html += '                   <div class=\'fieldTitle\'>Current Balance</div>\n';
    html += '                   <div class=\'fieldInput\'><input id=\'loanbalance' + this.uid + '\' class=\'balance  uninitialized\' /></div>\n';
    html += '           </div>\n';
    html += '           <div class=\'minMonthlyPayment col-md-3 \'>\n';
    html += '                   <div class=\'fieldTitle\'>Min. Payment</div>\n';
    html += '                   <div class=\'fieldInput\'><input id=\'loanminPayment' + this.uid + '\' class=\'minPayment  uninitialized\' /></div>\n';
    html += '           </div>\n';
    html += '           <div class=\'interest col-md-3 \'>\n';
    html += '                   <div class=\'fieldTitle\'>Interest</div>\n';
    html += '                   <div class=\'fieldInput\'><input id=\'loaninterest' + this.uid + '\' class=\'interest  uninitialized\' /></div>\n';
    html += '        </div>\n';
    html += '       </div>\n';
    html += '<hr><br>';

    $('#loanBarInputContainer').append(html);
    $('#loanbar' + this.uid).css('display', 'none').slideDown(this.loanApp.config.slideSpeed);

};


/**
 * Destroys loan object and DOM elements
 */
Unburyme.Loan.prototype.destroy = function () {

    $('#loanbar' + this.uid).slideUp(this.loanApp.config.slideSpeed, function () {
        $('#loanbar' + this.uid).remove();
    });
    this.results.destroy();
    //Remove all uninitialization tags
    this.cleanField('bar');
    this.cleanField('name');
    this.cleanField('balance');
    this.cleanField('minPayment');
    this.cleanField('interest');

    // Should be removed from array; sanity check
    this.deleted = 1;

    for (var i = 0; i < 5; i++)
        this.isInitialized[i] = 0;

};


Unburyme.Loan.prototype.setName = function (name) {

    this.name = name;

};


Unburyme.Loan.prototype.setBalance = function (balance) {

    this.initializeField('balance');
    this.balance = balance;

};


Unburyme.Loan.prototype.setMinPayment = function (minPayment) {

    this.initializeField('minPayment');
    this.minPayment = minPayment;

};


Unburyme.Loan.prototype.setInterest = function (interest) {

    this.initializeField('interest');
    this.interest = interest;

};


Unburyme.Loan.prototype.getName = function () {

    return this.name;

};


Unburyme.Loan.prototype.getBalance = function () {

    return this.balance;

};


Unburyme.Loan.prototype.getMinPayment = function () {

    return this.minPayment;

};


Unburyme.Loan.prototype.getInterest = function () {

    return this.interest;

};


Unburyme.Loan.prototype.getValue = function (field) {

    var value = '';
    switch (field) {
        case 'name':
            value = this.getName();
            break;
        case 'balance':
            value = this.getBalance();
            break;
        case 'minPayment':
            value = this.getMinPayment();
            break;
        case 'interest':
            value = this.getInterest();
            break;
    }
    return value;

};


Unburyme.Loan.prototype.getUID = function () {

    return this.uid;

};


Unburyme.Loan.prototype.calculate = function () {

    this.results.calculate();

};


Unburyme.Loan.prototype.validate = function (field, value) {

    var validChars = "0123456789., ",
        validTest = true,
        character;
    for (i = 0; i < value.length && validTest == true; i++) {
        character = value.charAt(i);
        if (validChars.indexOf(character) == -1)
            validTest = false;
    }
    if (value == '') {
        validTest = false;
        $('input .' + field).val('');
    }
    if (field == 'name')
        validTest = true;
    if (validTest)
        this.isValid[field] = 1;
    else
        this.isValid[field] = 0;
    if (this.isValid['balance'] && this.isValid['minPayment'] && this.isValid['interest'])
        this.isValid['loan'] = 1;

    // Call validateDisplay to handle visual representation
    this.validateDisplay(field, validTest);
    return validTest;

};


Unburyme.Loan.prototype.validateDisplay = function (field, isFieldValid) {

    if (isFieldValid)
        $('#loan' + field + this.uid).removeClass('invalidField');
    else
        $('#loan' + field + this.uid).addClass('invalidField');
};


Unburyme.Loan.prototype.cleanField = function (field) {

    if (field == 'loan')
        field = 'bar';
    $('#loan' + field + this.uid).removeClass('uninitialized');
    $('#loan' + field + this.uid).removeClass('invalidField');
};


Unburyme.Loan.prototype.initializeField = function (field) {

    this.isInitialized[field] = 1;
    this.cleanField(field);
    if (this.isInitialized['balance'] && this.isInitialized['minPayment'] && this.isInitialized['interest']) {
        this.isInitialized['loan'] = 1;
        this.cleanField('loan');
    }
};

