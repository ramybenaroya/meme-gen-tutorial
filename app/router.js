import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
	location: config.locationType
});

Router.map(function() {
	this.resource("memes", function() {
		this.resource("meme", {path: '/:meme_id'}, function() {
			this.route("edit");
		});
		this.route("create");
	});
});

export default Router;