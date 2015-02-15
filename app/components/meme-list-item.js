import Ember from 'ember';

export default Ember.Component.extend({
	classNames: ['meme-list-item', 'panel', 'panel-default'],
	likeButtonClassName: function(){
		return 'btn' + (this.get('content.likedByMe') ? ' liked' : '');
	}.property('content.likedByMe'),
	actions: {
		deleteMeme: function(meme){
			this.sendAction('deleteMeme', meme);
		},
		toggleLike: function(meme){
			this.sendAction('toggleLike', meme);
		}
	}
});
