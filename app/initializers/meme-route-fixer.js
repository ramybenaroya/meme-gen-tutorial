import config from 'meme-gen-test/config/environment';
export function initialize(container, application) {
	var store = container.lookup('store:main');
	application.register('user:whoami-proxy', Ember.Object.create({
		id: config.whoami,
		name: config.whoami.capitalize()
	}), {
		instantiate: false,
		singleton: true
	});
	application.inject('model', 'whoami', 'user:whoami-proxy');
	application.deferReadiness();
	store.find('user', config.whoami).then(function(user) {
		application.register('user:whoami', user, {
			instantiate: false,
			singleton: true
		});
		application.inject('route', 'whoami', 'user:whoami');
		application.inject('controller', 'whoami', 'user:whoami');
		application.advanceReadiness();
	});

}

export default {
	name: 'current-user',
	after: 'store',
	initialize: initialize
};