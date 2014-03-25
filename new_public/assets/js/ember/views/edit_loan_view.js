Unburyus.EditLoanView = Ember.TextField.extend({
    didInsertElement: function() {
        this.$().focus();
    }
});

Ember.Handlebars.helper('edit-loan', Unburyus.EditLoanView);