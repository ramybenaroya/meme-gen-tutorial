import Ember from 'ember';

export default Ember.Component.extend({
	tagName: 'span',
	classNames: ['label'],
	classNameBindings: ['selected:label-success', 'notSelected:label-primary'],
	selected: false,
	notSelected: Ember.computed.not('selected'),
	click: function(){
		this.toggleProperty('selected');
		this.sendAction('toggleUser', this.get('content.id'), this.get('selected'));
	}
});
