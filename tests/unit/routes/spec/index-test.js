import {
  moduleFor,
  test
} from 'ember-qunit';

moduleFor('route:spec/index', 'SpecIndexRoute', {
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']
});

test('it exists', function() {
  var route = this.subject();
  ok(route);
});
