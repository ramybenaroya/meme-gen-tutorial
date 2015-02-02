import Ember from 'ember';

export default Ember.Mixin.create({
	actions: {
  		gotoRoute: function(routename){
  			this.transitionToRoute(routename);
  		}
  	}
});
