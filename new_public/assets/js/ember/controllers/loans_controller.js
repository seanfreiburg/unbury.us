Unburyus.LoansController = Ember.ArrayController.extend({
    actions: {
        createLoan: function() {

            var loan = this.store.createRecord('loan', {
                name: '',
                currentBalance: 0,
                minimumPayment: 0,
                interestRate: 0
            });

            // Save the new model
            todo.save();

            $('#loans').append("{{partial 'loan'}}")
        }
    }
});