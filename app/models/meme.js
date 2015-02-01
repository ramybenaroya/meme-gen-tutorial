import DS from 'ember-data';
import env from 'meme-gen-tutorial/config/environment';

export default DS.Model.extend({
	imgSrc: DS.attr('string', {
		defaultValue: env.defaultMemeImgSrc
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
	openerPosition: DS.attr('string', {
		defaultValue: null
	}),
	closerPosition: DS.attr('string', {
		defaultValue: null
	}),
	user: DS.belongsTo('user'),
	likedBy: DS.hasMany('user')
});