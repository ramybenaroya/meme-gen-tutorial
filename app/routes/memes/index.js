import Ember from 'ember';

export default Ember.Route.extend({
	renderTemplate: function() {
		this.render();
		this.render('users-filter' ,{
			outlet: 'users-filter',
			into: 'memes.index'
		});
	}
});