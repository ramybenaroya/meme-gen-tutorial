import DS from 'ember-data';
import env from 'meme-gen-tutorial/config/environment';

export default DS.Model.extend({
	imgSrc: DS.attr('string', {
		defaultValue: env.defaultMemeImageSrc
	}),
	opener: DS.attr('string', {
		defaultValue: 'Opener'
	}),
	closer: DS.attr('string', {
		defaultValue: 'Closer'
	}),
	openerFontSize: DS.attr('number', {
		defaultValue: 60
	}),
	closerFontSize: DS.attr('number', {
		defaultValue: 60
	}),
	user: DS.belongsTo('user'),
	likedBy: DS.hasMany('user')
});