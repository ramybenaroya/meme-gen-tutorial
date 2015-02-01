import DS from 'ember-data';

export default DS.Model.extend({
	name: DS.attr(),
	memes: DS.hasMany('meme', {
		inverse: 'user'
	})
});