Unburyus.LoanController = Ember.ObjectController.extend({
    actions: {
        acceptChanges: function(){
            this.get('model').save();
        }
    }

});