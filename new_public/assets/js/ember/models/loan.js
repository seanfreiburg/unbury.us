Unburyus.Loan = DS.Model.extend({
    name: DS.attr('string'),
    currentBalance: DS.attr('number'),
    minimumPayment: DS.attr('number'),
    interestRate: DS.attr('number')
});

