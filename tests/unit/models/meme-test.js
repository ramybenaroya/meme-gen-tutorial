import {
  moduleForModel,
  test
} from 'ember-qunit';
import User from 'meme-gen-tutorial/models/user';

moduleForModel('meme', 'Meme', {
  // Specify the other units that are required for this test.
  needs: ['model:user']
});

test('it exists', function() {
  var model = this.subject();
  // var store = this.store();
  ok(!!model);
});
