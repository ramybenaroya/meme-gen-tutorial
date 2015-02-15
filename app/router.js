import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
    location: config.locationType
});

Router.map(function() {
    this.resource("memes", function() {
        this.resource("meme", {
            path: '/:meme_id'
        }, function() {
            this.route("edit");
        });
        this.route("create");
    });
    this.route("spec", function() {
        this.route("memes-route");
        this.route("meme-list-item");
        this.route("meme-item");
        this.route("edit-route");
        this.route("create-route");
        this.route("user-filter-toggler");
    });
});

export default Router;