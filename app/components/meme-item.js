import Ember from 'ember';

export default Ember.Component.extend({
	content: null,
	classNameBindings: ['editable', 'notEditable'],
	classNames: ['meme-item'],
	attributeBindings: ['style'],
	editable: false,
	notEditable: Ember.computed.not('editable'),
	style: Ember.computed.oneWay('backgroundImageStyle'),
	backgroundImageStyle: function() {
		return 'background-image: url(' + this.get('content.imgSrc') + ')';
	}.property('content.imgSrc'),
	openerStyle: function() {
		return 'font-size: ' + this.get('content.openerFontSize') + 'px';	
	}.property('content.openerFontSize'),
	closerStyle: function() {
		return 'font-size: ' + this.get('content.closerFontSize') + 'px';	
	}.property('content.closerFontSize'),
});