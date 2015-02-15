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
	users: function(){
		var users = this.get('model.users');
		if (users){
			users = users.map(function(user){
				return Ember.Object.extend({
					name: user.get('name'), 
					id: user.get('id'),
					selected: false
				}).create();
			}, this);
		}
		return Ember.A(users);
	}.property('model.users'),
	updateSelectedUsers: function(){
		var filterByUsers = this.get('filterByUsers'),
			users = this.get('users');
		if (users && filterByUsers){
			users.forEach(function(user){
				user.set('selected', filterByUsers.contains(user.get('id')));
			});	
		}
	}.observes('filterByUsers.@each', 'users').on('init'),
	filteredMemes: Ember.computed.filter('model.memes', function(meme){
		var filterByUsers = this.get('filterByUsers'),
			searchTermRegExp = new RegExp(escape(this.get('searchTerm')).toLowerCase());
			return (filterByUsers.length === 0 || filterByUsers.contains(meme.get('user.id'))) &&
					(searchTermRegExp.test(meme.get('opener').toLowerCase()) || searchTermRegExp.test(meme.get('closer').toLowerCase()));
	}).property('filterByUsers.@each', 'searchTerm', 'model.memes')
});
