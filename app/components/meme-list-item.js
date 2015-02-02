import Ember from 'ember';

export default Ember.Component.extend({
	classNames: ['meme-list-item', 'panel', 'panel-default'],
	actions: {
		deleteMeme: function(meme){
			this.sendAction('deleteMeme', meme);
		}
	}
});
