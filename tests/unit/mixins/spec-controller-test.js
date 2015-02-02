import Ember from 'ember';
import SpecControllerMixin from 'meme-gen-tutorial/mixins/spec-controller';

module('SpecControllerMixin');

// Replace this with your real tests.
test('it works', function() {
  var SpecControllerObject = Ember.Object.extend(SpecControllerMixin);
  var subject = SpecControllerObject.create();
  ok(subject);
});
