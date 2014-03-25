Unburyus.Router.map(function() {
    this.resource('unburyus', { path: '/' });
});

Unburyus.UnburyusRoute = Ember.Route.extend({
    model: function() {
        return this.store.find('loan');
    }
});




