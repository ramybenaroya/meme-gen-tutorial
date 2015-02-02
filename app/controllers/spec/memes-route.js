import Ember from 'ember';
import SpecControllerMixin from 'meme-gen-tutorial/mixins/spec-controller';
export default Ember.Controller.extend(SpecControllerMixin, {
	highlightData: Ember.Object.create({
		memes: Ember.A([
			'.frame .memes-container',
			'.frame .memes-container .memes-filters',
			'.frame .memes-container .memes-filters .form-group:nth-child(1)',
			'.frame .memes-container .memes-filters .form-group:nth-child(1) a',
			'.frame .memes-container .memes-filters .form-group:nth-child(1) a button',
			'.frame .memes-container .memes-filters .form-group:nth-child(1) a button span',
			'.frame .memes-container .memes-filters .form-group:nth-child(1) a button span',
			'.frame .memes-container .memes-filters .form-group:nth-child(1) a button',
			'.frame .memes-container .memes-filters .form-group:nth-child(1) a',
			'.frame .memes-container .memes-filters .form-group:nth-child(1)',
			'.frame .memes-container .memes-filters .form-group:nth-child(2)',
			'.frame .memes-container .memes-filters .form-group:nth-child(2) input',
			'.frame .memes-container .memes-filters .form-group:nth-child(2)',
			'.frame .memes-container .memes-filters .users',
			'.frame .memes-container .memes-filters .users .panel.panel-default',
			'.frame .memes-container .memes-filters .users .panel .panel-heading',
			'.frame .memes-container .memes-filters .users .panel .panel-heading',
			'.frame .memes-container .memes-filters .users .panel .panel-body',
			'.frame .memes-container .memes-filters .users .panel .panel-body',
			'.frame .memes-container .memes-filters .users .panel .panel-body',
			'.frame .memes-container .memes-filters .users .panel.panel-default',
			'.frame .memes-container .memes-filters .users',
			'.frame .memes-container .memes-filters',
			'.frame .memes-container .memes-list',
			'.frame .memes-container .memes-list',
			'.frame .memes-container .memes-list',
			'.frame .memes-container',
		])
	})
});
