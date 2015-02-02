import {
    moduleForComponent,
    test
}
from 'ember-qunit';
import env from 'meme-gen-tutorial/config/environment';

moduleForComponent('meme-item', 'MemeItemComponent', {
    // specify the other units that are required for this test
    needs: ['component:text-editor', 'template:components/text-editor']
});

test('it renders', function() {
    expect(2);

    // creates the component instance
    var component = this.subject({
        content: {
            imgSrc: env.defaultMemeImageSrc,
            opener: 'Opener',
            closer: 'Closer',
            openerFontSize: 60,
            closerFontSize: 60,
            openerPosition: null,
            closerPosition: null,
        },
        editable: false
    });
    equal(component._state, 'preRender');

    // appends the component to the page
    this.append();
    equal(component._state, 'inDOM');
});