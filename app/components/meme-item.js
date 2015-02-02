import Ember from 'ember';

export default Ember.Component.extend({
	content: null,
	classNameBindings: ['editable', 'notEditable'],
	classNames: ['meme-item'],
	attributeBindings: ['style'],
	editable: false,
	contentEditableValue: function(){
		return this.get('editable').toString();
	}.property('editable'),
	notEditable: Ember.computed.not('editable'),
	applyDraggable: function() {
		Ember.run.scheduleOnce('afterRender', this, function() {
			this.$('.opener').css('top', this.get('content.openerPosition') || '0px');			
			if (!this.get('content.closerPosition')) {
				this.$('.closer').css('bottom', '0px');
			} else {
				this.$('.closer').css('top', this.get('content.closerPosition'));	
			}
			if (this.get('editable')) {
				this.$('.closer').draggable({
					axis: 'y',
					containment: "parent",
					stop: function() {
						this.set('content.closerPosition', this.$('.closer').css('top'));
					}.bind(this)
				});
				this.$('.opener').draggable({
					axis: 'y',
					containment: "parent",
					stop: function() {
						this.set('content.openerPosition', this.$('.opener').css('top'));
					}.bind(this)
				});
			}
		});
	}.on('didInsertElement'),
	style: Ember.computed.oneWay('backgroundImageStyle'),
	backgroundImageStyle: function() {
		return 'background-image: url(' + this.get('content.imgSrc') + ')';
	}.property('content.imgSrc'),
	openerStyle: function() {
		if (this.get('_state') === 'inDOM'){
			this.$('.opener').css('font-size', this.get('content.openerFontSize') + 'px');	
		}
	}.observes('content.openerFontSize').on('didInsertElement'),
	closerStyle: function() {
		if (this.get('_state') === 'inDOM'){
			this.$('.closer').css('font-size', this.get('content.closerFontSize') + 'px');
		}
	}.observes('content.closerFontSize').on('didInsertElement')
});