/**
 * Unburyme.Date
 * Date object used for Unburyme
 * @constructor
 */
UDate = function () {
    this.year = 0;
    this.month = 0;
    this.setCurrent();
};

/**
 * Sets this to the current date
 */
UDate.prototype.setCurrent = function () {

    var current = new Date();
    this.year = current.getFullYear();
    this.month = current.getMonth();

};


/**
 * Set Unburyme.Date to year and month
 * @param {number} year
 * @param {number} month
 */
UDate.prototype.setDate = function (year, month) {

    this.year = year;
    this.month = month;

};


UDate.prototype.getMonth = function () {

    return this.month;

};


UDate.prototype.getYear = function () {

    return this.year;

};


UDate.prototype.getFloat = function () {

    return parseFloat(this.year + (this.month * .01));

};


/**
 * Return latest Unburyme.Date object
 * @param {Unburyme.Date} otherDate Other Unburyme.Date object to compare
 * @return {Unburyme.Date} The latest Unburyme.Date object
 */
UDate.prototype.getLatest = function (otherDate) {

    var latestDate = new Unburyme.Date();
    if (this.getYear() > otherDate.getYear())
        latestDate.setDate(this.getYear(), this.getMonth());
    else if (this.getYear() < otherDate.getYear())
        latestDate.setDate(otherDate.getYear(), otherDate.getMonth());
    else if (this.getMonth() > otherDate.getMonth())
        latestDate.setDate(this.getYear(), this.getMonth());
    else if (this.getMonth() < otherDate.getMonth())
        latestDate.setDate(otherDate.getYear(), otherDate.getMonth());
    else
        latestDate.setDate(this.getYear(), this.getMonth()); //They are equal
    return latestDate;
};


/**
 * Add a month to this
 */
UDate.prototype.increment = function () {

    if (this.month == 11) {
        this.year++; //Happy new year!
        this.month = 0;
    }
    else
        this.month++; //New month

};

UDate.prototype.decrement = function () {

    if (this.month == 0) {
        this.year--; //Happy new year!
        this.month = 11;
    }
    else
        this.month--; //New month

};

/**
 * @return {string} Formatted current date
 */
UDate.prototype.print = function () {

    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return months[this.month] + " " + this.year;

};
