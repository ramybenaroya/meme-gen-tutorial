import Ember from 'ember';
import SpecControllerMixin from 'meme-gen-tutorial/mixins/spec-controller';

export default Ember.Controller.extend(SpecControllerMixin, {
	highlightData: Ember.Object.create({
		create: Ember.A([
			'.frame > .panel',
			'.frame > .panel > .panel-heading',
			'.frame > .panel > .panel-heading span',
			'.frame > .panel > .panel-heading span',
			'.frame > .panel > .panel-heading',
			'.frame > .panel > .panel-body',
			'.frame > .panel > .panel-body > .panel',
			'.frame > .panel > .panel-body > .panel > .panel-body',
			'.frame > .panel > .panel-body > .panel > .panel-body > .form-group:nth-child(1)',
			'.frame > .panel > .panel-body > .panel > .panel-body > .form-group:nth-child(1) label',
			'.frame > .panel > .panel-body > .panel > .panel-body > .form-group:nth-child(1) label',
			'.frame > .panel > .panel-body > .panel > .panel-body > .form-group:nth-child(1) input',
			'.frame > .panel > .panel-body > .panel > .panel-body > .form-group:nth-child(1)',
			'.frame > .panel > .panel-body > .panel > .panel-body > .form-group:nth-child(2)',
			'.frame > .panel > .panel-body > .panel > .panel-body > .form-group:nth-child(2) label',
			'.frame > .panel > .panel-body > .panel > .panel-body > .form-group:nth-child(2) label',
			'.frame > .panel > .panel-body > .panel > .panel-body > .form-group:nth-child(2) input',
			'.frame > .panel > .panel-body > .panel > .panel-body > .form-group:nth-child(2)',
			'.frame > .panel > .panel-body > .panel > .panel-body > .form-group:nth-child(3)',
			'.frame > .panel > .panel-body > .panel > .panel-body > .form-group:nth-child(3) label',
			'.frame > .panel > .panel-body > .panel > .panel-body > .form-group:nth-child(3) label',
			'.frame > .panel > .panel-body > .panel > .panel-body > .form-group:nth-child(3) input',
			'.frame > .panel > .panel-body > .panel > .panel-body > .form-group:nth-child(3)',
			'.frame > .panel > .panel-body > .panel > .panel-body',
			'.frame > .panel > .panel-body > .panel > .meme-item',
			'.frame > .panel > .panel-body > .panel',
			'.frame > .panel > .panel-body',
			'.frame > .panel > .panel-footer',
			'.frame > .panel > .panel-footer > button',
			'.frame > .panel > .panel-footer > button',
			'.frame > .panel > .panel-footer > button',
			'.frame > .panel > .panel-footer > a',
			'.frame > .panel > .panel-footer > a button',
			'.frame > .panel > .panel-footer > a button',
			'.frame > .panel > .panel-footer > a',
			'.frame > .panel > .panel-footer',
			'.frame > .panel'
		])
	})
});
