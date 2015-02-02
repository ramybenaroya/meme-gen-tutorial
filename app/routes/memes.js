import Ember from 'ember';

export default Ember.Route.extend({
	model: function() {
		return Ember.RSVP.hash({
			memes: this.store.find('meme'),
			users: this.store.find('user')
		});
	},
	actions: {
		saveMeme: function(meme) {
			meme.save().then(function() {
				this.transitionTo('memes.index');
			}.bind(this));
		},
		deleteMeme: function(meme) {
			return meme.destroyRecord();
		}
	}
});