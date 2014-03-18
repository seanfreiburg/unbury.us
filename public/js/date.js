/**
 * Unburyme.Date
 * Date object used for Unburyme
 * @constructor
 */
Unburyme.Date = function () {
    this.year = 0;
    this.month = 0;
    this.setCurrent();
};

/**
 * Sets this to the current date
 */
Unburyme.Date.prototype.setCurrent = function () {

    var current = new Date();
    this.year = current.getFullYear();
    this.month = current.getMonth();

};


/**
 * Set Unburyme.Date to year and month
 * @param {number} year
 * @param {number} month
 */
Unburyme.Date.prototype.setDate = function (year, month) {

    this.year = year;
    this.month = month;

};


Unburyme.Date.prototype.getMonth = function () {

    return this.month;

};


Unburyme.Date.prototype.getYear = function () {

    return this.year;

};


Unburyme.Date.prototype.getFloat = function () {

    return parseFloat(this.year + (this.month * .01));

};


/**
 * Return latest Unburyme.Date object
 * @param {Unburyme.Date} otherDate Other Unburyme.Date object to compare
 * @return {Unburyme.Date} The latest Unburyme.Date object
 */
Unburyme.Date.prototype.getLatest = function (otherDate) {

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
Unburyme.Date.prototype.increment = function () {

    if (this.month == 11) {
        this.year++; //Happy new year!
        this.month = 0;
    }
    else
        this.month++; //New month

};

/**
 * @return {string} Formatted current date
 */
Unburyme.Date.prototype.print = function () {

    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
    return months[this.month] + " " + this.year;

}
