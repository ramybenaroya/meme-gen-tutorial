import Ember from 'ember';

var escape = window.escape;
export default Ember.Controller.extend({
	queryParams: ['filterByUsers'],
	searchTerm: '',
	filterByUsers: Ember.A([]),
	actions: {
		toggleUser: function(userId, isSelected){
			var filterByUsers = this.get('filterByUsers');
			if (isSelected){
				filterByUsers.addObject(userId);
			} else {
				filterByUsers.removeObject(userId);
			}
		},
		toggleLike: function(meme){
			if (meme.get('likedByMe')){
				meme.get('likedBy').removeObject(this.whoami);
			} else {
				meme.get('likedBy').addObject(this.whoami);
			}
			return meme.save();
		}
	},
	usersToFilterBy: function(){
		return this.get('model.users').map(function(user){
			return Ember.Object.extend({
				name: user.get('name'), 
				id: user.get('id'),
				selected: this.get('filterByUsers').contains(user.get('id'))
			}).create();
		}, this);
	}.property('filterByUsers'),
	filteredMemes: function(){
		var filterByUsers = this.get('filterByUsers'),
			searchTermRegExp = new RegExp(escape(this.get('searchTerm')).toLowerCase());
		return this.store.filter('meme', function(meme){
			return (filterByUsers.length === 0 || filterByUsers.contains(meme.get('user.id'))) &&
					(searchTermRegExp.test(meme.get('opener').toLowerCase()) || searchTermRegExp.test(meme.get('closer').toLowerCase()));
		});
	}.property('filterByUsers.@each', 'searchTerm', 'model.memes')
});
