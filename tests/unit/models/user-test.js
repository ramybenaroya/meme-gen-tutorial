import {
  moduleForModel,
  test
} from 'ember-qunit';
import Meme from 'meme-gen-tutorial/models/meme';

moduleForModel('user', 'User', {
  // Specify the other units that are required for this test.
  needs: ['model:meme']
});

test('it exists', function() {
  var model = this.subject();
  // var store = this.store();
  ok(!!model);
});
