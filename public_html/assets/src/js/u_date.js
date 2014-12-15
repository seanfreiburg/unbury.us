
UDate = function () {
    this.year = 0;
    this.month = 0;
    this.setCurrent();
};


UDate.prototype.setCurrent = function () {

    var current = new Date();
    this.year = current.getFullYear();
    this.month = current.getMonth();

};


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
        this.year--;
        this.month = 11;
    }
    else
        this.month--;

};


UDate.prototype.print = function () {

    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return months[this.month] + " " + this.year;

};


