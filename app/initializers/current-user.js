import Ember from 'ember';
import config from 'meme-gen-tutorial/config/environment';

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
	application.inject('route', 'whoami', 'user:whoami-proxy');
	application.inject('controller', 'whoami', 'user:whoami-proxy');
	// try{
	// 	if (store.modelFor('user')){
	// 		application.deferReadiness();
	// 		store.find('user', config.whoami).then(function(user) {
	// 			application.register('user:whoami', user, {
	// 				instantiate: false,
	// 				singleton: true
	// 			});
	// 			application.inject('route', 'whoami', 'user:whoami');
	// 			application.inject('controller', 'whoami', 'user:whoami');
	// 			application.advanceReadiness();
	// 		});	
	// 	}	
	// } catch(e){
	// 	application.inject('route', 'whoami', 'user:whoami-proxy');
	// 	application.inject('controller', 'whoami', 'user:whoami-proxy');
	// }
}

export default {
	name: 'current-user',
	after: 'store',
	initialize: initialize
};