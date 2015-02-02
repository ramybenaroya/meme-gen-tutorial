import Ember from 'ember';
import SpecControllerMixin from 'meme-gen-tutorial/mixins/spec-controller';
export default Ember.Controller.extend(SpecControllerMixin, {
	highlightData: Ember.Object.create({
		userFilterToggler: Ember.A([
			null,
			'.frame .label',
			'.frame .label'
		])
	})
});
