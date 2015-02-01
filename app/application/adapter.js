import DS from 'ember-data';
import env from 'meme-gen-tutorial/config/environment';

export default DS.FirebaseAdapter.extend({
	firebase: new Firebase(env.firebase)
});
