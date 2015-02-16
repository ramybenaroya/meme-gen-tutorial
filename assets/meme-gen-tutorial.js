/* jshint ignore:start */

/* jshint ignore:end */

define('meme-gen-tutorial/adapters/application', ['exports', 'ember-data', 'meme-gen-tutorial/config/environment'], function (exports, DS, env) {

  'use strict';

  exports['default'] = DS['default'].FirebaseAdapter.extend({
    firebase: new Firebase(env['default'].firebase)
  });

});
define('meme-gen-tutorial/app', ['exports', 'ember', 'ember/resolver', 'ember/load-initializers', 'meme-gen-tutorial/config/environment'], function (exports, Ember, Resolver, loadInitializers, config) {

  'use strict';

  Ember['default'].MODEL_FACTORY_INJECTIONS = true;

  var App = Ember['default'].Application.extend({
    modulePrefix: config['default'].modulePrefix,
    podModulePrefix: config['default'].podModulePrefix,
    Resolver: Resolver['default']
  });

  loadInitializers['default'](App, config['default'].modulePrefix);

  exports['default'] = App;

});
define('meme-gen-tutorial/components/code-snippet', ['exports', 'ember', 'meme-gen-tutorial/snippets'], function (exports, Ember, Snippets) {

  'use strict';

  var Highlight = require("highlight.js");

  exports['default'] = Ember['default'].Component.extend({
    tagName: "pre",
    classNameBindings: ["language"],
    unindent: true,

    _unindent: function (src) {
      if (!this.get("unindent")) {
        return src;
      }
      var match,
          min,
          lines = src.split("\n");
      for (var i = 0; i < lines.length; i++) {
        match = /^\s*/.exec(lines[i]);
        if (match && (typeof min === "undefined" || min > match[0].length)) {
          min = match[0].length;
        }
      }
      if (typeof min !== "undefined" && min > 0) {
        src = src.replace(new RegExp("(\\n|^)\\s{" + min + "}", "g"), "$1");
      }
      return src;
    },

    source: (function () {
      return this._unindent((Snippets['default'][this.get("name")] || "").replace(/^(\s*\n)*/, "").replace(/\s*$/, ""));
    }).property("name"),

    didInsertElement: function () {
      Highlight.highlightBlock(this.get("element"));
    },

    language: (function () {
      var m = /\.(\w+)$/i.exec(this.get("name"));
      if (m) {
        switch (m[1].toLowerCase()) {
          case "js":
            return "javascript";
          case "hbs":
            return "handlebars";
        }
      }
    }).property("name")
  });

});
define('meme-gen-tutorial/components/element-highlighter', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  var $ = Ember['default'].$;
  exports['default'] = Ember['default'].Component.extend({
    data: Ember['default'].A([]),
    gotoRoute: "gotoRoute",
    bindHoverEvents: (function () {
      var self = this;
      Ember['default'].run.scheduleOnce("afterRender", this, function () {
        Ember['default'].run.next(this, function () {
          this.$().on("mouseover", ".hljs-tag, .hljs-comment", function (event) {
            var $tag = $(event.currentTarget),
                elementSelector = self.get("data")[$tag.index()],
                elementToHightlight;
            if (elementSelector) {
              elementToHightlight = self.$(self.get("data")[$tag.index()]);
              elementToHightlight.addClass("hover-highlight");
              $tag.one("mouseleave", function () {
                elementToHightlight.removeClass("hover-highlight");
              });
            }
          });
          this.$().on("click", ".hljs-comment, .hljs-value", function (event) {
            var $comment = $(event.currentTarget),
                text = $comment.text().trim();
            if (/meme-item/.test(text)) {
              self.sendAction("gotoRoute", "spec.meme-item");
              return;
            }
            if (/meme-list-item/.test(text)) {
              self.sendAction("gotoRoute", "spec.meme-list-item");
              return;
            }
            if (/user-filter-toggler/.test(text)) {
              self.sendAction("gotoRoute", "spec.user-filter-toggler");
              return;
            }
            if (/link-to:\/memes\/create/.test(text)) {
              self.sendAction("gotoRoute", "spec.create-route");
              return;
            }
            if (/link-to:\/memes\/(.*)\/edit/.test(text)) {
              self.sendAction("gotoRoute", "spec.edit-route");
              return;
            }
            if (/link-to:\/memes/.test(text)) {
              self.sendAction("gotoRoute", "spec.memes-route");
              return;
            }
          });
        });
      });
    }).on("didInsertElement")
  });

});
define('meme-gen-tutorial/components/meme-item', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Component.extend({
    content: null,
    classNameBindings: ["editable", "notEditable"],
    classNames: ["meme-item"],
    attributeBindings: ["style"],
    editable: false,
    notEditable: Ember['default'].computed.not("editable"),
    style: Ember['default'].computed.oneWay("backgroundImageStyle"),
    backgroundImageStyle: (function () {
      return "background-image: url(" + this.get("content.imgSrc") + ")";
    }).property("content.imgSrc"),
    openerStyle: (function () {
      return "font-size: " + this.get("content.openerFontSize") + "px";
    }).property("content.openerFontSize"),
    closerStyle: (function () {
      return "font-size: " + this.get("content.closerFontSize") + "px";
    }).property("content.closerFontSize") });

});
define('meme-gen-tutorial/components/meme-list-item', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Component.extend({
    classNames: ["meme-list-item", "panel", "panel-default"],
    likeButtonClassName: (function () {
      return "btn" + (this.get("content.likedByMe") ? " liked" : "");
    }).property("content.likedByMe"),
    actions: {
      deleteMeme: function (meme) {
        this.sendAction("deleteMeme", meme);
      },
      toggleLike: function (meme) {
        this.sendAction("toggleLike", meme);
      }
    }
  });

});
define('meme-gen-tutorial/components/text-editor', ['exports', 'text-editor/components/text-editor'], function (exports, TextEditor) {

	'use strict';

	exports['default'] = TextEditor['default'];

});
define('meme-gen-tutorial/components/user-filter-toggler', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Component.extend({
    tagName: "span",
    classNames: ["label"],
    classNameBindings: ["selected:label-success", "notSelected:label-primary"],
    selected: false,
    notSelected: Ember['default'].computed.not("selected"),
    click: function () {
      this.sendAction("toggleUser", this.get("content.id"), !this.get("selected"));
    }
  });

});
define('meme-gen-tutorial/controllers/meme/edit', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Controller.extend({
    title: "Edit Meme",
    actionName: "Save"
  });

});
define('meme-gen-tutorial/controllers/memes/create', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Controller.extend({
    title: "Create Meme",
    actionName: "Create"
  });

});
define('meme-gen-tutorial/controllers/memes/index', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  var escape = window.escape;
  exports['default'] = Ember['default'].Controller.extend({
    queryParams: ["filterByUsers"],
    searchTerm: "",
    filterByUsers: Ember['default'].A([]),
    actions: {
      toggleUser: function (userId, isSelected) {
        var filterByUsers = this.get("filterByUsers");
        if (isSelected) {
          filterByUsers.addObject(userId);
        } else {
          filterByUsers.removeObject(userId);
        }
      },
      toggleLike: function (meme) {
        if (meme.get("likedByMe")) {
          meme.get("likedBy").removeObject(this.whoami);
        } else {
          meme.get("likedBy").addObject(this.whoami);
        }
        return meme.save();
      }
    },
    users: (function () {
      var users = this.get("model.users");
      if (users) {
        users = users.map(function (user) {
          return Ember['default'].Object.extend({
            name: user.get("name"),
            id: user.get("id"),
            selected: false
          }).create();
        }, this);
      }
      return Ember['default'].A(users);
    }).property("model.users"),
    updateSelectedUsers: (function () {
      var filterByUsers = this.get("filterByUsers"),
          users = this.get("users");
      if (users && filterByUsers) {
        users.forEach(function (user) {
          user.set("selected", filterByUsers.contains(user.get("id")));
        });
      }
    }).observes("filterByUsers.@each", "users").on("init"),
    filteredMemes: Ember['default'].computed.filter("model.memes", function (meme) {
      var filterByUsers = this.get("filterByUsers"),
          searchTermRegExp = new RegExp(escape(this.get("searchTerm")).toLowerCase());
      return (filterByUsers.length === 0 || filterByUsers.contains(meme.get("user.id"))) && (searchTermRegExp.test(meme.get("opener").toLowerCase()) || searchTermRegExp.test(meme.get("closer").toLowerCase()));
    }).property("filterByUsers.@each", "searchTerm", "model.memes")
  });

});
define('meme-gen-tutorial/controllers/spec', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Controller.extend({
    highlightData: Ember['default'].Object.create({
      memes: Ember['default'].A([".frame .memes-container", ".frame .memes-container .memes-filters", ".frame .memes-container .memes-filters .form-group:nth-child(1)", ".frame .memes-container .memes-filters .form-group:nth-child(1) a", ".frame .memes-container .memes-filters .form-group:nth-child(1) a button", ".frame .memes-container .memes-filters .form-group:nth-child(1) a button span", ".frame .memes-container .memes-filters .form-group:nth-child(1) a button span", ".frame .memes-container .memes-filters .form-group:nth-child(1) a button", ".frame .memes-container .memes-filters .form-group:nth-child(1) a", ".frame .memes-container .memes-filters .form-group:nth-child(1)", ".frame .memes-container .memes-filters .form-group:nth-child(2)", ".frame .memes-container .memes-filters .form-group:nth-child(2) input", ".frame .memes-container .memes-filters .form-group:nth-child(2)", ".frame .memes-container .memes-filters .users", ".frame .memes-container .memes-filters .users .panel.panel-default", ".frame .memes-container .memes-filters .users .panel .panel-heading", ".frame .memes-container .memes-filters .users .panel .panel-heading", ".frame .memes-container .memes-filters .users .panel .panel-body", ".frame .memes-container .memes-filters .users .panel .panel-body", ".frame .memes-container .memes-filters .users .panel .panel-body", ".frame .memes-container .memes-filters .users .panel.panel-default", ".frame .memes-container .memes-filters .users", ".frame .memes-container .memes-filters", ".frame .memes-container .memes-list", ".frame .memes-container .memes-list", ".frame .memes-container .memes-list", ".frame .memes-container"]),
      userFilterToggler: Ember['default'].A([".frame .label", ".frame .label"])
    })
  });

});
define('meme-gen-tutorial/controllers/spec/create-route', ['exports', 'ember', 'meme-gen-tutorial/mixins/spec-controller'], function (exports, Ember, SpecControllerMixin) {

  'use strict';

  exports['default'] = Ember['default'].Controller.extend(SpecControllerMixin['default'], {
    highlightData: Ember['default'].Object.create({
      create: Ember['default'].A([".frame > .panel", ".frame > .panel > .panel-heading", ".frame > .panel > .panel-heading span", ".frame > .panel > .panel-heading span", ".frame > .panel > .panel-heading", ".frame > .panel > .panel-body", ".frame > .panel > .panel-body > .panel", ".frame > .panel > .panel-body > .panel > .panel-body", ".frame > .panel > .panel-body > .panel > .panel-body > .form-group:nth-child(1)", ".frame > .panel > .panel-body > .panel > .panel-body > .form-group:nth-child(1) label", ".frame > .panel > .panel-body > .panel > .panel-body > .form-group:nth-child(1) label", ".frame > .panel > .panel-body > .panel > .panel-body > .form-group:nth-child(1) input", ".frame > .panel > .panel-body > .panel > .panel-body > .form-group:nth-child(1)", ".frame > .panel > .panel-body > .panel > .panel-body > .form-group:nth-child(2)", ".frame > .panel > .panel-body > .panel > .panel-body > .form-group:nth-child(2) label", ".frame > .panel > .panel-body > .panel > .panel-body > .form-group:nth-child(2) label", ".frame > .panel > .panel-body > .panel > .panel-body > .form-group:nth-child(2) input", ".frame > .panel > .panel-body > .panel > .panel-body > .form-group:nth-child(2)", ".frame > .panel > .panel-body > .panel > .panel-body > .form-group:nth-child(3)", ".frame > .panel > .panel-body > .panel > .panel-body > .form-group:nth-child(3) label", ".frame > .panel > .panel-body > .panel > .panel-body > .form-group:nth-child(3) label", ".frame > .panel > .panel-body > .panel > .panel-body > .form-group:nth-child(3) input", ".frame > .panel > .panel-body > .panel > .panel-body > .form-group:nth-child(3)", ".frame > .panel > .panel-body > .panel > .panel-body", ".frame > .panel > .panel-body > .panel", ".frame > .panel > .panel-body > .meme-item", ".frame > .panel > .panel-body", ".frame > .panel > .panel-footer", ".frame > .panel > .panel-footer > button", ".frame > .panel > .panel-footer > button", ".frame > .panel > .panel-footer > button", ".frame > .panel > .panel-footer > a", ".frame > .panel > .panel-footer > a button", ".frame > .panel > .panel-footer > a button", ".frame > .panel > .panel-footer > a", ".frame > .panel > .panel-footer", ".frame > .panel"])
    })
  });

});
define('meme-gen-tutorial/controllers/spec/edit-route', ['exports', 'ember', 'meme-gen-tutorial/mixins/spec-controller'], function (exports, Ember, SpecControllerMixin) {

  'use strict';

  exports['default'] = Ember['default'].Controller.extend(SpecControllerMixin['default'], {
    highlightData: Ember['default'].Object.create({
      edit: Ember['default'].A([".frame > .panel", ".frame > .panel > .panel-heading", ".frame > .panel > .panel-heading span", ".frame > .panel > .panel-heading span", ".frame > .panel > .panel-heading", ".frame > .panel > .panel-body", ".frame > .panel > .panel-body > .panel", ".frame > .panel > .panel-body > .panel > .panel-body", ".frame > .panel > .panel-body > .panel > .panel-body > .form-group:nth-child(1)", ".frame > .panel > .panel-body > .panel > .panel-body > .form-group:nth-child(1) label", ".frame > .panel > .panel-body > .panel > .panel-body > .form-group:nth-child(1) label", ".frame > .panel > .panel-body > .panel > .panel-body > .form-group:nth-child(1) input", ".frame > .panel > .panel-body > .panel > .panel-body > .form-group:nth-child(1)", ".frame > .panel > .panel-body > .panel > .panel-body > .form-group:nth-child(2)", ".frame > .panel > .panel-body > .panel > .panel-body > .form-group:nth-child(2) label", ".frame > .panel > .panel-body > .panel > .panel-body > .form-group:nth-child(2) label", ".frame > .panel > .panel-body > .panel > .panel-body > .form-group:nth-child(2) input", ".frame > .panel > .panel-body > .panel > .panel-body > .form-group:nth-child(2)", ".frame > .panel > .panel-body > .panel > .panel-body > .form-group:nth-child(3)", ".frame > .panel > .panel-body > .panel > .panel-body > .form-group:nth-child(3) label", ".frame > .panel > .panel-body > .panel > .panel-body > .form-group:nth-child(3) label", ".frame > .panel > .panel-body > .panel > .panel-body > .form-group:nth-child(3) input", ".frame > .panel > .panel-body > .panel > .panel-body > .form-group:nth-child(3)", ".frame > .panel > .panel-body > .panel > .panel-body", ".frame > .panel > .panel-body > .panel", ".frame > .panel > .panel-body > .meme-item", ".frame > .panel > .panel-body", ".frame > .panel > .panel-footer", ".frame > .panel > .panel-footer > button", ".frame > .panel > .panel-footer > button", ".frame > .panel > .panel-footer > button", ".frame > .panel > .panel-footer > a", ".frame > .panel > .panel-footer > a button", ".frame > .panel > .panel-footer > a button", ".frame > .panel > .panel-footer > a", ".frame > .panel > .panel-footer", ".frame > .panel"])
    })
  });

});
define('meme-gen-tutorial/controllers/spec/meme-item', ['exports', 'ember', 'meme-gen-tutorial/mixins/spec-controller'], function (exports, Ember, SpecControllerMixin) {

  'use strict';

  exports['default'] = Ember['default'].Controller.extend(SpecControllerMixin['default'], {
    highlightData: Ember['default'].Object.create({
      memeItem: Ember['default'].A([".frame .meme-item", ".frame .meme-item .opener", ".frame .meme-item .opener .TextEditor", ".frame .meme-item .opener", ".frame .meme-item .closer", ".frame .meme-item .closer .TextEditor", ".frame .meme-item .closer", ".frame .meme-item"])
    })
  });

});
define('meme-gen-tutorial/controllers/spec/meme-list-item', ['exports', 'ember', 'meme-gen-tutorial/mixins/spec-controller'], function (exports, Ember, SpecControllerMixin) {

  'use strict';

  exports['default'] = Ember['default'].Controller.extend(SpecControllerMixin['default'], {
    highlightData: Ember['default'].Object.create({
      ownedByCurrentUser: Ember['default'].A([".frame .meme-list-item", ".frame .meme-list-item .panel-body", ".frame .meme-list-item .panel-body .meme-item", ".frame .meme-list-item .panel-body", ".frame .meme-list-item .panel-footer", ".frame .meme-list-item .panel-footer > a", ".frame .meme-list-item .panel-footer > a button", ".frame .meme-list-item .panel-footer > a button span", ".frame .meme-list-item .panel-footer > a button span", ".frame .meme-list-item .panel-footer > a button", ".frame .meme-list-item .panel-footer > a", null, ".frame .meme-list-item .panel-footer > button:nth-child(2)", ".frame .meme-list-item .panel-footer > button:nth-child(2) span", ".frame .meme-list-item .panel-footer > button:nth-child(2) span", ".frame .meme-list-item .panel-footer > button:nth-child(2)", null, ".frame .meme-list-item .panel-footer > button:nth-child(3)", ".frame .meme-list-item .panel-footer > button:nth-child(3) span:nth-child(1)", ".frame .meme-list-item .panel-footer > button:nth-child(3) span:nth-child(1)", ".frame .meme-list-item .panel-footer > button:nth-child(3) span:nth-child(2)", ".frame .meme-list-item .panel-footer > button:nth-child(3) span:nth-child(2)", ".frame .meme-list-item .panel-footer > button:nth-child(3)", ".frame .meme-list-item .panel-footer > .label", ".frame .meme-list-item .panel-footer > .label", ".frame .meme-list-item .panel-footer", ".frame .meme-list-item"]),
      ownedByAnother: Ember['default'].A([".frame .meme-list-item", ".frame .meme-list-item .panel-body", ".frame .meme-list-item .panel-body .meme-item", ".frame .meme-list-item .panel-body", ".frame .meme-list-item .panel-footer", null, ".frame .meme-list-item .panel-footer > button", ".frame .meme-list-item .panel-footer > button span:nth-child(1)", ".frame .meme-list-item .panel-footer > button span:nth-child(1)", ".frame .meme-list-item .panel-footer > button span:nth-child(2)", ".frame .meme-list-item .panel-footer > button span:nth-child(2)", ".frame .meme-list-item .panel-footer > button", ".frame .meme-list-item .panel-footer > .label", ".frame .meme-list-item .panel-footer > .label", ".frame .meme-list-item .panel-footer", ".frame .meme-list-item"])
    })
  });

});
define('meme-gen-tutorial/controllers/spec/memes-route', ['exports', 'ember', 'meme-gen-tutorial/mixins/spec-controller'], function (exports, Ember, SpecControllerMixin) {

  'use strict';

  exports['default'] = Ember['default'].Controller.extend(SpecControllerMixin['default'], {
    highlightData: Ember['default'].Object.create({
      memes: Ember['default'].A([".frame .memes-container", ".frame .memes-container .memes-filters", ".frame .memes-container .memes-filters .form-group:nth-child(1)", ".frame .memes-container .memes-filters .form-group:nth-child(1) a", ".frame .memes-container .memes-filters .form-group:nth-child(1) a button", ".frame .memes-container .memes-filters .form-group:nth-child(1) a button span", ".frame .memes-container .memes-filters .form-group:nth-child(1) a button span", ".frame .memes-container .memes-filters .form-group:nth-child(1) a button", ".frame .memes-container .memes-filters .form-group:nth-child(1) a", ".frame .memes-container .memes-filters .form-group:nth-child(1)", ".frame .memes-container .memes-filters .form-group:nth-child(2)", ".frame .memes-container .memes-filters .form-group:nth-child(2) input", ".frame .memes-container .memes-filters .form-group:nth-child(2)", ".frame .memes-container .memes-filters .users", ".frame .memes-container .memes-filters .users .panel.panel-default", ".frame .memes-container .memes-filters .users .panel .panel-heading", ".frame .memes-container .memes-filters .users .panel .panel-heading", ".frame .memes-container .memes-filters .users .panel .panel-body", ".frame .memes-container .memes-filters .users .panel .panel-body", ".frame .memes-container .memes-filters .users .panel .panel-body", ".frame .memes-container .memes-filters .users .panel.panel-default", ".frame .memes-container .memes-filters .users", ".frame .memes-container .memes-filters", ".frame .memes-container .memes-list", ".frame .memes-container .memes-list", ".frame .memes-container .memes-list", ".frame .memes-container"])
    })
  });

});
define('meme-gen-tutorial/controllers/spec/user-filter-toggler', ['exports', 'ember', 'meme-gen-tutorial/mixins/spec-controller'], function (exports, Ember, SpecControllerMixin) {

  'use strict';

  exports['default'] = Ember['default'].Controller.extend(SpecControllerMixin['default'], {
    highlightData: Ember['default'].Object.create({
      userFilterToggler: Ember['default'].A([null, ".frame .label", ".frame .label"])
    })
  });

});
define('meme-gen-tutorial/initializers/app-version', ['exports', 'meme-gen-tutorial/config/environment', 'ember'], function (exports, config, Ember) {

  'use strict';

  var classify = Ember['default'].String.classify;

  exports['default'] = {
    name: "App Version",
    initialize: function (container, application) {
      var appName = classify(application.toString());
      Ember['default'].libraries.register(appName, config['default'].APP.version);
    }
  };

});
define('meme-gen-tutorial/initializers/current-user', ['exports', 'ember', 'meme-gen-tutorial/config/environment'], function (exports, Ember, config) {

  'use strict';

  exports.initialize = initialize;

  function initialize(container, application) {
    var store = container.lookup("store:main");
    application.register("user:whoami-proxy", Ember['default'].Object.create({
      id: config['default'].whoami,
      name: config['default'].whoami.capitalize()
    }), {
      instantiate: false,
      singleton: true
    });
    application.inject("model", "whoami", "user:whoami-proxy");
    try {
      if (store.modelFor("user")) {
        application.deferReadiness();
        store.find("user", config['default'].whoami).then(function (user) {
          application.register("user:whoami", user, {
            instantiate: false,
            singleton: true
          });
          application.inject("route", "whoami", "user:whoami");
          application.inject("controller", "whoami", "user:whoami");
          application.advanceReadiness();
        });
      }
    } catch (e) {
      application.inject("route", "whoami", "user:whoami-proxy");
      application.inject("controller", "whoami", "user:whoami-proxy");
    }
  }

  exports['default'] = {
    name: "current-user",
    after: "store",
    initialize: initialize
  };

});
define('meme-gen-tutorial/initializers/export-application-global', ['exports', 'ember', 'meme-gen-tutorial/config/environment'], function (exports, Ember, config) {

  'use strict';

  exports.initialize = initialize;

  function initialize(container, application) {
    var classifiedName = Ember['default'].String.classify(config['default'].modulePrefix);

    if (config['default'].exportApplicationGlobal && !window[classifiedName]) {
      window[classifiedName] = application;
    }
  };

  exports['default'] = {
    name: "export-application-global",

    initialize: initialize
  };

});
define('meme-gen-tutorial/initializers/meme-route-fixer', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports.initialize = initialize;

  function initialize() {
    var MemeRoute;
    try {
      MemeRoute = window.requireModule("meme-gen-test/routes/meme");
    } catch (e) {}

    if (MemeRoute && MemeRoute["default"]) {
      MemeRoute = MemeRoute["default"];
    } else {
      MemeRoute = Ember['default'].Route.extend();
      window.define("meme-gen-test/routes/meme", ["exports"], function (__exports__) {
        "use strict";
        __exports__["default"] = MemeRoute;
      });
    }
    MemeRoute.reopen({
      actions: {
        error: function (error, transition) {
          var memeId = Ember['default'].get(transition, "params.meme.meme_id"),
              record;
          if (memeId) {
            record = this.store.recordForId("meme", memeId);
            try {
              if (record && record.get("isEmpty")) {
                this.store.unloadRecord(record);
              }
            } catch (e) {}
            return this.replaceWith("memes");
          }
        }
      }
    });
  }

  exports['default'] = {
    name: "meme-route-fixer",
    initialize: initialize
  };
  /* container, application */

});
define('meme-gen-tutorial/mixins/spec-controller', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Mixin.create({
    actions: {
      gotoRoute: function (routename) {
        this.transitionToRoute(routename);
      }
    }
  });

});
define('meme-gen-tutorial/models/meme', ['exports', 'ember-data', 'ember', 'meme-gen-tutorial/config/environment'], function (exports, DS, Ember, env) {

  'use strict';

  exports['default'] = DS['default'].Model.extend({
    imgSrc: DS['default'].attr("string", {
      defaultValue: env['default'].defaultMemeImageSrc
    }),
    opener: DS['default'].attr("string", {
      defaultValue: "Opener"
    }),
    closer: DS['default'].attr("string", {
      defaultValue: "Closer"
    }),
    openerFontSize: DS['default'].attr("number", {
      defaultValue: 60
    }),
    closerFontSize: DS['default'].attr("number", {
      defaultValue: 60
    }),
    user: DS['default'].belongsTo("user"),
    likedBy: DS['default'].hasMany("user"),
    likes: Ember['default'].computed.oneWay("likedBy.length"),
    isMine: (function () {
      return this.get("user.id") === this.get("whoami.id");
    }).property("user.id", "whoami.id"),
    likedByMe: (function () {
      return this.get("likedBy").mapBy("id").contains(this.get("whoami.id"));
    }).property("likedBy.@each")
  });

});
define('meme-gen-tutorial/models/user', ['exports', 'ember-data'], function (exports, DS) {

  'use strict';

  exports['default'] = DS['default'].Model.extend({
    name: DS['default'].attr(),
    memes: DS['default'].hasMany("meme", {
      inverse: "user"
    })
  });

});
define('meme-gen-tutorial/router', ['exports', 'ember', 'meme-gen-tutorial/config/environment'], function (exports, Ember, config) {

  'use strict';

  var Router = Ember['default'].Router.extend({
    location: config['default'].locationType
  });

  Router.map(function () {
    this.resource("memes", function () {
      this.resource("meme", {
        path: "/:meme_id"
      }, function () {
        this.route("edit");
      });
      this.route("create");
    });
    this.route("spec", function () {
      this.route("memes-route");
      this.route("meme-list-item");
      this.route("meme-item");
      this.route("edit-route");
      this.route("create-route");
      this.route("user-filter-toggler");
    });
  });

  exports['default'] = Router;

});
define('meme-gen-tutorial/routes/index', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend({
    redirect: function () {
      this.transitionTo("memes");
    }
  });

});
define('meme-gen-tutorial/routes/meme/edit', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend({
    actions: {
      willTransition: function () {
        this.controller.get("model").rollback();
      }
    },
    renderTemplate: function () {
      this.render("meme-with-controls");
    }
  });

});
define('meme-gen-tutorial/routes/memes', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend({
    model: function () {
      return Ember['default'].RSVP.hash({
        memes: this.store.find("meme"),
        users: this.store.find("user")
      });
    },
    actions: {
      saveMeme: function (meme) {
        meme.save().then((function () {
          this.transitionTo("memes.index");
        }).bind(this));
      },
      deleteMeme: function (meme) {
        return meme.destroyRecord();
      }
    }
  });

});
define('meme-gen-tutorial/routes/memes/create', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend({
    model: function () {
      return this.store.createRecord("meme", {
        user: this.get("whoami")
      });
    },
    actions: {
      willTransition: function () {
        this.controller.get("model").rollback();
      }
    },
    renderTemplate: function () {
      this.render("meme-with-controls");
    }
  });

});
define('meme-gen-tutorial/routes/spec', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].Route.extend({});

});
define('meme-gen-tutorial/routes/spec/create-route', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].Route.extend({});

});
define('meme-gen-tutorial/routes/spec/edit-route', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].Route.extend({});

});
define('meme-gen-tutorial/routes/spec/index', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].Route.extend({});

});
define('meme-gen-tutorial/routes/spec/meme-item', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].Route.extend({});

});
define('meme-gen-tutorial/routes/spec/meme-list-item', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].Route.extend({});

});
define('meme-gen-tutorial/routes/spec/memes-route', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].Route.extend({});

});
define('meme-gen-tutorial/routes/spec/user-filter-toggler', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].Route.extend({});

});
define('meme-gen-tutorial/serializers/application', ['exports', 'ember-data'], function (exports, DS) {

	'use strict';

	exports['default'] = DS['default'].FirebaseSerializer.extend({});

});
define('meme-gen-tutorial/snippets', ['exports'], function (exports) {

  'use strict';

  exports['default'] = { "create.html": "<div class=\"panel panel-default meme-panel\">\n\t<div class=\"panel-heading\">\n\t\t<span>Create Meme</span>\n\t</div>\n\t<div class=\"panel-body flex\">\n\t\t<div class=\"panel panel-default meme-controls\">\n\t\t\t<div class=\"panel-body\">\n\t\t\t\t<div class=\"form-group\">\n\t\t\t\t\t<label>Image URL</label>\n\t\t\t\t\t<!-- {{input placeholder=\"Image URL\" classNames=\"form-control\" value=model.imgSrc}} -->\n\t\t\t\t</div>\n\t\t\t\t<div class=\"form-group\">\n\t\t\t\t\t<label>Opener Font Size</label>\n\t\t\t\t\t<!-- {{input type=\"range\" classNames=\"form-control\" value=model.openerFontSize}} -->\n\t\t\t\t</div>\n\t\t\t\t<div class=\"form-group\">\n\t\t\t\t\t<label>Closer Font Size</label>\n\t\t\t\t\t<!-- {{input type=\"range\" classNames=\"form-control\" value=model.closerFontSize}} -->\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</div>\n\t\t<!-- {{meme-item editable=true content=model}} -->\n\t</div>\n\t<div class=\"panel-footer align-right\">\n\t\t<!-- onclick: save new meme -->\n\t\t<button type=\"button\" class=\"btn btn-success\">\n\t\t\tCreate\n\t\t</button>\n\t\t<a class=\"ember-view\" href=\"link-to:/memes\">\n\t\t\t<button type=\"button\" class=\"btn btn-default\">\n\t\t\t\tCancel\n\t\t\t</button>\n\t\t</a>\n\t</div>\n</div>",
    "edit.html": "<div class=\"panel panel-default meme-panel\">\n\t<div class=\"panel-heading\">\n\t\t<span>Edit Meme</span>\n\t</div>\n\t<div class=\"panel-body flex\">\n\t\t<div class=\"panel panel-default meme-controls\">\n\t\t\t<div class=\"panel-body\">\n\t\t\t\t<div class=\"form-group\">\n\t\t\t\t\t<label>Image URL</label>\n\t\t\t\t\t<!-- {{input placeholder=\"Image URL\" classNames=\"form-control\" value=model.imgSrc}} -->\n\t\t\t\t</div>\n\t\t\t\t<div class=\"form-group\">\n\t\t\t\t\t<label>Opener Font Size</label>\n\t\t\t\t\t<!-- {{input type=\"range\" classNames=\"form-control\" value=model.openerFontSize}} -->\n\t\t\t\t</div>\n\t\t\t\t<div class=\"form-group\">\n\t\t\t\t\t<label>Closer Font Size</label>\n\t\t\t\t\t<!-- {{input type=\"range\" classNames=\"form-control\" value=model.closerFontSize}} -->\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</div>\n\t\t<!-- {{meme-item editable=true content=model}} -->\n\t</div>\n\t<div class=\"panel-footer align-right\">\n\t\t<!-- onclick: save meme -->\n\t\t<button type=\"button\" class=\"btn btn-success\">\n\t\t\tSave\n\t\t</button>\n\t\t<a class=\"ember-view\" href=\"link-to:/memes\">\n\t\t\t<button type=\"button\" class=\"btn btn-default\">\n\t\t\t\tCancel\n\t\t\t</button>\n\t\t</a>\n\t</div>\n</div>",
    "meme-item-editable.html": "<div class=\"meme-item\" style=\"background-image: url(meme.imgSrc)\">\n\t<div class=\"opener\" style=\"font-size: {{openerStyle}};\">\n\t\t<!-- {{text-editor editable=true text=content.opener}} -->\n\t</div>\n\t<div class=\"closer\" style=\"font-size: {{closerStyle}};\">\n\t\t<!-- {{text-editor editable=true text=content.closer}} -->\n\t</div>\n</div>",
    "meme-item.html": "<div class=\"meme-item not-editable\" style=\"background-image: url(meme.imgSrc)\">\n\t<div class=\"opener\" style=\"font-size: {{openerStyle}};\">\n\t\t<!-- {{text-editor editable=false text=content.opener}} -->\n\t</div>\n\t<div class=\"closer\" style=\"font-size: {{closerStyle}};\">\n\t\t<!-- {{text-editor editable=false text=content.closer}} -->\n\t</div>\n</div>",
    "meme-list-item-liked.html": "<div class=\"meme-list-item panel panel-default\">\n\t<div class=\"panel-body\">\n\t\t<!-- {{meme-item content=content editable=false}} -->\n\t</div>\n\t<div class=\"panel-footer\">\n\t\t<a href=\"link-to:/memes/:meme_id/edit\">\n\t\t\t<button type=\"button\" class=\"btn\" aria-label=\"Left Align\">\n\t\t\t\t<span class=\"glyphicon glyphicon-pencil\" aria-hidden=\"true\"></span>\n\t\t\t</button>\n\t\t</a>\n\n\t\t<!-- onclick : delete meme -->\n\t\t<button type=\"button\" class=\"btn\" aria-label=\"Left Align\" >\n\t\t\t<span class=\"glyphicon glyphicon-trash\" aria-hidden=\"true\"></span>\n\t\t</button>\n\n\t\t<!-- onclick : toggle like -->\n\t\t<button type=\"button\" class=\"btn liked\" aria-label=\"Left Align\">\n\t\t\t<span class=\"glyphicon glyphicon-heart\" aria-hidden=\"true\"></span>\n\t\t\t<span class=\"badge\">\n\t\t\t\t{{content.likedBy.length}}\n\t\t\t</span>\n\t\t</button>\n\t\t<span class=\"label label-info\">Created by {{content.user.name}}</span>\n\t</div>\n</div>",
    "meme-list-item-of-another.html": "<div class=\"meme-list-item panel panel-default\">\n\t<div class=\"panel-body\">\n\t\t<!-- {{meme-item content=content editable=false}} -->\n\t</div>\n\t<div class=\"panel-footer\">\n\n\t\t<!-- onclick : toggle like -->\n\t\t<button type=\"button\" class=\"btn\" aria-label=\"Left Align\">\n\t\t\t<span class=\"glyphicon glyphicon-heart\" aria-hidden=\"true\"></span>\n\t\t\t<span class=\"badge\">\n\t\t\t\t{{content.likedBy.length}}\n\t\t\t</span>\n\t\t</button>\n\n\t\t<span class=\"label label-info\">Created by {{content.user.name}}</span>\n\n\t</div>\n</div>",
    "meme-list-item.html": "<div class=\"meme-list-item panel panel-default\">\n\t<div class=\"panel-body\">\n\t\t<!-- {{meme-item content=content editable=false}} -->\n\t</div>\n\t<div class=\"panel-footer\">\n\n\t\t<a href=\"link-to:/memes/:meme_id/edit\">\n\t\t\t<button type=\"button\" class=\"btn\" aria-label=\"Left Align\">\n\t\t\t\t<span class=\"glyphicon glyphicon-pencil\" aria-hidden=\"true\"></span>\n\t\t\t</button>\n\t\t</a>\n\n\t\t<!-- onclick : delete meme -->\n\t\t<button type=\"button\" class=\"btn\" aria-label=\"Left Align\" >\n\t\t\t<span class=\"glyphicon glyphicon-trash\" aria-hidden=\"true\"></span>\n\t\t</button>\n\n\t\t<!-- onclick : toggle like -->\n\t\t<button type=\"button\" class=\"btn\" aria-label=\"Left Align\">\n\t\t\t<span class=\"glyphicon glyphicon-heart\" aria-hidden=\"true\"></span>\n\t\t\t<span class=\"badge\">\n\t\t\t\t{{content.likedBy.length}}\n\t\t\t</span>\n\t\t</button>\n\n\t\t<span class=\"label label-info\">Created by {{content.user.name}}</span>\n\n\t</div>\n</div>",
    "memes.html": "<div class=\"memes-container\">\n\t<div class=\"memes-filters\">\n\t\t<div class=\"form-group\">\n\t\t\t<a href=\"link-to:/memes/create\">\n\t\t\t\t<button type=\"button\" class=\"btn btn-default full-width\" aria-label=\"Left Align\">\n\t\t\t\t\t<span class=\"glyphicon glyphicon-plus\" aria-hidden=\"true\"></span>\n\t\t\t\t\tCreate a Meme\n\t\t\t\t</button>\n\t\t\t</a>\n\t\t</div>\n\t\t<div class=\"form-group\">\n\t\t\t<input class=\"form-control\" placeholder=\"Filter by meme text\" type=\"text\">\n\t\t</div>\n\t\t<div class=\"users\">\n\t\t\t<div class=\"panel panel-default\">\n\t\t\t\t<div class=\"panel-heading\">\n\t\t\t\t\tFilter by Users\n\t\t\t\t</div>\n\t\t\t\t<div class=\"panel-body\">\n\t\t\t\t\t<!-- \n\t\t\t\t\t{{#each user in model.users}}\n\t\t\t\t\t\t{{user-filter-toggler content=user}}\n\t\t\t\t\t{{/each}}\n\t\t\t\t\t-->\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</div>\n\t</div>\n\t<div class=\"memes-list\">\n\t\t<!--\n\t\t{{#each meme in filteredContent}}\n\t\t\t{{meme-list-item content=meme}}\n\t\t{{/each}}\n\t\t-->\n\t</div>\n</div>",
    "user-filter-toggler-selected.html": "<!-- onclick: toggle selection -->\n<div class=\"label label-success\">\n\tUsername\n</div>",
    "user-filter-toggler.html": "<!-- onclick: toggle selection -->\n<div class=\"label label-primary\">\n\tUsername\n</div>" };

});
define('meme-gen-tutorial/templates/application', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        isHTMLBars: true,
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createTextNode("Memes");
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          return fragment;
        }
      };
    }());
    var child1 = (function() {
      return {
        isHTMLBars: true,
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createTextNode("Spec");
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("nav");
        dom.setAttribute(el1,"class","navbar navbar-default");
        var el2 = dom.createTextNode("\n	");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","container-fluid");
        var el3 = dom.createTextNode("\n		");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","navbar-header");
        var el4 = dom.createTextNode("\n			");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("a");
        dom.setAttribute(el4,"class","navbar-brand");
        var el5 = dom.createTextNode("Meme Generator");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n		");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n		");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","collapse navbar-collapse");
        dom.setAttribute(el3,"id","bs-example-navbar-collapse-1");
        var el4 = dom.createTextNode("\n			");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("ul");
        dom.setAttribute(el4,"class","nav navbar-nav");
        var el5 = dom.createTextNode("\n				");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("li");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n				");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("li");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n			");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n		");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, block = hooks.block, content = hooks.content;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        if (this.cachedFragment) { dom.repairClonedNode(fragment,[2]); }
        var element0 = dom.childAt(fragment, [0, 1, 3, 1]);
        var morph0 = dom.createMorphAt(dom.childAt(element0, [1]),-1,-1);
        var morph1 = dom.createMorphAt(dom.childAt(element0, [3]),-1,-1);
        var morph2 = dom.createMorphAt(fragment,1,2,contextualElement);
        block(env, morph0, context, "link-to", ["memes"], {}, child0, null);
        block(env, morph1, context, "link-to", ["spec"], {}, child1, null);
        content(env, morph2, context, "outlet");
        return fragment;
      }
    };
  }()));

});
define('meme-gen-tutorial/templates/components/code-snippet', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createTextNode("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, content = hooks.content;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        if (this.cachedFragment) { dom.repairClonedNode(fragment,[0]); }
        var morph0 = dom.createMorphAt(fragment,0,1,contextualElement);
        content(env, morph0, context, "source");
        return fragment;
      }
    };
  }()));

});
define('meme-gen-tutorial/templates/components/element-highlighter', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createTextNode("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, content = hooks.content;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        if (this.cachedFragment) { dom.repairClonedNode(fragment,[0]); }
        var morph0 = dom.createMorphAt(fragment,0,1,contextualElement);
        content(env, morph0, context, "yield");
        return fragment;
      }
    };
  }()));

});
define('meme-gen-tutorial/templates/components/meme-item', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","opener");
        var el2 = dom.createTextNode("\n	");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","closer");
        var el2 = dom.createTextNode("\n	");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, get = hooks.get, attribute = hooks.attribute, inline = hooks.inline;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var element0 = dom.childAt(fragment, [0]);
        var element1 = dom.childAt(fragment, [2]);
        var morph0 = dom.createMorphAt(element0,0,1);
        var attrMorph0 = dom.createAttrMorph(element0, 'style');
        var morph1 = dom.createMorphAt(element1,0,1);
        var attrMorph1 = dom.createAttrMorph(element1, 'style');
        attribute(env, attrMorph0, element0, "style", get(env, context, "openerStyle"));
        inline(env, morph0, context, "text-editor", [], {"text": get(env, context, "content.opener"), "editable": get(env, context, "editable")});
        attribute(env, attrMorph1, element1, "style", get(env, context, "closerStyle"));
        inline(env, morph1, context, "text-editor", [], {"text": get(env, context, "content.closer"), "editable": get(env, context, "editable")});
        return fragment;
      }
    };
  }()));

});
define('meme-gen-tutorial/templates/components/meme-list-item', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      var child0 = (function() {
        return {
          isHTMLBars: true,
          blockParams: 0,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("	");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("button");
            dom.setAttribute(el1,"type","button");
            dom.setAttribute(el1,"class","btn");
            dom.setAttribute(el1,"aria-label","Left Align");
            var el2 = dom.createTextNode("\n	");
            dom.appendChild(el1, el2);
            var el2 = dom.createElement("span");
            dom.setAttribute(el2,"class","glyphicon glyphicon-pencil");
            dom.setAttribute(el2,"aria-hidden","true");
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n	");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          render: function render(context, env, contextualElement) {
            var dom = env.dom;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (env.useFragmentCache && dom.canClone) {
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
            } else {
              fragment = this.build(dom);
            }
            return fragment;
          }
        };
      }());
      return {
        isHTMLBars: true,
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("	");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("button");
          dom.setAttribute(el1,"type","button");
          dom.setAttribute(el1,"class","btn");
          dom.setAttribute(el1,"aria-label","Left Align");
          var el2 = dom.createTextNode("\n	");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("span");
          dom.setAttribute(el2,"class","glyphicon glyphicon-trash");
          dom.setAttribute(el2,"aria-hidden","true");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n	");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, get = hooks.get, block = hooks.block, element = hooks.element;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          if (this.cachedFragment) { dom.repairClonedNode(fragment,[0]); }
          var element0 = dom.childAt(fragment, [2]);
          var morph0 = dom.createMorphAt(fragment,0,1,contextualElement);
          block(env, morph0, context, "link-to", ["meme.edit", get(env, context, "content")], {}, child0, null);
          element(env, element0, context, "action", ["deleteMeme", get(env, context, "content")], {});
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","panel-body");
        var el2 = dom.createTextNode("\n	");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","panel-footer");
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("	");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("button");
        dom.setAttribute(el2,"type","button");
        dom.setAttribute(el2,"aria-label","Left Align");
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("span");
        dom.setAttribute(el3,"class","glyphicon glyphicon-heart");
        dom.setAttribute(el3,"aria-hidden","true");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("span");
        dom.setAttribute(el3,"class","badge");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n	");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("span");
        dom.setAttribute(el2,"class","label label-info");
        var el3 = dom.createTextNode("Created by ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, get = hooks.get, inline = hooks.inline, block = hooks.block, attribute = hooks.attribute, element = hooks.element, content = hooks.content;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var element1 = dom.childAt(fragment, [2]);
        var element2 = dom.childAt(element1, [2]);
        var morph0 = dom.createMorphAt(dom.childAt(fragment, [0]),0,1);
        var morph1 = dom.createMorphAt(element1,0,1);
        var attrMorph0 = dom.createAttrMorph(element2, 'class');
        var morph2 = dom.createMorphAt(dom.childAt(element2, [3]),-1,-1);
        var morph3 = dom.createMorphAt(dom.childAt(element1, [4]),0,-1);
        inline(env, morph0, context, "meme-item", [], {"content": get(env, context, "content")});
        block(env, morph1, context, "if", [get(env, context, "content.isMine")], {}, child0, null);
        attribute(env, attrMorph0, element2, "class", get(env, context, "likeButtonClassName"));
        element(env, element2, context, "action", ["toggleLike", get(env, context, "content")], {});
        content(env, morph2, context, "content.likes");
        content(env, morph3, context, "content.user.name");
        return fragment;
      }
    };
  }()));

});
define('meme-gen-tutorial/templates/components/text-editor', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        isHTMLBars: true,
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createElement("div");
          dom.setAttribute(el0,"class","document-section");
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, content = hooks.content;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var morph0 = dom.createMorphAt(fragment,-1,-1);
          content(env, morph0, context, "this");
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createTextNode("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, get = hooks.get, block = hooks.block;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        if (this.cachedFragment) { dom.repairClonedNode(fragment,[0]); }
        var morph0 = dom.createMorphAt(fragment,0,1,contextualElement);
        block(env, morph0, context, "each", [get(env, context, "paragraphs")], {}, child0, null);
        return fragment;
      }
    };
  }()));

});
define('meme-gen-tutorial/templates/components/user-filter-toggler', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createTextNode("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, content = hooks.content;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        if (this.cachedFragment) { dom.repairClonedNode(fragment,[0]); }
        var morph0 = dom.createMorphAt(fragment,0,1,contextualElement);
        content(env, morph0, context, "content.name");
        return fragment;
      }
    };
  }()));

});
define('meme-gen-tutorial/templates/frames/_create', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createElement("div");
        dom.setAttribute(el0,"class","panel panel-default meme-panel");
        var el1 = dom.createTextNode("\n	");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","panel-heading");
        var el2 = dom.createTextNode("\n		");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("span");
        var el3 = dom.createTextNode("Create Meme");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n	");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n	");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","panel-body flex");
        var el2 = dom.createTextNode("\n		");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","panel panel-default meme-controls");
        var el3 = dom.createTextNode("\n			");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","panel-body");
        var el4 = dom.createTextNode("\n				");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","form-group");
        var el5 = dom.createTextNode("\n					");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("label");
        var el6 = dom.createTextNode("Image URL");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n					");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("input");
        dom.setAttribute(el5,"class","ember-view ember-text-field form-control");
        dom.setAttribute(el5,"placeholder","Image URL");
        dom.setAttribute(el5,"type","text");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n				");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n				");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","form-group");
        var el5 = dom.createTextNode("\n					");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("label");
        var el6 = dom.createTextNode("Opener Font Size");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n					");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("input");
        dom.setAttribute(el5,"class","ember-view ember-text-field form-control");
        dom.setAttribute(el5,"placeholder","Search");
        dom.setAttribute(el5,"type","range");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n				");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n				");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","form-group");
        var el5 = dom.createTextNode("\n					");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("label");
        var el6 = dom.createTextNode("Closer Font Size");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n					");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("input");
        dom.setAttribute(el5,"class","ember-view ember-text-field form-control");
        dom.setAttribute(el5,"placeholder","Search");
        dom.setAttribute(el5,"type","range");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n				");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n			");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n		");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n		");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","ember-view meme-item editable");
        dom.setAttribute(el2,"style","background-image: url(http://lh4.ggpht.com/NgmqkelleJw8GYypJRPyo10HUnMZ7aR8YbkT8ZNXAQC9KLChDT-yGvOy9R4WGEuEUDpjs-ERNYx6kU9PKWDS9OAtAOsp=s0)");
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","opener ui-draggable ui-draggable-handle");
        dom.setAttribute(el3,"style","font-size: 60px; top: 0px;");
        var el4 = dom.createTextNode("\n	");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","ember-view TextEditor");
        dom.setAttribute(el4,"contenteditable","true");
        var el5 = dom.createElement("div");
        dom.setAttribute(el5,"class","document-section");
        var el6 = dom.createTextNode("Opener");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","closer ui-draggable ui-draggable-handle");
        dom.setAttribute(el3,"style","font-size: 60px; bottom: 0px;");
        var el4 = dom.createTextNode("\n	");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","ember-view TextEditor");
        dom.setAttribute(el4,"contenteditable","true");
        var el5 = dom.createElement("div");
        dom.setAttribute(el5,"class","document-section");
        var el6 = dom.createTextNode("Closer");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n	");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n	");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","panel-footer align-right");
        var el2 = dom.createTextNode("\n		");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("button");
        dom.setAttribute(el2,"type","button");
        dom.setAttribute(el2,"class","btn btn-success");
        var el3 = dom.createTextNode("\n			Create\n		");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n		");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("a");
        var el3 = dom.createTextNode("\n			");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("button");
        dom.setAttribute(el3,"type","button");
        dom.setAttribute(el3,"class","btn btn-default");
        var el4 = dom.createTextNode("\n				Cancel\n			");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n		");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n		\n	");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        return fragment;
      }
    };
  }()));

});
define('meme-gen-tutorial/templates/frames/_edit', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createElement("div");
        dom.setAttribute(el0,"class","panel panel-default meme-panel");
        var el1 = dom.createTextNode("\n	");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","panel-heading");
        var el2 = dom.createTextNode("\n		");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("span");
        var el3 = dom.createTextNode("Edit Meme");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n	");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n	");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","panel-body flex");
        var el2 = dom.createTextNode("\n		");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","panel panel-default meme-controls");
        var el3 = dom.createTextNode("\n			");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","panel-body");
        var el4 = dom.createTextNode("\n				");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","form-group");
        var el5 = dom.createTextNode("\n					");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("label");
        var el6 = dom.createTextNode("Image URL");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n					");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("input");
        dom.setAttribute(el5,"class","ember-view ember-text-field form-control");
        dom.setAttribute(el5,"placeholder","Image URL");
        dom.setAttribute(el5,"type","text");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n				");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n				");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","form-group");
        var el5 = dom.createTextNode("\n					");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("label");
        var el6 = dom.createTextNode("Opener Font Size");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n					");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("input");
        dom.setAttribute(el5,"class","ember-view ember-text-field form-control");
        dom.setAttribute(el5,"placeholder","Search");
        dom.setAttribute(el5,"type","range");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n				");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n				");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","form-group");
        var el5 = dom.createTextNode("\n					");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("label");
        var el6 = dom.createTextNode("Closer Font Size");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n					");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("input");
        dom.setAttribute(el5,"class","ember-view ember-text-field form-control");
        dom.setAttribute(el5,"placeholder","Search");
        dom.setAttribute(el5,"type","range");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n				");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n			");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n		");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n		");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","ember-view meme-item editable");
        dom.setAttribute(el2,"style","background-image: url(http://lh4.ggpht.com/NgmqkelleJw8GYypJRPyo10HUnMZ7aR8YbkT8ZNXAQC9KLChDT-yGvOy9R4WGEuEUDpjs-ERNYx6kU9PKWDS9OAtAOsp=s0)");
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","opener ui-draggable ui-draggable-handle");
        dom.setAttribute(el3,"style","font-size: 60px; top: 0px;");
        var el4 = dom.createTextNode("\n	");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","ember-view TextEditor");
        dom.setAttribute(el4,"contenteditable","true");
        var el5 = dom.createElement("div");
        dom.setAttribute(el5,"class","document-section");
        var el6 = dom.createTextNode("Opener");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","closer ui-draggable ui-draggable-handle");
        dom.setAttribute(el3,"style","font-size: 60px; bottom: 0px;");
        var el4 = dom.createTextNode("\n	");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","ember-view TextEditor");
        dom.setAttribute(el4,"contenteditable","true");
        var el5 = dom.createElement("div");
        dom.setAttribute(el5,"class","document-section");
        var el6 = dom.createTextNode("Closer");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n	");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n	");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","panel-footer align-right");
        var el2 = dom.createTextNode("\n		");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("button");
        dom.setAttribute(el2,"type","button");
        dom.setAttribute(el2,"class","btn btn-success");
        var el3 = dom.createTextNode("\n			Save\n		");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n		");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("a");
        var el3 = dom.createTextNode("\n			");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("button");
        dom.setAttribute(el3,"type","button");
        dom.setAttribute(el3,"class","btn btn-default");
        var el4 = dom.createTextNode("\n				Cancel\n			");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n		");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n		\n	");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        return fragment;
      }
    };
  }()));

});
define('meme-gen-tutorial/templates/frames/_meme-item-editable', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createElement("div");
        dom.setAttribute(el0,"class","meme-item");
        dom.setAttribute(el0,"style","background-image: url(http://lh4.ggpht.com/NgmqkelleJw8GYypJRPyo10HUnMZ7aR8YbkT8ZNXAQC9KLChDT-yGvOy9R4WGEuEUDpjs-ERNYx6kU9PKWDS9OAtAOsp=s0)");
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","opener");
        dom.setAttribute(el1,"style","font-size: 55px; top: 0px;");
        var el2 = dom.createTextNode("\n	");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","TextEditor");
        dom.setAttribute(el2,"contenteditable","true");
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","document-section");
        var el4 = dom.createTextNode("Opener");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","closer");
        dom.setAttribute(el1,"style","font-size: 60px; bottom: 0px;");
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","TextEditor");
        dom.setAttribute(el2,"contenteditable","true");
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","document-section");
        var el4 = dom.createTextNode("Closer");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        return fragment;
      }
    };
  }()));

});
define('meme-gen-tutorial/templates/frames/_meme-item', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createElement("div");
        dom.setAttribute(el0,"class","meme-item not-editable");
        dom.setAttribute(el0,"style","background-image: url(http://lh4.ggpht.com/NgmqkelleJw8GYypJRPyo10HUnMZ7aR8YbkT8ZNXAQC9KLChDT-yGvOy9R4WGEuEUDpjs-ERNYx6kU9PKWDS9OAtAOsp=s0)");
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","opener");
        dom.setAttribute(el1,"style","font-size: 55px; top: 0px;");
        var el2 = dom.createTextNode("\n	");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","TextEditor");
        dom.setAttribute(el2,"contenteditable","false");
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","document-section");
        var el4 = dom.createTextNode("Opener");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","closer");
        dom.setAttribute(el1,"style","font-size: 60px; bottom: 0px;");
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","TextEditor");
        dom.setAttribute(el2,"contenteditable","false");
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","document-section");
        var el4 = dom.createTextNode("Closer");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        return fragment;
      }
    };
  }()));

});
define('meme-gen-tutorial/templates/frames/_meme-list-item-liked', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createElement("div");
        dom.setAttribute(el0,"class","meme-list-item panel panel-default");
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","panel-body");
        var el2 = dom.createTextNode("\n	");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","meme-item not-editable");
        dom.setAttribute(el2,"style","background-image: url(http://lh4.ggpht.com/NgmqkelleJw8GYypJRPyo10HUnMZ7aR8YbkT8ZNXAQC9KLChDT-yGvOy9R4WGEuEUDpjs-ERNYx6kU9PKWDS9OAtAOsp=s0)");
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","opener");
        dom.setAttribute(el3,"style","font-size: 55px; top: 0px;");
        var el4 = dom.createTextNode("\n	");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","TextEditor");
        dom.setAttribute(el4,"contenteditable","false");
        var el5 = dom.createElement("div");
        dom.setAttribute(el5,"class","document-section");
        var el6 = dom.createTextNode("Opener");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","closer");
        dom.setAttribute(el3,"style","font-size: 60px; bottom: 0px;");
        var el4 = dom.createTextNode("\n	");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","TextEditor");
        dom.setAttribute(el4,"contenteditable","false");
        var el5 = dom.createElement("div");
        dom.setAttribute(el5,"class","document-section");
        var el6 = dom.createTextNode("Closer");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","panel-footer");
        var el2 = dom.createTextNode("\n	\n	");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("a");
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("button");
        dom.setAttribute(el3,"type","button");
        dom.setAttribute(el3,"class","btn");
        dom.setAttribute(el3,"aria-label","Left Align");
        var el4 = dom.createTextNode("\n	");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("span");
        dom.setAttribute(el4,"class","glyphicon glyphicon-pencil");
        dom.setAttribute(el4,"aria-hidden","true");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n	");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n	");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("button");
        dom.setAttribute(el2,"type","button");
        dom.setAttribute(el2,"class","btn");
        dom.setAttribute(el2,"aria-label","Left Align");
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("span");
        dom.setAttribute(el3,"class","glyphicon glyphicon-trash");
        dom.setAttribute(el3,"aria-hidden","true");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n	\n	");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("button");
        dom.setAttribute(el2,"type","button");
        dom.setAttribute(el2,"class","btn liked");
        dom.setAttribute(el2,"aria-label","Left Align");
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("span");
        dom.setAttribute(el3,"class","glyphicon glyphicon-heart");
        dom.setAttribute(el3,"aria-hidden","true");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("span");
        dom.setAttribute(el3,"class","badge");
        var el4 = dom.createTextNode("0");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n	");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("span");
        dom.setAttribute(el2,"class","label label-info");
        var el3 = dom.createTextNode("Created by User");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        return fragment;
      }
    };
  }()));

});
define('meme-gen-tutorial/templates/frames/_meme-list-item-of-another', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createElement("div");
        dom.setAttribute(el0,"class","meme-list-item panel panel-default");
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","panel-body");
        var el2 = dom.createTextNode("\n	");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","meme-item not-editable");
        dom.setAttribute(el2,"style","background-image: url(http://lh4.ggpht.com/NgmqkelleJw8GYypJRPyo10HUnMZ7aR8YbkT8ZNXAQC9KLChDT-yGvOy9R4WGEuEUDpjs-ERNYx6kU9PKWDS9OAtAOsp=s0)");
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","opener");
        dom.setAttribute(el3,"style","font-size: 55px; top: 0px;");
        var el4 = dom.createTextNode("\n	");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","TextEditor");
        dom.setAttribute(el4,"contenteditable","false");
        var el5 = dom.createElement("div");
        dom.setAttribute(el5,"class","document-section");
        var el6 = dom.createTextNode("Opener");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","closer");
        dom.setAttribute(el3,"style","font-size: 60px; bottom: 0px;");
        var el4 = dom.createTextNode("\n	");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","TextEditor");
        dom.setAttribute(el4,"contenteditable","false");
        var el5 = dom.createElement("div");
        dom.setAttribute(el5,"class","document-section");
        var el6 = dom.createTextNode("Closer");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","panel-footer");
        var el2 = dom.createTextNode("\n	");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("button");
        dom.setAttribute(el2,"type","button");
        dom.setAttribute(el2,"class","btn");
        dom.setAttribute(el2,"aria-label","Left Align");
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("span");
        dom.setAttribute(el3,"class","glyphicon glyphicon-heart");
        dom.setAttribute(el3,"aria-hidden","true");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("span");
        dom.setAttribute(el3,"class","badge");
        var el4 = dom.createTextNode("0");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n	");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("span");
        dom.setAttribute(el2,"class","label label-info");
        var el3 = dom.createTextNode("Created by User");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        return fragment;
      }
    };
  }()));

});
define('meme-gen-tutorial/templates/frames/_meme-list-item', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createElement("div");
        dom.setAttribute(el0,"class","meme-list-item panel panel-default");
        var el1 = dom.createTextNode("\n	");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","panel-body");
        var el2 = dom.createTextNode("\n		");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","meme-item not-editable");
        dom.setAttribute(el2,"style","background-image: url(http://lh4.ggpht.com/NgmqkelleJw8GYypJRPyo10HUnMZ7aR8YbkT8ZNXAQC9KLChDT-yGvOy9R4WGEuEUDpjs-ERNYx6kU9PKWDS9OAtAOsp=s0)");
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","opener");
        dom.setAttribute(el3,"style","font-size: 55px; top: 0px;");
        var el4 = dom.createTextNode("\n			");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","TextEditor");
        dom.setAttribute(el4,"contenteditable","false");
        var el5 = dom.createElement("div");
        dom.setAttribute(el5,"class","document-section");
        var el6 = dom.createTextNode("Opener");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n		");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n	");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","closer");
        dom.setAttribute(el3,"style","font-size: 60px; bottom: 0px;");
        var el4 = dom.createTextNode("\n		");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","TextEditor");
        dom.setAttribute(el4,"contenteditable","false");
        var el5 = dom.createElement("div");
        dom.setAttribute(el5,"class","document-section");
        var el6 = dom.createTextNode("Closer");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n	");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","panel-footer");
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("a");
        var el3 = dom.createTextNode("\n");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("button");
        dom.setAttribute(el3,"type","button");
        dom.setAttribute(el3,"class","btn");
        dom.setAttribute(el3,"aria-label","Left Align");
        var el4 = dom.createTextNode("\n");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("span");
        dom.setAttribute(el4,"class","glyphicon glyphicon-pencil");
        dom.setAttribute(el4,"aria-hidden","true");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("button");
        dom.setAttribute(el2,"type","button");
        dom.setAttribute(el2,"class","btn");
        dom.setAttribute(el2,"aria-label","Left Align");
        var el3 = dom.createTextNode("\n");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("span");
        dom.setAttribute(el3,"class","glyphicon glyphicon-trash");
        dom.setAttribute(el3,"aria-hidden","true");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("button");
        dom.setAttribute(el2,"type","button");
        dom.setAttribute(el2,"class","btn");
        dom.setAttribute(el2,"aria-label","Left Align");
        var el3 = dom.createTextNode("\n");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("span");
        dom.setAttribute(el3,"class","glyphicon glyphicon-heart");
        dom.setAttribute(el3,"aria-hidden","true");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("span");
        dom.setAttribute(el3,"class","badge");
        var el4 = dom.createTextNode("0");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("span");
        dom.setAttribute(el2,"class","label label-info");
        var el3 = dom.createTextNode("Created by User");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        return fragment;
      }
    };
  }()));

});
define('meme-gen-tutorial/templates/frames/_memes', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createElement("div");
        dom.setAttribute(el0,"class","memes-container");
        var el1 = dom.createTextNode("\n	");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","memes-filters");
        var el2 = dom.createTextNode("\n		");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","form-group");
        var el3 = dom.createTextNode("\n			");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("a");
        var el4 = dom.createTextNode("\n				");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("button");
        dom.setAttribute(el4,"type","button");
        dom.setAttribute(el4,"class","btn btn-default full-width");
        dom.setAttribute(el4,"aria-label","Left Align");
        var el5 = dom.createTextNode("\n				");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("span");
        dom.setAttribute(el5,"class","glyphicon glyphicon-plus");
        dom.setAttribute(el5,"aria-hidden","true");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n				Create a Meme\n				");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n			");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n		");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n		");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","form-group");
        var el3 = dom.createTextNode("\n			");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("input");
        dom.setAttribute(el3,"class","ember-text-field form-control");
        dom.setAttribute(el3,"placeholder","Filter by meme text");
        dom.setAttribute(el3,"type","text");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n		");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n		");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","users");
        var el3 = dom.createTextNode("\n			");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","panel panel-default");
        var el4 = dom.createTextNode("\n				");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","panel-heading");
        var el5 = dom.createTextNode("\n					Filter by Users\n				");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n				");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","panel-body");
        var el5 = dom.createTextNode("\n					");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5,"class","label label-primary");
        var el6 = dom.createTextNode("Rami\n					");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5,"class","label label-primary");
        var el6 = dom.createTextNode("Amir\n				");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5,"class","label label-primary");
        var el6 = dom.createTextNode("Emmanuel\n			");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5,"class","label label-primary");
        var el6 = dom.createTextNode("Eyal\n		");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5,"class","label label-primary");
        var el6 = dom.createTextNode("Gal\n	");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5,"class","label label-primary");
        var el6 = dom.createTextNode("Gennady\n");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5,"class","label label-primary");
        var el6 = dom.createTextNode("Gilad\n");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5,"class","label label-primary");
        var el6 = dom.createTextNode("Jonathan\n");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5,"class","label label-primary");
        var el6 = dom.createTextNode("Liad\n");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5,"class","label label-primary");
        var el6 = dom.createTextNode("Ronny\n");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5,"class","label label-primary");
        var el6 = dom.createTextNode("Tal\n");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5,"class","label label-primary");
        var el6 = dom.createTextNode("Yoni\n");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","memes-list");
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","meme-list-item panel panel-default");
        var el3 = dom.createTextNode("  ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","panel-body");
        var el4 = dom.createTextNode("\n");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","meme-item not-editable");
        dom.setAttribute(el4,"style","background-image: url(http://lh4.ggpht.com/NgmqkelleJw8GYypJRPyo10HUnMZ7aR8YbkT8ZNXAQC9KLChDT-yGvOy9R4WGEuEUDpjs-ERNYx6kU9PKWDS9OAtAOsp=s0)");
        var el5 = dom.createElement("div");
        dom.setAttribute(el5,"class","opener");
        dom.setAttribute(el5,"style","font-size: 55px; top: 0px;");
        var el6 = dom.createTextNode("\n");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("div");
        dom.setAttribute(el6,"class","TextEditor");
        dom.setAttribute(el6,"contenteditable","false");
        var el7 = dom.createElement("div");
        dom.setAttribute(el7,"class","document-section");
        var el8 = dom.createTextNode("Opener");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5,"class","closer");
        dom.setAttribute(el5,"style","font-size: 60px; bottom: 0px;");
        var el6 = dom.createTextNode("\n");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("div");
        dom.setAttribute(el6,"class","TextEditor");
        dom.setAttribute(el6,"contenteditable","false");
        var el7 = dom.createElement("div");
        dom.setAttribute(el7,"class","document-section");
        var el8 = dom.createTextNode("Closer");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","panel-footer");
        var el4 = dom.createTextNode("\n");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("a");
        var el5 = dom.createTextNode("\n");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("button");
        dom.setAttribute(el5,"type","button");
        dom.setAttribute(el5,"class","btn");
        dom.setAttribute(el5,"aria-label","Left Align");
        var el6 = dom.createTextNode("\n");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("span");
        dom.setAttribute(el6,"class","glyphicon glyphicon-pencil");
        dom.setAttribute(el6,"aria-hidden","true");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("button");
        dom.setAttribute(el4,"type","button");
        dom.setAttribute(el4,"class","btn");
        dom.setAttribute(el4,"aria-label","Left Align");
        dom.setAttribute(el4,"data-ember-action","666");
        var el5 = dom.createTextNode("\n");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("span");
        dom.setAttribute(el5,"class","glyphicon glyphicon-trash");
        dom.setAttribute(el5,"aria-hidden","true");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("button");
        dom.setAttribute(el4,"type","button");
        dom.setAttribute(el4,"class","btn");
        dom.setAttribute(el4,"data-bindattr-638","638");
        dom.setAttribute(el4,"aria-label","Left Align");
        dom.setAttribute(el4,"data-ember-action","639");
        var el5 = dom.createTextNode("\n");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("span");
        dom.setAttribute(el5,"class","glyphicon glyphicon-heart");
        dom.setAttribute(el5,"aria-hidden","true");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("span");
        dom.setAttribute(el5,"class","badge");
        var el6 = dom.createTextNode("0");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("span");
        dom.setAttribute(el4,"class","label label-info");
        var el5 = dom.createTextNode("Created by Rami");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","meme-list-item panel panel-default");
        var el3 = dom.createTextNode("  ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","panel-body");
        var el4 = dom.createTextNode("\n");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","meme-item not-editable");
        dom.setAttribute(el4,"style","background-image: url(http://lh4.ggpht.com/NgmqkelleJw8GYypJRPyo10HUnMZ7aR8YbkT8ZNXAQC9KLChDT-yGvOy9R4WGEuEUDpjs-ERNYx6kU9PKWDS9OAtAOsp=s0)");
        var el5 = dom.createElement("div");
        dom.setAttribute(el5,"class","opener");
        dom.setAttribute(el5,"style","font-size: 55px; top: 0px;");
        var el6 = dom.createTextNode("\n");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("div");
        dom.setAttribute(el6,"class","TextEditor");
        dom.setAttribute(el6,"contenteditable","false");
        var el7 = dom.createElement("div");
        dom.setAttribute(el7,"class","document-section");
        var el8 = dom.createTextNode("Opener");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5,"class","closer");
        dom.setAttribute(el5,"style","font-size: 60px; bottom: 0px;");
        var el6 = dom.createTextNode("\n");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("div");
        dom.setAttribute(el6,"class","TextEditor");
        dom.setAttribute(el6,"contenteditable","false");
        var el7 = dom.createElement("div");
        dom.setAttribute(el7,"class","document-section");
        var el8 = dom.createTextNode("Closer");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","panel-footer");
        var el4 = dom.createTextNode("\n");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("a");
        var el5 = dom.createTextNode("\n");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("button");
        dom.setAttribute(el5,"type","button");
        dom.setAttribute(el5,"class","btn");
        dom.setAttribute(el5,"aria-label","Left Align");
        var el6 = dom.createTextNode("\n");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("span");
        dom.setAttribute(el6,"class","glyphicon glyphicon-pencil");
        dom.setAttribute(el6,"aria-hidden","true");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("button");
        dom.setAttribute(el4,"type","button");
        dom.setAttribute(el4,"class","btn");
        dom.setAttribute(el4,"aria-label","Left Align");
        dom.setAttribute(el4,"data-ember-action","666");
        var el5 = dom.createTextNode("\n");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("span");
        dom.setAttribute(el5,"class","glyphicon glyphicon-trash");
        dom.setAttribute(el5,"aria-hidden","true");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("button");
        dom.setAttribute(el4,"type","button");
        dom.setAttribute(el4,"class","btn");
        dom.setAttribute(el4,"data-bindattr-638","638");
        dom.setAttribute(el4,"aria-label","Left Align");
        dom.setAttribute(el4,"data-ember-action","639");
        var el5 = dom.createTextNode("\n");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("span");
        dom.setAttribute(el5,"class","glyphicon glyphicon-heart");
        dom.setAttribute(el5,"aria-hidden","true");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("span");
        dom.setAttribute(el5,"class","badge");
        var el6 = dom.createTextNode("0");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("span");
        dom.setAttribute(el4,"class","label label-info");
        var el5 = dom.createTextNode("Created by Rami");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        return fragment;
      }
    };
  }()));

});
define('meme-gen-tutorial/templates/frames/_user-filter-toggler-selected', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createElement("div");
        dom.setAttribute(el0,"class","label label-success");
        var el1 = dom.createTextNode("Username");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        return fragment;
      }
    };
  }()));

});
define('meme-gen-tutorial/templates/frames/_user-filter-toggler', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createElement("div");
        dom.setAttribute(el0,"class","label label-primary");
        var el1 = dom.createTextNode("Username");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        return fragment;
      }
    };
  }()));

});
define('meme-gen-tutorial/templates/index', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createTextNode("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, content = hooks.content;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        if (this.cachedFragment) { dom.repairClonedNode(fragment,[0]); }
        var morph0 = dom.createMorphAt(fragment,0,1,contextualElement);
        content(env, morph0, context, "outlet");
        return fragment;
      }
    };
  }()));

});
define('meme-gen-tutorial/templates/meme-list-item', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      var child0 = (function() {
        return {
          isHTMLBars: true,
          blockParams: 0,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("        ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("button");
            dom.setAttribute(el1,"type","button");
            dom.setAttribute(el1,"class","btn");
            dom.setAttribute(el1,"aria-label","Left Align");
            var el2 = dom.createTextNode("\n          ");
            dom.appendChild(el1, el2);
            var el2 = dom.createElement("span");
            dom.setAttribute(el2,"class","glyphicon glyphicon-pencil");
            dom.setAttribute(el2,"aria-hidden","true");
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n        ");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          render: function render(context, env, contextualElement) {
            var dom = env.dom;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (env.useFragmentCache && dom.canClone) {
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
            } else {
              fragment = this.build(dom);
            }
            return fragment;
          }
        };
      }());
      return {
        isHTMLBars: true,
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("      ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("button");
          dom.setAttribute(el1,"type","button");
          dom.setAttribute(el1,"class","btn");
          dom.setAttribute(el1,"aria-label","Left Align");
          var el2 = dom.createTextNode("\n        ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("span");
          dom.setAttribute(el2,"class","glyphicon glyphicon-trash");
          dom.setAttribute(el2,"aria-hidden","true");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n      ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, get = hooks.get, block = hooks.block, element = hooks.element;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          if (this.cachedFragment) { dom.repairClonedNode(fragment,[0]); }
          var element0 = dom.childAt(fragment, [2]);
          var morph0 = dom.createMorphAt(fragment,0,1,contextualElement);
          block(env, morph0, context, "link-to", ["meme.edit", get(env, context, "meme")], {}, child0, null);
          element(env, element0, context, "action", ["deleteMeme", get(env, context, "meme")], {});
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createTextNode("  ");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","panel-body");
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n  ");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","panel-footer");
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("  	");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("button");
        dom.setAttribute(el2,"type","button");
        dom.setAttribute(el2,"aria-label","Left Align");
        var el3 = dom.createTextNode("\n	  ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("span");
        dom.setAttribute(el3,"class","glyphicon glyphicon-heart");
        dom.setAttribute(el3,"aria-hidden","true");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	  ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("span");
        dom.setAttribute(el3,"class","badge");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n	");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("span");
        dom.setAttribute(el2,"class","label label-info");
        var el3 = dom.createTextNode("Created by ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, get = hooks.get, inline = hooks.inline, block = hooks.block, attribute = hooks.attribute, element = hooks.element, content = hooks.content;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var element1 = dom.childAt(fragment, [3]);
        var element2 = dom.childAt(element1, [2]);
        var morph0 = dom.createMorphAt(dom.childAt(fragment, [1]),0,1);
        var morph1 = dom.createMorphAt(element1,0,1);
        var attrMorph0 = dom.createAttrMorph(element2, 'class');
        var morph2 = dom.createMorphAt(dom.childAt(element2, [3]),-1,-1);
        var morph3 = dom.createMorphAt(dom.childAt(element1, [4]),0,-1);
        inline(env, morph0, context, "meme-item", [], {"content": get(env, context, "content")});
        block(env, morph1, context, "if", [get(env, context, "content.isMine")], {}, child0, null);
        attribute(env, attrMorph0, element2, "class", ":btn content.likedByMe:liked");
        element(env, element2, context, "action", ["toggleLike", get(env, context, "content")], {});
        content(env, morph2, context, "content.likes");
        content(env, morph3, context, "content.user.name");
        return fragment;
      }
    };
  }()));

});
define('meme-gen-tutorial/templates/meme-with-controls', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        isHTMLBars: true,
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("			");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("button");
          dom.setAttribute(el1,"type","button");
          dom.setAttribute(el1,"class","btn btn-default");
          var el2 = dom.createTextNode("\n				Cancel\n			");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createElement("div");
        dom.setAttribute(el0,"class","panel panel-default meme-panel");
        var el1 = dom.createTextNode("\n	");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","panel-heading");
        var el2 = dom.createTextNode("\n		");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("span");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n	");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n	");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","panel-body flex");
        var el2 = dom.createTextNode("\n		");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","panel panel-default meme-controls");
        var el3 = dom.createTextNode("\n			");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","panel-body");
        var el4 = dom.createTextNode("\n				");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","form-group");
        var el5 = dom.createTextNode("\n					");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("label");
        var el6 = dom.createTextNode("Image URL");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n					");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n				");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n				");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","form-group");
        var el5 = dom.createTextNode("\n					");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("label");
        var el6 = dom.createTextNode("Opener Font Size");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n					");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n				");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n				");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","form-group");
        var el5 = dom.createTextNode("\n					");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("label");
        var el6 = dom.createTextNode("Closer Font Size");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n					");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n				");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n			");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n		");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n		");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n	");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n	");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","panel-footer align-right");
        var el2 = dom.createTextNode("\n		");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("button");
        dom.setAttribute(el2,"type","button");
        dom.setAttribute(el2,"class","btn btn-success");
        var el3 = dom.createTextNode("\n			");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n		");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("		\n	");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, content = hooks.content, get = hooks.get, inline = hooks.inline, element = hooks.element, block = hooks.block;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var element0 = dom.childAt(fragment, [3]);
        var element1 = dom.childAt(element0, [1, 1]);
        var element2 = dom.childAt(fragment, [5]);
        var element3 = dom.childAt(element2, [1]);
        var morph0 = dom.createMorphAt(dom.childAt(fragment, [1, 1]),-1,-1);
        var morph1 = dom.createMorphAt(dom.childAt(element1, [1]),2,3);
        var morph2 = dom.createMorphAt(dom.childAt(element1, [3]),2,3);
        var morph3 = dom.createMorphAt(dom.childAt(element1, [5]),2,3);
        var morph4 = dom.createMorphAt(element0,2,3);
        var morph5 = dom.createMorphAt(element3,0,1);
        var morph6 = dom.createMorphAt(element2,2,3);
        content(env, morph0, context, "title");
        inline(env, morph1, context, "input", [], {"classNames": "form-control", "placeholder": "Image URL", "value": get(env, context, "model.imgSrc")});
        inline(env, morph2, context, "input", [], {"type": "range", "classNames": "form-control", "value": get(env, context, "model.openerFontSize")});
        inline(env, morph3, context, "input", [], {"type": "range", "classNames": "form-control", "value": get(env, context, "model.closerFontSize")});
        inline(env, morph4, context, "meme-item", [], {"editable": true, "content": get(env, context, "model")});
        element(env, element3, context, "action", ["saveMeme", get(env, context, "model")], {});
        content(env, morph5, context, "actionName");
        block(env, morph6, context, "link-to", ["memes.index"], {}, child0, null);
        return fragment;
      }
    };
  }()));

});
define('meme-gen-tutorial/templates/meme', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createTextNode("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, content = hooks.content;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        if (this.cachedFragment) { dom.repairClonedNode(fragment,[0]); }
        var morph0 = dom.createMorphAt(fragment,0,1,contextualElement);
        content(env, morph0, context, "outlet");
        return fragment;
      }
    };
  }()));

});
define('meme-gen-tutorial/templates/meme/error', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createElement("div");
        dom.setAttribute(el0,"class","panel panel-default meme-panel");
        var el1 = dom.createTextNode("\n	");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","panel-heading");
        var el2 = dom.createTextNode("\n		");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("span");
        var el3 = dom.createTextNode("Error");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n	");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n	");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","panel-body");
        var el2 = dom.createTextNode("\n		Could not find meme\n	");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        return fragment;
      }
    };
  }()));

});
define('meme-gen-tutorial/templates/meme/index', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createTextNode("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, get = hooks.get, inline = hooks.inline;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        if (this.cachedFragment) { dom.repairClonedNode(fragment,[0,1]); }
        var morph0 = dom.createMorphAt(fragment,0,1,contextualElement);
        inline(env, morph0, context, "meme-item", [], {"editable": true, "content": get(env, context, "model")});
        return fragment;
      }
    };
  }()));

});
define('meme-gen-tutorial/templates/memes', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createTextNode("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, content = hooks.content;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        if (this.cachedFragment) { dom.repairClonedNode(fragment,[0]); }
        var morph0 = dom.createMorphAt(fragment,0,1,contextualElement);
        content(env, morph0, context, "outlet");
        return fragment;
      }
    };
  }()));

});
define('meme-gen-tutorial/templates/memes/index', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        isHTMLBars: true,
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("				");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("button");
          dom.setAttribute(el1,"type","button");
          dom.setAttribute(el1,"class","btn btn-default full-width");
          dom.setAttribute(el1,"aria-label","Left Align");
          var el2 = dom.createTextNode("\n				  ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("span");
          dom.setAttribute(el2,"class","glyphicon glyphicon-plus");
          dom.setAttribute(el2,"aria-hidden","true");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n				  Create a Meme\n				");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          return fragment;
        }
      };
    }());
    var child1 = (function() {
      return {
        isHTMLBars: true,
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, get = hooks.get, inline = hooks.inline;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          if (this.cachedFragment) { dom.repairClonedNode(fragment,[0,1]); }
          var morph0 = dom.createMorphAt(fragment,0,1,contextualElement);
          inline(env, morph0, context, "user-filter-toggler", [], {"tagName": "div", "content": get(env, context, "user"), "toggleUser": "toggleUser", "selected": get(env, context, "user.selected")});
          return fragment;
        }
      };
    }());
    var child2 = (function() {
      return {
        isHTMLBars: true,
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("			");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, get = hooks.get, inline = hooks.inline;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var morph0 = dom.createMorphAt(fragment,0,1,contextualElement);
          inline(env, morph0, context, "meme-list-item", [], {"content": get(env, context, "meme"), "toggleLike": "toggleLike", "deleteMeme": "deleteMeme"});
          return fragment;
        }
      };
    }());
    var child3 = (function() {
      return {
        isHTMLBars: true,
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("			");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1,"class","panel panel-default");
          var el2 = dom.createTextNode("\n			  ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("div");
          dom.setAttribute(el2,"class","panel-body center");
          var el3 = dom.createTextNode("\n			    No memes were found\n			  ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n			");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createElement("div");
        dom.setAttribute(el0,"class","memes-container");
        var el1 = dom.createTextNode("\n	");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","memes-filters");
        var el2 = dom.createTextNode("\n		");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","form-group");
        var el3 = dom.createTextNode("\n");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("		");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n		");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","form-group");
        var el3 = dom.createTextNode("\n			");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n		");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n		");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","users");
        var el3 = dom.createTextNode("\n			");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","panel panel-default");
        var el4 = dom.createTextNode("\n				");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","panel-heading");
        var el5 = dom.createTextNode("\n					Filter by Users\n				");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n				");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","panel-body");
        var el5 = dom.createTextNode("\n					");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n				");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n			");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n		");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n	");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n	");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","memes-list");
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("	");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, block = hooks.block, get = hooks.get, inline = hooks.inline;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var element0 = dom.childAt(fragment, [1]);
        var morph0 = dom.createMorphAt(dom.childAt(element0, [1]),0,1);
        var morph1 = dom.createMorphAt(dom.childAt(element0, [3]),0,1);
        var morph2 = dom.createMorphAt(dom.childAt(element0, [5, 1, 3]),0,1);
        var morph3 = dom.createMorphAt(dom.childAt(fragment, [3]),0,1);
        block(env, morph0, context, "link-to", ["memes.create"], {}, child0, null);
        inline(env, morph1, context, "input", [], {"value": get(env, context, "searchTerm"), "classNames": "form-control", "placeholder": "Filter by meme text"});
        block(env, morph2, context, "each", [get(env, context, "users")], {"keyword": "user"}, child1, null);
        block(env, morph3, context, "each", [get(env, context, "filteredMemes")], {"keyword": "meme"}, child2, child3);
        return fragment;
      }
    };
  }()));

});
define('meme-gen-tutorial/templates/spec', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        isHTMLBars: true,
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createTextNode("/memes");
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          return fragment;
        }
      };
    }());
    var child1 = (function() {
      return {
        isHTMLBars: true,
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createTextNode("/memes/create");
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          return fragment;
        }
      };
    }());
    var child2 = (function() {
      return {
        isHTMLBars: true,
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createTextNode("/memes/:meme_id/edit");
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          return fragment;
        }
      };
    }());
    var child3 = (function() {
      return {
        isHTMLBars: true,
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createTextNode("meme-list-item");
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          return fragment;
        }
      };
    }());
    var child4 = (function() {
      return {
        isHTMLBars: true,
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createTextNode("user-filter-toggler");
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          return fragment;
        }
      };
    }());
    var child5 = (function() {
      return {
        isHTMLBars: true,
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createTextNode("meme-item");
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createElement("div");
        dom.setAttribute(el0,"class","panel panel-default");
        var el1 = dom.createTextNode("\n	");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","panel-body");
        var el2 = dom.createTextNode("\n		");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","row");
        var el3 = dom.createTextNode("\n			");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","col-xs-2");
        var el4 = dom.createTextNode("\n				");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("h4");
        var el5 = dom.createTextNode("Routes");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n				");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","list-group");
        var el5 = dom.createTextNode("\n					");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n					");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n					");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n				");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n				");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("h4");
        var el5 = dom.createTextNode("Components");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n				");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","list-group");
        var el5 = dom.createTextNode("\n					");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n					");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n					");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n				");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n			");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n			");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","col-xs-10");
        var el4 = dom.createTextNode("\n				");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n			");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n		");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("	\n	");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, block = hooks.block, content = hooks.content;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var element0 = dom.childAt(fragment, [1, 1]);
        var element1 = dom.childAt(element0, [1]);
        var element2 = dom.childAt(element1, [3]);
        var element3 = dom.childAt(element1, [7]);
        var morph0 = dom.createMorphAt(element2,0,1);
        var morph1 = dom.createMorphAt(element2,1,2);
        var morph2 = dom.createMorphAt(element2,2,3);
        var morph3 = dom.createMorphAt(element3,0,1);
        var morph4 = dom.createMorphAt(element3,1,2);
        var morph5 = dom.createMorphAt(element3,2,3);
        var morph6 = dom.createMorphAt(dom.childAt(element0, [3]),0,1);
        block(env, morph0, context, "link-to", ["spec.memes-route"], {"classNames": "list-group-item"}, child0, null);
        block(env, morph1, context, "link-to", ["spec.create-route"], {"classNames": "list-group-item"}, child1, null);
        block(env, morph2, context, "link-to", ["spec.edit-route"], {"classNames": "list-group-item"}, child2, null);
        block(env, morph3, context, "link-to", ["spec.meme-list-item"], {"classNames": "list-group-item"}, child3, null);
        block(env, morph4, context, "link-to", ["spec.user-filter-toggler"], {"classNames": "list-group-item"}, child4, null);
        block(env, morph5, context, "link-to", ["spec.meme-item"], {"classNames": "list-group-item"}, child5, null);
        content(env, morph6, context, "outlet");
        return fragment;
      }
    };
  }()));

});
define('meme-gen-tutorial/templates/spec/create-route', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        isHTMLBars: true,
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("	");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1,"class","panel panel-default");
          var el2 = dom.createTextNode("\n		");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("div");
          dom.setAttribute(el2,"class","panel-heading");
          var el3 = dom.createElement("h3");
          dom.setAttribute(el3,"class","panel-title");
          var el4 = dom.createTextNode("/memes/create");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n		");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("div");
          dom.setAttribute(el2,"class","panel-body");
          var el3 = dom.createTextNode("\n			");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("div");
          dom.setAttribute(el3,"class","row");
          var el4 = dom.createTextNode("\n				");
          dom.appendChild(el3, el4);
          var el4 = dom.createElement("div");
          dom.setAttribute(el4,"class","col-xs-6 frame");
          dom.setAttribute(el4,"style","zoom:0.5");
          var el5 = dom.createTextNode("\n					");
          dom.appendChild(el4, el5);
          var el5 = dom.createTextNode("\n				");
          dom.appendChild(el4, el5);
          dom.appendChild(el3, el4);
          var el4 = dom.createTextNode("\n				");
          dom.appendChild(el3, el4);
          var el4 = dom.createElement("div");
          dom.setAttribute(el4,"class","col-xs-6");
          var el5 = dom.createTextNode("\n					");
          dom.appendChild(el4, el5);
          var el5 = dom.createTextNode("\n				");
          dom.appendChild(el4, el5);
          dom.appendChild(el3, el4);
          var el4 = dom.createTextNode("\n			");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n		");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n	");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, inline = hooks.inline;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var element0 = dom.childAt(fragment, [1, 3, 1]);
          var morph0 = dom.createMorphAt(dom.childAt(element0, [1]),0,1);
          var morph1 = dom.createMorphAt(dom.childAt(element0, [3]),0,1);
          inline(env, morph0, context, "partial", ["frames/create"], {});
          inline(env, morph1, context, "code-snippet", [], {"name": "create.html", "indent": false, "language": "html"});
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createTextNode("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, get = hooks.get, block = hooks.block;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        if (this.cachedFragment) { dom.repairClonedNode(fragment,[0,1]); }
        var morph0 = dom.createMorphAt(fragment,0,1,contextualElement);
        block(env, morph0, context, "element-highlighter", [], {"data": get(env, context, "highlightData.create")}, child0, null);
        return fragment;
      }
    };
  }()));

});
define('meme-gen-tutorial/templates/spec/edit-route', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        isHTMLBars: true,
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("	");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1,"class","panel panel-default");
          var el2 = dom.createTextNode("\n		");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("div");
          dom.setAttribute(el2,"class","panel-heading");
          var el3 = dom.createElement("h3");
          dom.setAttribute(el3,"class","panel-title");
          var el4 = dom.createTextNode("/memes/:meme_id/edit");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n		");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("div");
          dom.setAttribute(el2,"class","panel-body");
          var el3 = dom.createTextNode("\n			");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("div");
          dom.setAttribute(el3,"class","row");
          var el4 = dom.createTextNode("\n				");
          dom.appendChild(el3, el4);
          var el4 = dom.createElement("div");
          dom.setAttribute(el4,"class","col-xs-6 frame");
          dom.setAttribute(el4,"style","zoom:0.5");
          var el5 = dom.createTextNode("\n					");
          dom.appendChild(el4, el5);
          var el5 = dom.createTextNode("\n				");
          dom.appendChild(el4, el5);
          dom.appendChild(el3, el4);
          var el4 = dom.createTextNode("\n				");
          dom.appendChild(el3, el4);
          var el4 = dom.createElement("div");
          dom.setAttribute(el4,"class","col-xs-6");
          var el5 = dom.createTextNode("\n					");
          dom.appendChild(el4, el5);
          var el5 = dom.createTextNode("\n				");
          dom.appendChild(el4, el5);
          dom.appendChild(el3, el4);
          var el4 = dom.createTextNode("\n			");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n		");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n	");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, inline = hooks.inline;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var element0 = dom.childAt(fragment, [1, 3, 1]);
          var morph0 = dom.createMorphAt(dom.childAt(element0, [1]),0,1);
          var morph1 = dom.createMorphAt(dom.childAt(element0, [3]),0,1);
          inline(env, morph0, context, "partial", ["frames/edit"], {});
          inline(env, morph1, context, "code-snippet", [], {"name": "edit.html", "indent": false, "language": "html"});
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createTextNode("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, get = hooks.get, block = hooks.block;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        if (this.cachedFragment) { dom.repairClonedNode(fragment,[0,1]); }
        var morph0 = dom.createMorphAt(fragment,0,1,contextualElement);
        block(env, morph0, context, "element-highlighter", [], {"data": get(env, context, "highlightData.edit")}, child0, null);
        return fragment;
      }
    };
  }()));

});
define('meme-gen-tutorial/templates/spec/index', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createTextNode("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, content = hooks.content;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        if (this.cachedFragment) { dom.repairClonedNode(fragment,[0]); }
        var morph0 = dom.createMorphAt(fragment,0,1,contextualElement);
        content(env, morph0, context, "outlet");
        return fragment;
      }
    };
  }()));

});
define('meme-gen-tutorial/templates/spec/meme-item', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        isHTMLBars: true,
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("			");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1,"class","panel panel-default");
          var el2 = dom.createTextNode("\n				");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("div");
          dom.setAttribute(el2,"class","panel-heading");
          var el3 = dom.createElement("h3");
          dom.setAttribute(el3,"class","panel-title");
          var el4 = dom.createTextNode("Not Editable");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n				");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("div");
          dom.setAttribute(el2,"class","panel-body");
          var el3 = dom.createTextNode("\n					");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("div");
          dom.setAttribute(el3,"class","row");
          var el4 = dom.createTextNode("\n						");
          dom.appendChild(el3, el4);
          var el4 = dom.createElement("div");
          dom.setAttribute(el4,"class","col-xs-6 frame");
          dom.setAttribute(el4,"style","zoom:0.7;");
          var el5 = dom.createTextNode("\n							");
          dom.appendChild(el4, el5);
          var el5 = dom.createTextNode("\n						");
          dom.appendChild(el4, el5);
          dom.appendChild(el3, el4);
          var el4 = dom.createTextNode("\n						");
          dom.appendChild(el3, el4);
          var el4 = dom.createElement("div");
          dom.setAttribute(el4,"class","col-xs-6");
          var el5 = dom.createTextNode("\n							");
          dom.appendChild(el4, el5);
          var el5 = dom.createTextNode("\n						");
          dom.appendChild(el4, el5);
          dom.appendChild(el3, el4);
          var el4 = dom.createTextNode("\n					");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n				");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n			");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, inline = hooks.inline;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var element1 = dom.childAt(fragment, [1, 3, 1]);
          var morph0 = dom.createMorphAt(dom.childAt(element1, [1]),0,1);
          var morph1 = dom.createMorphAt(dom.childAt(element1, [3]),0,1);
          inline(env, morph0, context, "partial", ["frames/meme-item"], {});
          inline(env, morph1, context, "code-snippet", [], {"name": "meme-item.html", "indent": false, "language": "html"});
          return fragment;
        }
      };
    }());
    var child1 = (function() {
      return {
        isHTMLBars: true,
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("			");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1,"class","panel panel-default");
          var el2 = dom.createTextNode("\n				");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("div");
          dom.setAttribute(el2,"class","panel-heading");
          var el3 = dom.createElement("h3");
          dom.setAttribute(el3,"class","panel-title");
          var el4 = dom.createTextNode("Editable");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n				");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("div");
          dom.setAttribute(el2,"class","panel-body");
          var el3 = dom.createTextNode("\n					");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("div");
          dom.setAttribute(el3,"class","row");
          var el4 = dom.createTextNode("\n						");
          dom.appendChild(el3, el4);
          var el4 = dom.createElement("div");
          dom.setAttribute(el4,"class","col-xs-6 frame");
          dom.setAttribute(el4,"style","zoom:0.7;");
          var el5 = dom.createTextNode("\n							");
          dom.appendChild(el4, el5);
          var el5 = dom.createTextNode("\n						");
          dom.appendChild(el4, el5);
          dom.appendChild(el3, el4);
          var el4 = dom.createTextNode("\n						");
          dom.appendChild(el3, el4);
          var el4 = dom.createElement("div");
          dom.setAttribute(el4,"class","col-xs-6");
          var el5 = dom.createTextNode("\n							");
          dom.appendChild(el4, el5);
          var el5 = dom.createTextNode("\n						");
          dom.appendChild(el4, el5);
          dom.appendChild(el3, el4);
          var el4 = dom.createTextNode("\n					");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n				");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n			");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, inline = hooks.inline;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var element0 = dom.childAt(fragment, [1, 3, 1]);
          var morph0 = dom.createMorphAt(dom.childAt(element0, [1]),0,1);
          var morph1 = dom.createMorphAt(dom.childAt(element0, [3]),0,1);
          inline(env, morph0, context, "partial", ["frames/meme-item-editable"], {});
          inline(env, morph1, context, "code-snippet", [], {"name": "meme-item-editable.html", "indent": false, "language": "html"});
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createElement("div");
        dom.setAttribute(el0,"class","panel panel-default");
        var el1 = dom.createTextNode("\n	");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","panel-heading");
        var el2 = dom.createElement("h3");
        dom.setAttribute(el2,"class","panel-title");
        var el3 = dom.createTextNode("meme-item Component");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n	");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","panel-body");
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("	");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, get = hooks.get, block = hooks.block;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var element2 = dom.childAt(fragment, [3]);
        if (this.cachedFragment) { dom.repairClonedNode(element2,[1]); }
        var morph0 = dom.createMorphAt(element2,0,1);
        var morph1 = dom.createMorphAt(element2,1,2);
        block(env, morph0, context, "element-highlighter", [], {"data": get(env, context, "highlightData.memeItem")}, child0, null);
        block(env, morph1, context, "element-highlighter", [], {"data": get(env, context, "highlightData.memeItem")}, child1, null);
        return fragment;
      }
    };
  }()));

});
define('meme-gen-tutorial/templates/spec/meme-list-item', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        isHTMLBars: true,
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("			");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1,"class","panel panel-default");
          var el2 = dom.createTextNode("\n				");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("div");
          dom.setAttribute(el2,"class","panel-heading");
          var el3 = dom.createElement("h3");
          dom.setAttribute(el3,"class","panel-title");
          var el4 = dom.createTextNode("Does not belong to current user; Not liked by current user");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n				");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("div");
          dom.setAttribute(el2,"class","panel-body");
          var el3 = dom.createTextNode("\n					");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("div");
          dom.setAttribute(el3,"class","row");
          var el4 = dom.createTextNode("\n						");
          dom.appendChild(el3, el4);
          var el4 = dom.createElement("div");
          dom.setAttribute(el4,"class","col-xs-6 frame");
          dom.setAttribute(el4,"style","zoom:0.7;");
          var el5 = dom.createTextNode("\n							");
          dom.appendChild(el4, el5);
          var el5 = dom.createTextNode("\n						");
          dom.appendChild(el4, el5);
          dom.appendChild(el3, el4);
          var el4 = dom.createTextNode("\n						");
          dom.appendChild(el3, el4);
          var el4 = dom.createElement("div");
          dom.setAttribute(el4,"class","col-xs-6");
          var el5 = dom.createTextNode("\n							");
          dom.appendChild(el4, el5);
          var el5 = dom.createTextNode("\n						");
          dom.appendChild(el4, el5);
          dom.appendChild(el3, el4);
          var el4 = dom.createTextNode("\n					");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n				");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n			");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, inline = hooks.inline;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var element2 = dom.childAt(fragment, [1, 3, 1]);
          var morph0 = dom.createMorphAt(dom.childAt(element2, [1]),0,1);
          var morph1 = dom.createMorphAt(dom.childAt(element2, [3]),0,1);
          inline(env, morph0, context, "partial", ["frames/meme-list-item-of-another"], {});
          inline(env, morph1, context, "code-snippet", [], {"name": "meme-list-item-of-another.html", "indent": false, "language": "html"});
          return fragment;
        }
      };
    }());
    var child1 = (function() {
      return {
        isHTMLBars: true,
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("			");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1,"class","panel panel-default");
          var el2 = dom.createTextNode("\n				");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("div");
          dom.setAttribute(el2,"class","panel-heading");
          var el3 = dom.createElement("h3");
          dom.setAttribute(el3,"class","panel-title");
          var el4 = dom.createTextNode("Belongs to current user; Not liked by current user");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n				");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("div");
          dom.setAttribute(el2,"class","panel-body");
          var el3 = dom.createTextNode("\n					");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("div");
          dom.setAttribute(el3,"class","row");
          var el4 = dom.createTextNode("\n						");
          dom.appendChild(el3, el4);
          var el4 = dom.createElement("div");
          dom.setAttribute(el4,"class","col-xs-6 frame");
          dom.setAttribute(el4,"style","zoom:0.7;");
          var el5 = dom.createTextNode("\n							");
          dom.appendChild(el4, el5);
          var el5 = dom.createTextNode("\n						");
          dom.appendChild(el4, el5);
          dom.appendChild(el3, el4);
          var el4 = dom.createTextNode("\n						");
          dom.appendChild(el3, el4);
          var el4 = dom.createElement("div");
          dom.setAttribute(el4,"class","col-xs-6");
          var el5 = dom.createTextNode("\n							");
          dom.appendChild(el4, el5);
          var el5 = dom.createTextNode("\n						");
          dom.appendChild(el4, el5);
          dom.appendChild(el3, el4);
          var el4 = dom.createTextNode("\n					");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n				");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n			");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, inline = hooks.inline;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var element1 = dom.childAt(fragment, [1, 3, 1]);
          var morph0 = dom.createMorphAt(dom.childAt(element1, [1]),0,1);
          var morph1 = dom.createMorphAt(dom.childAt(element1, [3]),0,1);
          inline(env, morph0, context, "partial", ["frames/meme-list-item"], {});
          inline(env, morph1, context, "code-snippet", [], {"name": "meme-list-item.html", "indent": false, "language": "html"});
          return fragment;
        }
      };
    }());
    var child2 = (function() {
      return {
        isHTMLBars: true,
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("			");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1,"class","panel panel-default");
          var el2 = dom.createTextNode("\n				");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("div");
          dom.setAttribute(el2,"class","panel-heading");
          var el3 = dom.createElement("h3");
          dom.setAttribute(el3,"class","panel-title");
          var el4 = dom.createTextNode("Belongs to current user; Liked by current user");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n				");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("div");
          dom.setAttribute(el2,"class","panel-body");
          var el3 = dom.createTextNode("\n					");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("div");
          dom.setAttribute(el3,"class","row");
          var el4 = dom.createTextNode("\n						");
          dom.appendChild(el3, el4);
          var el4 = dom.createElement("div");
          dom.setAttribute(el4,"class","col-xs-6 frame");
          dom.setAttribute(el4,"style","zoom:0.7;");
          var el5 = dom.createTextNode("\n							");
          dom.appendChild(el4, el5);
          var el5 = dom.createTextNode("\n						");
          dom.appendChild(el4, el5);
          dom.appendChild(el3, el4);
          var el4 = dom.createTextNode("\n						");
          dom.appendChild(el3, el4);
          var el4 = dom.createElement("div");
          dom.setAttribute(el4,"class","col-xs-6");
          var el5 = dom.createTextNode("\n							");
          dom.appendChild(el4, el5);
          var el5 = dom.createTextNode("\n						");
          dom.appendChild(el4, el5);
          dom.appendChild(el3, el4);
          var el4 = dom.createTextNode("\n					");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n				");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n			");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, inline = hooks.inline;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var element0 = dom.childAt(fragment, [1, 3, 1]);
          var morph0 = dom.createMorphAt(dom.childAt(element0, [1]),0,1);
          var morph1 = dom.createMorphAt(dom.childAt(element0, [3]),0,1);
          inline(env, morph0, context, "partial", ["frames/meme-list-item-liked"], {});
          inline(env, morph1, context, "code-snippet", [], {"name": "meme-list-item-liked.html", "indent": false, "language": "html"});
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createElement("div");
        dom.setAttribute(el0,"class","panel panel-default");
        var el1 = dom.createTextNode("\n	");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","panel-heading");
        var el2 = dom.createElement("h3");
        dom.setAttribute(el2,"class","panel-title");
        var el3 = dom.createTextNode("meme-list-item Component");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n	");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","panel-body");
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("	");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, get = hooks.get, block = hooks.block;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var element3 = dom.childAt(fragment, [3]);
        if (this.cachedFragment) { dom.repairClonedNode(element3,[1,2]); }
        var morph0 = dom.createMorphAt(element3,0,1);
        var morph1 = dom.createMorphAt(element3,1,2);
        var morph2 = dom.createMorphAt(element3,2,3);
        block(env, morph0, context, "element-highlighter", [], {"data": get(env, context, "highlightData.ownedByAnother")}, child0, null);
        block(env, morph1, context, "element-highlighter", [], {"data": get(env, context, "highlightData.ownedByCurrentUser")}, child1, null);
        block(env, morph2, context, "element-highlighter", [], {"data": get(env, context, "highlightData.ownedByCurrentUser")}, child2, null);
        return fragment;
      }
    };
  }()));

});
define('meme-gen-tutorial/templates/spec/memes-route', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        isHTMLBars: true,
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("	");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1,"class","panel panel-default");
          var el2 = dom.createTextNode("\n		");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("div");
          dom.setAttribute(el2,"class","panel-heading");
          var el3 = dom.createElement("h3");
          dom.setAttribute(el3,"class","panel-title");
          var el4 = dom.createTextNode("/memes");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n		");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("div");
          dom.setAttribute(el2,"class","panel-body");
          var el3 = dom.createTextNode("\n			");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("div");
          dom.setAttribute(el3,"class","row");
          var el4 = dom.createTextNode("\n				");
          dom.appendChild(el3, el4);
          var el4 = dom.createElement("div");
          dom.setAttribute(el4,"class","col-xs-6 frame");
          dom.setAttribute(el4,"style","zoom: 0.4");
          var el5 = dom.createTextNode("\n					");
          dom.appendChild(el4, el5);
          var el5 = dom.createTextNode("\n				");
          dom.appendChild(el4, el5);
          dom.appendChild(el3, el4);
          var el4 = dom.createTextNode("\n				");
          dom.appendChild(el3, el4);
          var el4 = dom.createElement("div");
          dom.setAttribute(el4,"class","col-xs-6");
          var el5 = dom.createTextNode("\n					");
          dom.appendChild(el4, el5);
          var el5 = dom.createTextNode("\n				");
          dom.appendChild(el4, el5);
          dom.appendChild(el3, el4);
          var el4 = dom.createTextNode("\n			");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n		");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n	");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, inline = hooks.inline;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var element0 = dom.childAt(fragment, [1, 3, 1]);
          var morph0 = dom.createMorphAt(dom.childAt(element0, [1]),0,1);
          var morph1 = dom.createMorphAt(dom.childAt(element0, [3]),0,1);
          inline(env, morph0, context, "partial", ["frames/memes"], {});
          inline(env, morph1, context, "code-snippet", [], {"name": "memes.html", "indent": false, "language": "html"});
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createTextNode("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, get = hooks.get, block = hooks.block;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        if (this.cachedFragment) { dom.repairClonedNode(fragment,[0,1]); }
        var morph0 = dom.createMorphAt(fragment,0,1,contextualElement);
        block(env, morph0, context, "element-highlighter", [], {"data": get(env, context, "highlightData.memes")}, child0, null);
        return fragment;
      }
    };
  }()));

});
define('meme-gen-tutorial/templates/spec/user-filter-toggler', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        isHTMLBars: true,
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("			");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1,"class","panel panel-default");
          var el2 = dom.createTextNode("\n				");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("div");
          dom.setAttribute(el2,"class","panel-heading");
          var el3 = dom.createElement("h3");
          dom.setAttribute(el3,"class","panel-title");
          var el4 = dom.createTextNode("Not Selected");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n				");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("div");
          dom.setAttribute(el2,"class","panel-body");
          var el3 = dom.createTextNode("\n					");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("div");
          dom.setAttribute(el3,"class","row");
          var el4 = dom.createTextNode("\n						");
          dom.appendChild(el3, el4);
          var el4 = dom.createElement("div");
          dom.setAttribute(el4,"class","col-xs-6 frame");
          var el5 = dom.createTextNode("\n							");
          dom.appendChild(el4, el5);
          var el5 = dom.createTextNode("\n						");
          dom.appendChild(el4, el5);
          dom.appendChild(el3, el4);
          var el4 = dom.createTextNode("\n						");
          dom.appendChild(el3, el4);
          var el4 = dom.createElement("div");
          dom.setAttribute(el4,"class","col-xs-6");
          var el5 = dom.createTextNode("\n							");
          dom.appendChild(el4, el5);
          var el5 = dom.createTextNode("\n						");
          dom.appendChild(el4, el5);
          dom.appendChild(el3, el4);
          var el4 = dom.createTextNode("\n					");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n				");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n			");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, inline = hooks.inline;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var element1 = dom.childAt(fragment, [1, 3, 1]);
          var morph0 = dom.createMorphAt(dom.childAt(element1, [1]),0,1);
          var morph1 = dom.createMorphAt(dom.childAt(element1, [3]),0,1);
          inline(env, morph0, context, "partial", ["frames/user-filter-toggler"], {});
          inline(env, morph1, context, "code-snippet", [], {"name": "user-filter-toggler.html", "indent": false, "language": "html"});
          return fragment;
        }
      };
    }());
    var child1 = (function() {
      return {
        isHTMLBars: true,
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("			");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1,"class","panel panel-default");
          var el2 = dom.createTextNode("\n				");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("div");
          dom.setAttribute(el2,"class","panel-heading");
          var el3 = dom.createElement("h3");
          dom.setAttribute(el3,"class","panel-title");
          var el4 = dom.createTextNode("Selected");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n				");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("div");
          dom.setAttribute(el2,"class","panel-body");
          var el3 = dom.createTextNode("\n					");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("div");
          dom.setAttribute(el3,"class","row");
          var el4 = dom.createTextNode("\n						");
          dom.appendChild(el3, el4);
          var el4 = dom.createElement("div");
          dom.setAttribute(el4,"class","col-xs-6 frame");
          var el5 = dom.createTextNode("\n							");
          dom.appendChild(el4, el5);
          var el5 = dom.createTextNode("\n						");
          dom.appendChild(el4, el5);
          dom.appendChild(el3, el4);
          var el4 = dom.createTextNode("\n						");
          dom.appendChild(el3, el4);
          var el4 = dom.createElement("div");
          dom.setAttribute(el4,"class","col-xs-6");
          var el5 = dom.createTextNode("\n							");
          dom.appendChild(el4, el5);
          var el5 = dom.createTextNode("\n						");
          dom.appendChild(el4, el5);
          dom.appendChild(el3, el4);
          var el4 = dom.createTextNode("\n					");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n				");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n			");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, inline = hooks.inline;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var element0 = dom.childAt(fragment, [1, 3, 1]);
          var morph0 = dom.createMorphAt(dom.childAt(element0, [1]),0,1);
          var morph1 = dom.createMorphAt(dom.childAt(element0, [3]),0,1);
          inline(env, morph0, context, "partial", ["frames/user-filter-toggler-selected"], {});
          inline(env, morph1, context, "code-snippet", [], {"name": "user-filter-toggler-selected.html", "indent": false, "language": "html"});
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createElement("div");
        dom.setAttribute(el0,"class","panel panel-default");
        var el1 = dom.createTextNode("\n	");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","panel-heading");
        var el2 = dom.createElement("h3");
        dom.setAttribute(el2,"class","panel-title");
        var el3 = dom.createTextNode("user-filter-toggler Component");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n	");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","panel-body");
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("	");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, get = hooks.get, block = hooks.block;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var element2 = dom.childAt(fragment, [3]);
        if (this.cachedFragment) { dom.repairClonedNode(element2,[1]); }
        var morph0 = dom.createMorphAt(element2,0,1);
        var morph1 = dom.createMorphAt(element2,1,2);
        block(env, morph0, context, "element-highlighter", [], {"data": get(env, context, "highlightData.userFilterToggler")}, child0, null);
        block(env, morph1, context, "element-highlighter", [], {"data": get(env, context, "highlightData.userFilterToggler")}, child1, null);
        return fragment;
      }
    };
  }()));

});
define('meme-gen-tutorial/templates/users-filter', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        isHTMLBars: true,
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, get = hooks.get, inline = hooks.inline;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          if (this.cachedFragment) { dom.repairClonedNode(fragment,[0,1]); }
          var morph0 = dom.createMorphAt(fragment,0,1,contextualElement);
          inline(env, morph0, context, "user-filter-toggler", [], {"tagName": "div", "content": get(env, context, "user"), "toggleUser": "toggleUser", "selected": get(env, context, "user.selected")});
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createElement("div");
        dom.setAttribute(el0,"class","users");
        var el1 = dom.createTextNode("\n	");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","panel panel-default");
        var el2 = dom.createTextNode("\n		");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","panel-heading");
        var el3 = dom.createTextNode("\n			Filter by Users\n		");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n		");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","panel-body");
        var el3 = dom.createTextNode("\n			");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n		");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n	");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, get = hooks.get, block = hooks.block;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var morph0 = dom.createMorphAt(dom.childAt(fragment, [1, 3]),0,1);
        block(env, morph0, context, "each", [get(env, context, "users")], {"keyword": "user"}, child0, null);
        return fragment;
      }
    };
  }()));

});
define('meme-gen-tutorial/tests/helpers/resolver', ['exports', 'ember/resolver', 'meme-gen-tutorial/config/environment'], function (exports, Resolver, config) {

  'use strict';

  var resolver = Resolver['default'].create();

  resolver.namespace = {
    modulePrefix: config['default'].modulePrefix,
    podModulePrefix: config['default'].podModulePrefix
  };

  exports['default'] = resolver;

});
define('meme-gen-tutorial/tests/helpers/start-app', ['exports', 'ember', 'meme-gen-tutorial/app', 'meme-gen-tutorial/router', 'meme-gen-tutorial/config/environment'], function (exports, Ember, Application, Router, config) {

  'use strict';

  function startApp(attrs) {
    var application;

    var attributes = Ember['default'].merge({}, config['default'].APP);
    attributes = Ember['default'].merge(attributes, attrs); // use defaults, but you can override;

    Ember['default'].run(function () {
      application = Application['default'].create(attributes);
      application.setupForTesting();
      application.injectTestHelpers();
    });

    return application;
  }
  exports['default'] = startApp;

});
define('meme-gen-tutorial/tests/test-helper', ['meme-gen-tutorial/tests/helpers/resolver', 'ember-qunit'], function (resolver, ember_qunit) {

	'use strict';

	ember_qunit.setResolver(resolver['default']);

	document.write("<div id=\"ember-testing-container\"><div id=\"ember-testing\"></div></div>");

	QUnit.config.urlConfig.push({ id: "nocontainer", label: "Hide container" });
	var containerVisibility = QUnit.urlParams.nocontainer ? "hidden" : "visible";
	document.getElementById("ember-testing-container").style.visibility = containerVisibility;

});
define('meme-gen-tutorial/tests/unit/adapters/application-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("adapter:application", "ApplicationAdapter", {});

  // Replace this with your real tests.
  ember_qunit.test("it exists", function () {
    var adapter = this.subject();
    ok(adapter);
  });
  // Specify the other units that are required for this test.
  // needs: ['serializer:foo']

});
define('meme-gen-tutorial/tests/unit/components/element-highlighter-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleForComponent("element-highlighter", "ElementHighlighterComponent", {});

  ember_qunit.test("it renders", function () {
    expect(2);

    // creates the component instance
    var component = this.subject();
    equal(component._state, "preRender");

    // appends the component to the page
    this.append();
    equal(component._state, "inDOM");
  });
  // specify the other units that are required for this test
  // needs: ['component:foo', 'helper:bar']

});
define('meme-gen-tutorial/tests/unit/components/meme-item-test', ['ember-qunit', 'meme-gen-tutorial/config/environment'], function (ember_qunit, env) {

  'use strict';

  ember_qunit.moduleForComponent("meme-item", "MemeItemComponent", {
    // specify the other units that are required for this test
    needs: ["component:text-editor", "template:components/text-editor"]
  });

  ember_qunit.test("it renders", function () {
    expect(2);

    // creates the component instance
    var component = this.subject({
      content: {
        imgSrc: env['default'].defaultMemeImageSrc,
        opener: "Opener",
        closer: "Closer",
        openerFontSize: 60,
        closerFontSize: 60,
        openerPosition: null,
        closerPosition: null },
      editable: false
    });
    equal(component._state, "preRender");

    // appends the component to the page
    this.append();
    equal(component._state, "inDOM");
  });

});
define('meme-gen-tutorial/tests/unit/components/meme-list-item-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleForComponent("meme-list-item", "MemeListItemComponent", {});

  ember_qunit.test("it renders", function () {
    expect(2);

    // creates the component instance
    var component = this.subject();
    equal(component._state, "preRender");

    // appends the component to the page
    this.append();
    equal(component._state, "inDOM");
  });
  // specify the other units that are required for this test
  // needs: ['component:foo', 'helper:bar']

});
define('meme-gen-tutorial/tests/unit/components/user-filter-toggler-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleForComponent("user-filter-toggler", "UserFilterTogglerComponent", {});

  ember_qunit.test("it renders", function () {
    expect(2);

    // creates the component instance
    var component = this.subject();
    equal(component._state, "preRender");

    // appends the component to the page
    this.append();
    equal(component._state, "inDOM");
  });
  // specify the other units that are required for this test
  // needs: ['component:foo', 'helper:bar']

});
define('meme-gen-tutorial/tests/unit/controllers/meme/edit-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("controller:meme/edit", "MemeEditController", {});

  // Replace this with your real tests.
  ember_qunit.test("it exists", function () {
    var controller = this.subject();
    ok(controller);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('meme-gen-tutorial/tests/unit/controllers/memes/create-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("controller:memes/create", "MemesCreateController", {});

  // Replace this with your real tests.
  ember_qunit.test("it exists", function () {
    var controller = this.subject();
    ok(controller);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('meme-gen-tutorial/tests/unit/controllers/memes/index-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("controller:memes/index", "MemesIndexController", {});

  // Replace this with your real tests.
  ember_qunit.test("it exists", function () {
    var controller = this.subject();
    ok(controller);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('meme-gen-tutorial/tests/unit/controllers/spec-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("controller:spec", "SpecController", {});

  // Replace this with your real tests.
  ember_qunit.test("it exists", function () {
    var controller = this.subject();
    ok(controller);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('meme-gen-tutorial/tests/unit/controllers/spec/create-route-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("controller:spec/create-route", "SpecCreateRouteController", {});

  // Replace this with your real tests.
  ember_qunit.test("it exists", function () {
    var controller = this.subject();
    ok(controller);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('meme-gen-tutorial/tests/unit/controllers/spec/edit-route-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("controller:spec/edit-route", "SpecEditRouteController", {});

  // Replace this with your real tests.
  ember_qunit.test("it exists", function () {
    var controller = this.subject();
    ok(controller);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('meme-gen-tutorial/tests/unit/controllers/spec/meme-item-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("controller:spec/meme-item", "SpecMemeItemController", {});

  // Replace this with your real tests.
  ember_qunit.test("it exists", function () {
    var controller = this.subject();
    ok(controller);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('meme-gen-tutorial/tests/unit/controllers/spec/meme-list-item-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("controller:spec/meme-list-item", "SpecMemeListItemController", {});

  // Replace this with your real tests.
  ember_qunit.test("it exists", function () {
    var controller = this.subject();
    ok(controller);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('meme-gen-tutorial/tests/unit/controllers/spec/memes-route-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("controller:spec/memes-route", "SpecMemesRouteController", {});

  // Replace this with your real tests.
  ember_qunit.test("it exists", function () {
    var controller = this.subject();
    ok(controller);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('meme-gen-tutorial/tests/unit/controllers/spec/user-filter-toggler-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("controller:spec/user-filter-toggler", "SpecUserFilterTogglerController", {});

  // Replace this with your real tests.
  ember_qunit.test("it exists", function () {
    var controller = this.subject();
    ok(controller);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('meme-gen-tutorial/tests/unit/initializers/current-user-test', ['ember', 'meme-gen-tutorial/initializers/current-user'], function (Ember, current_user) {

  'use strict';

  var container, application;

  module("CurrentUserInitializer", {
    setup: function () {
      Ember['default'].run(function () {
        application = Ember['default'].Application.create();
        container = application.__container__;
        application.deferReadiness();
      });
    }
  });

  // Replace this with your real tests.
  test("it works", function () {
    current_user.initialize(container, application);

    // you would normally confirm the results of the initializer here
    ok(true);
  });

});
define('meme-gen-tutorial/tests/unit/initializers/meme-route-fixer-test', ['ember', 'meme-gen-tutorial/initializers/meme-route-fixer'], function (Ember, meme_route_fixer) {

  'use strict';

  var container, application;

  module("MemeRouteFixerInitializer", {
    setup: function () {
      Ember['default'].run(function () {
        application = Ember['default'].Application.create();
        container = application.__container__;
        application.deferReadiness();
      });
    }
  });

  // Replace this with your real tests.
  test("it works", function () {
    meme_route_fixer.initialize(container, application);

    // you would normally confirm the results of the initializer here
    ok(true);
  });

});
define('meme-gen-tutorial/tests/unit/mixins/spec-controller-test', ['ember', 'meme-gen-tutorial/mixins/spec-controller'], function (Ember, SpecControllerMixin) {

  'use strict';

  module("SpecControllerMixin");

  // Replace this with your real tests.
  test("it works", function () {
    var SpecControllerObject = Ember['default'].Object.extend(SpecControllerMixin['default']);
    var subject = SpecControllerObject.create();
    ok(subject);
  });

});
define('meme-gen-tutorial/tests/unit/models/meme-test', ['ember-qunit', 'meme-gen-tutorial/models/user'], function (ember_qunit, User) {

  'use strict';

  ember_qunit.moduleForModel("meme", "Meme", {
    // Specify the other units that are required for this test.
    needs: ["model:user"]
  });

  ember_qunit.test("it exists", function () {
    var model = this.subject();
    // var store = this.store();
    ok(!!model);
  });

});
define('meme-gen-tutorial/tests/unit/models/user-test', ['ember-qunit', 'meme-gen-tutorial/models/meme'], function (ember_qunit, Meme) {

  'use strict';

  ember_qunit.moduleForModel("user", "User", {
    // Specify the other units that are required for this test.
    needs: ["model:meme"]
  });

  ember_qunit.test("it exists", function () {
    var model = this.subject();
    // var store = this.store();
    ok(!!model);
  });

});
define('meme-gen-tutorial/tests/unit/routes/index-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("route:index", "IndexRoute", {});

  ember_qunit.test("it exists", function () {
    var route = this.subject();
    ok(route);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('meme-gen-tutorial/tests/unit/routes/meme/edit-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("route:meme/edit", "MemeEditRoute", {});

  ember_qunit.test("it exists", function () {
    var route = this.subject();
    ok(route);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('meme-gen-tutorial/tests/unit/routes/memes-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("route:memes", "MemesRoute", {});

  ember_qunit.test("it exists", function () {
    var route = this.subject();
    ok(route);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('meme-gen-tutorial/tests/unit/routes/memes/create-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("route:memes/create", "MemesCreateRoute", {});

  ember_qunit.test("it exists", function () {
    var route = this.subject();
    ok(route);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('meme-gen-tutorial/tests/unit/routes/spec-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("route:spec", "SpecRoute", {});

  ember_qunit.test("it exists", function () {
    var route = this.subject();
    ok(route);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('meme-gen-tutorial/tests/unit/routes/spec/create-route-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("route:spec/create-route", "SpecCreateRouteRoute", {});

  ember_qunit.test("it exists", function () {
    var route = this.subject();
    ok(route);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('meme-gen-tutorial/tests/unit/routes/spec/edit-route-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("route:spec/edit-route", "SpecEditRouteRoute", {});

  ember_qunit.test("it exists", function () {
    var route = this.subject();
    ok(route);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('meme-gen-tutorial/tests/unit/routes/spec/index-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("route:spec/index", "SpecIndexRoute", {});

  ember_qunit.test("it exists", function () {
    var route = this.subject();
    ok(route);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('meme-gen-tutorial/tests/unit/routes/spec/meme-item-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("route:spec/meme-item", "SpecMemeItemRoute", {});

  ember_qunit.test("it exists", function () {
    var route = this.subject();
    ok(route);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('meme-gen-tutorial/tests/unit/routes/spec/meme-list-item-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("route:spec/meme-list-item", "SpecMemeListItemRoute", {});

  ember_qunit.test("it exists", function () {
    var route = this.subject();
    ok(route);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('meme-gen-tutorial/tests/unit/routes/spec/memes-route-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("route:spec/memes-route", "SpecMemesRouteRoute", {});

  ember_qunit.test("it exists", function () {
    var route = this.subject();
    ok(route);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('meme-gen-tutorial/tests/unit/routes/spec/user-filter-toggler-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("route:spec/user-filter-toggler", "SpecUserFilterTogglerRoute", {});

  ember_qunit.test("it exists", function () {
    var route = this.subject();
    ok(route);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('meme-gen-tutorial/tests/unit/serializers/application-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("serializer:application", "ApplicationSerializer", {});

  // Replace this with your real tests.
  ember_qunit.test("it exists", function () {
    var serializer = this.subject();
    ok(serializer);
  });
  // Specify the other units that are required for this test.
  // needs: ['serializer:foo']

});
/* jshint ignore:start */

/* jshint ignore:end */

/* jshint ignore:start */

define('meme-gen-tutorial/config/environment', ['ember'], function(Ember) {
  var prefix = 'meme-gen-tutorial';
/* jshint ignore:start */

try {
  var metaName = prefix + '/config/environment';
  var rawConfig = Ember['default'].$('meta[name="' + metaName + '"]').attr('content');
  var config = JSON.parse(unescape(rawConfig));

  return { 'default': config };
}
catch(err) {
  throw new Error('Could not read config from meta tag with name "' + metaName + '".');
}

/* jshint ignore:end */

});

if (runningTests) {
  require("meme-gen-tutorial/tests/test-helper");
} else {
  require("meme-gen-tutorial/app")["default"].create({"name":"meme-gen-tutorial","version":"0.0.0.5592b9fd"});
}

/* jshint ignore:end */
//# sourceMappingURL=meme-gen-tutorial.map