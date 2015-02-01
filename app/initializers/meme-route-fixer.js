import Ember from 'ember';

export function initialize( /* container, application */ ) {
	var MemeRoute;
	try {
		MemeRoute = window.requireModule('meme-gen-test/routes/meme');
	} catch (e) {}

	if (MemeRoute && MemeRoute['default']) {
		MemeRoute = MemeRoute['default'];
	} else {
		MemeRoute = Ember.Route.extend();
		window.define("meme-gen-test/routes/meme", ["exports"],
			function(__exports__) {
				"use strict";
				__exports__["default"] = MemeRoute;
			});
	}
	MemeRoute.reopen({
		actions: {
			error: function(error, transition) {
				var memeId = Ember.get(transition, 'params.meme.meme_id'),
					record;
				if (memeId) {
					record = this.store.recordForId('meme', memeId);
					try {
						if (record && record.get('isEmpty')) {
							this.store.unloadRecord(record);
						}
					} catch (e) {}
					return this.replaceWith('memes');
				}
			}
		}
	});
}

export default {
	name: 'meme-route-fixer',
	initialize: initialize
};