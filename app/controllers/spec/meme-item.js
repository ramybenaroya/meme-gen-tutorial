import Ember from 'ember';
import SpecControllerMixin from 'meme-gen-tutorial/mixins/spec-controller';
export default Ember.Controller.extend(SpecControllerMixin, {
	highlightData: Ember.Object.create({
		memeItem: Ember.A([
			'.frame .meme-item',
			'.frame .meme-item .opener',
			'.frame .meme-item .opener .TextEditor',
			'.frame .meme-item .opener',
			'.frame .meme-item .closer',
			'.frame .meme-item .closer .TextEditor',
			'.frame .meme-item .closer',
			'.frame .meme-item'
		])
	})
});
