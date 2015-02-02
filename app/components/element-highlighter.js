import Ember from 'ember';

var $ = Ember.$;
export default Ember.Component.extend({
	data: Ember.A([]),
	gotoRoute: 'gotoRoute',
	bindHoverEvents: function(){
		var self = this;
		Ember.run.scheduleOnce('afterRender', this, function(){
			Ember.run.next(this, function(){
				this.$().on('mouseover', '.hljs-tag, .hljs-comment', function(event){
					var $tag = $(event.currentTarget),
						elementSelector = self.get('data')[$tag.index()],
						elementToHightlight;
					if (elementSelector){
						elementToHightlight = self.$(self.get('data')[$tag.index()]);
						elementToHightlight.addClass('hover-highlight');
						$tag.one('mouseleave', function(){
							elementToHightlight.removeClass('hover-highlight');
						});	
					}
				});
				this.$().on('click', '.hljs-comment, .hljs-value', function(event){
					var $comment = $(event.currentTarget),
						text = $comment.text().trim();
					if (/meme-item/.test(text)){
						self.sendAction('gotoRoute', 'spec.meme-item');
						return;
					}
					if (/meme-list-item/.test(text)){
						self.sendAction('gotoRoute', 'spec.meme-list-item');
						return;
					}
					if (/user-filter-toggler/.test(text)){
						self.sendAction('gotoRoute', 'spec.user-filter-toggler');
						return;
					}
					if (/link-to:\/memes\/create/.test(text)){
						self.sendAction('gotoRoute', 'spec.create-route');
						return;
					}
					if (/link-to:\/memes\/(.*)\/edit/.test(text)){
						self.sendAction('gotoRoute', 'spec.edit-route');
						return;
					}
					if (/link-to:\/memes/.test(text)){
						self.sendAction('gotoRoute', 'spec.memes-route');
						return;
					}
				});
			});
		});
	}.on('didInsertElement')
});
