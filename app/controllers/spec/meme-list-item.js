import Ember from 'ember';
import SpecControllerMixin from 'meme-gen-tutorial/mixins/spec-controller';
export default Ember.Controller.extend(SpecControllerMixin, {
	highlightData: Ember.Object.create({
		ownedByCurrentUser: Ember.A([
			'.frame .meme-list-item',
			'.frame .meme-list-item .panel-body',
			'.frame .meme-list-item .panel-body .meme-item',
			'.frame .meme-list-item .panel-body',
			'.frame .meme-list-item .panel-footer',
			'.frame .meme-list-item .panel-footer > a',
			'.frame .meme-list-item .panel-footer > a button',
			'.frame .meme-list-item .panel-footer > a button span',
			'.frame .meme-list-item .panel-footer > a button span',
			'.frame .meme-list-item .panel-footer > a button',
			'.frame .meme-list-item .panel-footer > a',
			null,
			'.frame .meme-list-item .panel-footer > button:nth-child(2)',
			'.frame .meme-list-item .panel-footer > button:nth-child(2) span',
			'.frame .meme-list-item .panel-footer > button:nth-child(2) span',
			'.frame .meme-list-item .panel-footer > button:nth-child(2)',
			null,
			'.frame .meme-list-item .panel-footer > button:nth-child(3)',
			'.frame .meme-list-item .panel-footer > button:nth-child(3) span:nth-child(1)',
			'.frame .meme-list-item .panel-footer > button:nth-child(3) span:nth-child(1)',
			'.frame .meme-list-item .panel-footer > button:nth-child(3) span:nth-child(2)',
			'.frame .meme-list-item .panel-footer > button:nth-child(3) span:nth-child(2)',
			'.frame .meme-list-item .panel-footer > button:nth-child(3)',
			'.frame .meme-list-item .panel-footer > .label',
			'.frame .meme-list-item .panel-footer > .label',
			'.frame .meme-list-item .panel-footer',
			'.frame .meme-list-item'

		]),
		ownedByAnother: Ember.A([
			'.frame .meme-list-item',
			'.frame .meme-list-item .panel-body',
			'.frame .meme-list-item .panel-body .meme-item',
			'.frame .meme-list-item .panel-body',
			'.frame .meme-list-item .panel-footer',
			null,
			'.frame .meme-list-item .panel-footer > button',
			'.frame .meme-list-item .panel-footer > button span:nth-child(1)',
			'.frame .meme-list-item .panel-footer > button span:nth-child(1)',
			'.frame .meme-list-item .panel-footer > button span:nth-child(2)',
			'.frame .meme-list-item .panel-footer > button span:nth-child(2)',
			'.frame .meme-list-item .panel-footer > button',
			'.frame .meme-list-item .panel-footer > .label',
			'.frame .meme-list-item .panel-footer > .label',
			'.frame .meme-list-item .panel-footer',
			'.frame .meme-list-item'
		])
	})
});
