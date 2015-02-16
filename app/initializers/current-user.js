import Ember from 'ember';
import config from 'meme-gen-tutorial/config/environment';

export function initialize(container, application) {
	var store = container.lookup('store:main');
	application.register('user:whoami-proxy', Ember.ObjectProxy.create({
		content: {
			id: config.whoami,
			name: config.whoami.capitalize()	
		}
	}), {
		instantiate: false,
		singleton: true
	});
	application.inject('model', 'whoami', 'user:whoami-proxy');
	application.inject('route', 'whoami', 'user:whoami-proxy');
	application.inject('controller', 'whoami', 'user:whoami-proxy');
}

export default {
	name: 'current-user',
	after: 'store',
	initialize: initialize
};