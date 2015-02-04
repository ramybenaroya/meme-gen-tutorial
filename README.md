# Meme-gen-tutorial

This README outlines the details of collaborating on this Ember application.
A short introduction of this app could easily go here.

## Prerequisites

You will need the following things properly installed on your computer.

* [Git](http://git-scm.com/)
* [Node.js](http://nodejs.org/) (with NPM)
* [Bower](http://bower.io/)
* [Ember CLI](http://www.ember-cli.com/)
* [PhantomJS](http://phantomjs.org/)

## Installation

* `npm install -g ember-cli`
* `npm install -g phantomjs`
* `git clone https://github.com/ramybenaroya/meme-gen-tutorial.git`
* `cd meme-gen-tutorial`
* `npm install`
* `bower install`
* in `/config/environment.js` change: `whoami: <your-name-in-lowercase>`

## Running / Development

* `ember server`
* Visit your app at [http://localhost:4200](http://localhost:4200).

### Code Generators

Make use of the many generators for code, try `ember help generate` for more details

### Running Tests

* `ember test`
* `ember test --server`

### Building

* `ember build` (development)
* `ember build --environment production` (production)

### Firebase
* [https://flickering-fire-9959.firebaseio.com/memeGen](https://flickering-fire-9959.firebaseio.com/memeGen)
* username: `duda.ember.tutorial@gmail.com`
* password: `duda1234`

### Recommended Steps

* Make the following routes available: `/memes`, `/memes/create`, 'memes/meme_id'
* [`/memes`](http://ramybenaroya.github.io/meme-gen-tutorial/#/spec/memes-route) :
  * Make a feed of all memes images only
  * Write a component for [`meme-list-item`](http://ramybenaroya.github.io/meme-gen-tutorial/#/spec/meme-list-item) and transform the feed to a list of these components. [`meme-list-item`](http://ramybenaroya.github.io/meme-gen-tutorial/#/spec/meme-list-item) should contain a [`meme-item`](http://ramybenaroya.github.io/meme-gen-tutorial/#/spec/meme-item), but you can defer its implementation at this step.
  * Enable the buttons like/delete/edit
  * Write the [`meme-item`](http://ramybenaroya.github.io/meme-gen-tutorial/#/spec/meme-item) component
  * Insert your [`meme-item`](http://ramybenaroya.github.io/meme-gen-tutorial/#/spec/meme-item) to [`meme-list-item`](http://ramybenaroya.github.io/meme-gen-tutorial/#/spec/meme-list-item)
  * Activate the memes feed free text filter
  * Write the [`user-filter-toggler`](http://ramybenaroya.github.io/meme-gen-tutorial/#/spec/user-filter-toggler) component
  * Make a list of all users in the memes sidebar
  * Activate filtering the memes by users
* [`/memes/create`](http://ramybenaroya.github.io/meme-gen-tutorial/#/spec/create-route) :
  * Connect the form input controllers to the [`meme-item`](http://ramybenaroya.github.io/meme-gen-tutorial/#/spec/meme-item)
  * Activate Saving
  * Handle Cancel by rollbacking the fresh model and transition back to [`/memes`](http://ramybenaroya.github.io/meme-gen-tutorial/#/spec/memes-route)
* [`/memes/:meme_id/edit`](http://ramybenaroya.github.io/meme-gen-tutorial/#/spec/edit-route) :
  * Connect the form input controllers to the [`meme-item`](http://ramybenaroya.github.io/meme-gen-tutorial/#/spec/meme-item)
  * Activate Saving
  * Handle Cancel by rollbacking changes model and transition back to [`/memes`](http://ramybenaroya.github.io/meme-gen-tutorial/#/spec/memes-route)


### Solution
* `git checkout solution`
* [http://ramybenaroya.github.io/meme-gen-tutorial](http://ramybenaroya.github.io/meme-gen-tutorial)


## Further Reading / Useful Links

* [ember.js](http://emberjs.com/)
* [ember-cli](http://www.ember-cli.com/)
* Development Browser Extensions
  * [ember inspector for chrome](https://chrome.google.com/webstore/detail/ember-inspector/bmdblncegkenkacieihfhpjfppoconhi)
  * [ember inspector for firefox](https://addons.mozilla.org/en-US/firefox/addon/ember-inspector/)

