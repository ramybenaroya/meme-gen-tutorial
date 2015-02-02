import Ember from 'ember';

export default Ember.Route.extend({
	actions: {
		willTransition: function(){
			this.controller.get('model').rollback();
		}
	},
	renderTemplate: function(){
		this.render('meme-with-controls');
	}
});
