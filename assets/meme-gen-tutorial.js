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
      this.toggleProperty("selected");
      this.sendAction("toggleUser", this.get("content.id"), this.get("selected"));
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
    usersToFilterBy: (function () {
      return this.get("model.users").map(function (user) {
        return Ember['default'].Object.extend({
          name: user.get("name"),
          id: user.get("id"),
          selected: this.get("filterByUsers").contains(user.get("id"))
        }).create();
      }, this);
    }).property("filterByUsers"),
    filteredMemes: (function () {
      var filterByUsers = this.get("filterByUsers"),
          searchTermRegExp = new RegExp(escape(this.get("searchTerm")).toLowerCase());
      return this.store.filter("meme", function (meme) {
        return (filterByUsers.length === 0 || filterByUsers.contains(meme.get("user.id"))) && (searchTermRegExp.test(meme.get("opener").toLowerCase()) || searchTermRegExp.test(meme.get("closer").toLowerCase()));
      });
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

    if (config['default'].exportApplicationGlobal) {
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
define('meme-gen-tutorial/routes/memes/index', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend({
    renderTemplate: function () {
      this.render();
      this.render("users-filter", {
        outlet: "users-filter",
        into: "memes.index"
      });
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
define('meme-gen-tutorial/templates/application', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1, helper, options, self=this, helperMissing=helpers.helperMissing;

  function program1(depth0,data) {
    
    
    data.buffer.push("Memes");
    }

  function program3(depth0,data) {
    
    
    data.buffer.push("Spec");
    }

    data.buffer.push("<nav class=\"navbar navbar-default\">\n	<div class=\"container-fluid\">\n		<div class=\"navbar-header\">\n			<a class='navbar-brand'>Meme Generator</a>\n		</div>\n		<div class=\"collapse navbar-collapse\" id=\"bs-example-navbar-collapse-1\">\n			<ul class=\"nav navbar-nav\">\n				<li>");
    stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "memes", options) : helperMissing.call(depth0, "link-to", "memes", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</li>\n				<li>");
    stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(3, program3, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "spec", options) : helperMissing.call(depth0, "link-to", "spec", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</li>\n			</ul>\n		</div>\n	</div>\n</nav>\n");
    stack1 = helpers._triageMustache.call(depth0, "outlet", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    return buffer;
    
  });

});
define('meme-gen-tutorial/templates/components/code-snippet', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1;


    stack1 = helpers._triageMustache.call(depth0, "source", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n");
    return buffer;
    
  });

});
define('meme-gen-tutorial/templates/components/element-highlighter', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1;


    stack1 = helpers._triageMustache.call(depth0, "yield", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n");
    return buffer;
    
  });

});
define('meme-gen-tutorial/templates/components/meme-item', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', helper, options, escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing;


    data.buffer.push("<div class='opener' ");
    data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
      'style': ("openerStyle")
    },hashTypes:{'style': "ID"},hashContexts:{'style': depth0},contexts:[],types:[],data:data})));
    data.buffer.push(">\n	");
    data.buffer.push(escapeExpression((helper = helpers['text-editor'] || (depth0 && depth0['text-editor']),options={hash:{
      'text': ("content.opener"),
      'editable': ("editable")
    },hashTypes:{'text': "ID",'editable': "ID"},hashContexts:{'text': depth0,'editable': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "text-editor", options))));
    data.buffer.push("\n</div>\n<div class='closer' ");
    data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
      'style': ("closerStyle")
    },hashTypes:{'style': "ID"},hashContexts:{'style': depth0},contexts:[],types:[],data:data})));
    data.buffer.push(">\n	");
    data.buffer.push(escapeExpression((helper = helpers['text-editor'] || (depth0 && depth0['text-editor']),options={hash:{
      'text': ("content.closer"),
      'editable': ("editable")
    },hashTypes:{'text': "ID",'editable': "ID"},hashContexts:{'text': depth0,'editable': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "text-editor", options))));
    data.buffer.push("\n</div>\n\n");
    return buffer;
    
  });

});
define('meme-gen-tutorial/templates/components/meme-list-item', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1, helper, options, self=this, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;

  function program1(depth0,data) {
    
    var buffer = '', stack1, helper, options;
    data.buffer.push("\n	");
    stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(2, program2, data),contexts:[depth0,depth0],types:["STRING","ID"],data:data},helper ? helper.call(depth0, "meme.edit", "content", options) : helperMissing.call(depth0, "link-to", "meme.edit", "content", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n	<button type=\"button\" class=\"btn\" aria-label=\"Left Align\" ");
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "deleteMeme", "content", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0,depth0],types:["STRING","ID"],data:data})));
    data.buffer.push(">\n	<span class=\"glyphicon glyphicon-trash\" aria-hidden=\"true\"></span>\n	</button>\n	");
    return buffer;
    }
  function program2(depth0,data) {
    
    
    data.buffer.push("\n	<button type=\"button\" class=\"btn\" aria-label=\"Left Align\">\n	<span class=\"glyphicon glyphicon-pencil\" aria-hidden=\"true\"></span>\n	</button>\n	");
    }

    data.buffer.push("<div class=\"panel-body\">\n	");
    data.buffer.push(escapeExpression((helper = helpers['meme-item'] || (depth0 && depth0['meme-item']),options={hash:{
      'content': ("content")
    },hashTypes:{'content': "ID"},hashContexts:{'content': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "meme-item", options))));
    data.buffer.push("\n</div>\n<div class=\"panel-footer\">\n	");
    stack1 = helpers['if'].call(depth0, "content.isMine", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n	<button type=\"button\" ");
    data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
      'class': (":btn content.likedByMe:liked")
    },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},contexts:[],types:[],data:data})));
    data.buffer.push(" aria-label=\"Left Align\" ");
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "toggleLike", "content", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0,depth0],types:["STRING","ID"],data:data})));
    data.buffer.push(">\n	<span class=\"glyphicon glyphicon-heart\" aria-hidden=\"true\"></span>\n	<span class='badge'>");
    stack1 = helpers._triageMustache.call(depth0, "content.likes", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</span>\n	</button>\n	<span class=\"label label-info\">Created by ");
    stack1 = helpers._triageMustache.call(depth0, "content.user.name", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</span>\n</div>");
    return buffer;
    
  });

});
define('meme-gen-tutorial/templates/components/text-editor', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1, self=this;

  function program1(depth0,data) {
    
    var buffer = '', stack1;
    data.buffer.push("<div class='document-section'>");
    stack1 = helpers._triageMustache.call(depth0, "", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</div>");
    return buffer;
    }

    stack1 = helpers.each.call(depth0, "paragraphs", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n");
    return buffer;
    
  });

});
define('meme-gen-tutorial/templates/components/user-filter-toggler', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1;


    stack1 = helpers._triageMustache.call(depth0, "content.name", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n");
    return buffer;
    
  });

});
define('meme-gen-tutorial/templates/frames/_create', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    


    data.buffer.push("<div class=\"panel panel-default meme-panel\">\n	<div class=\"panel-heading\">\n		<span>Create Meme</span>\n	</div>\n	<div class=\"panel-body flex\">\n		<div class=\"panel panel-default meme-controls\">\n			<div class=\"panel-body\">\n				<div class=\"form-group\">\n					<label>Image URL</label>\n					<input class=\"ember-view ember-text-field form-control\" placeholder=\"Image URL\" type=\"text\">\n				</div>\n				<div class=\"form-group\">\n					<label>Opener Font Size</label>\n					<input class=\"ember-view ember-text-field form-control\" placeholder=\"Search\" type=\"range\">\n				</div>\n				<div class=\"form-group\">\n					<label>Closer Font Size</label>\n					<input class=\"ember-view ember-text-field form-control\" placeholder=\"Search\" type=\"range\">\n				</div>\n			</div>\n		</div>\n		<div class=\"ember-view meme-item editable\" style=\"background-image: url(http://lh4.ggpht.com/NgmqkelleJw8GYypJRPyo10HUnMZ7aR8YbkT8ZNXAQC9KLChDT-yGvOy9R4WGEuEUDpjs-ERNYx6kU9PKWDS9OAtAOsp=s0)\"><div class=\"opener ui-draggable ui-draggable-handle\" style=\"font-size: 60px; top: 0px;\">\n	<div class=\"ember-view TextEditor\" contenteditable=\"true\"><div class=\"document-section\">Opener</div>\n</div>\n</div>\n<div class=\"closer ui-draggable ui-draggable-handle\" style=\"font-size: 60px; bottom: 0px;\">\n	<div class=\"ember-view TextEditor\" contenteditable=\"true\"><div class=\"document-section\">Closer</div>\n</div>\n</div>\n\n</div>\n	</div>\n	<div class=\"panel-footer align-right\">\n		<button type=\"button\" class=\"btn btn-success\">\n			Create\n		</button>\n		<a>\n			<button type=\"button\" class=\"btn btn-default\">\n				Cancel\n			</button>\n		</a>\n		\n	</div>\n</div>");
    
  });

});
define('meme-gen-tutorial/templates/frames/_edit', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    


    data.buffer.push("<div class=\"panel panel-default meme-panel\">\n	<div class=\"panel-heading\">\n		<span>Edit Meme</span>\n	</div>\n	<div class=\"panel-body flex\">\n		<div class=\"panel panel-default meme-controls\">\n			<div class=\"panel-body\">\n				<div class=\"form-group\">\n					<label>Image URL</label>\n					<input class=\"ember-view ember-text-field form-control\" placeholder=\"Image URL\" type=\"text\">\n				</div>\n				<div class=\"form-group\">\n					<label>Opener Font Size</label>\n					<input class=\"ember-view ember-text-field form-control\" placeholder=\"Search\" type=\"range\">\n				</div>\n				<div class=\"form-group\">\n					<label>Closer Font Size</label>\n					<input class=\"ember-view ember-text-field form-control\" placeholder=\"Search\" type=\"range\">\n				</div>\n			</div>\n		</div>\n		<div class=\"ember-view meme-item editable\" style=\"background-image: url(http://lh4.ggpht.com/NgmqkelleJw8GYypJRPyo10HUnMZ7aR8YbkT8ZNXAQC9KLChDT-yGvOy9R4WGEuEUDpjs-ERNYx6kU9PKWDS9OAtAOsp=s0)\"><div class=\"opener ui-draggable ui-draggable-handle\" style=\"font-size: 60px; top: 0px;\">\n	<div class=\"ember-view TextEditor\" contenteditable=\"true\"><div class=\"document-section\">Opener</div>\n</div>\n</div>\n<div class=\"closer ui-draggable ui-draggable-handle\" style=\"font-size: 60px; bottom: 0px;\">\n	<div class=\"ember-view TextEditor\" contenteditable=\"true\"><div class=\"document-section\">Closer</div>\n</div>\n</div>\n\n</div>\n	</div>\n	<div class=\"panel-footer align-right\">\n		<button type=\"button\" class=\"btn btn-success\">\n			Save\n		</button>\n		<a>\n			<button type=\"button\" class=\"btn btn-default\">\n				Cancel\n			</button>\n		</a>\n		\n	</div>\n</div>");
    
  });

});
define('meme-gen-tutorial/templates/frames/_meme-item-editable', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    


    data.buffer.push("<div class=\"meme-item\" style=\"background-image: url(http://lh4.ggpht.com/NgmqkelleJw8GYypJRPyo10HUnMZ7aR8YbkT8ZNXAQC9KLChDT-yGvOy9R4WGEuEUDpjs-ERNYx6kU9PKWDS9OAtAOsp=s0)\"><div class=\"opener\" style=\"font-size: 55px; top: 0px;\">\n	<div class=\"TextEditor\" contenteditable=\"true\"><div class=\"document-section\">Opener</div>\n</div>\n</div>\n<div class=\"closer\" style=\"font-size: 60px; bottom: 0px;\">\n<div class=\"TextEditor\" contenteditable=\"true\"><div class=\"document-section\">Closer</div>\n</div>\n</div>\n</div>");
    
  });

});
define('meme-gen-tutorial/templates/frames/_meme-item', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    


    data.buffer.push("<div class=\"meme-item not-editable\" style=\"background-image: url(http://lh4.ggpht.com/NgmqkelleJw8GYypJRPyo10HUnMZ7aR8YbkT8ZNXAQC9KLChDT-yGvOy9R4WGEuEUDpjs-ERNYx6kU9PKWDS9OAtAOsp=s0)\"><div class=\"opener\" style=\"font-size: 55px; top: 0px;\">\n	<div class=\"TextEditor\" contenteditable=\"false\"><div class=\"document-section\">Opener</div>\n</div>\n</div>\n<div class=\"closer\" style=\"font-size: 60px; bottom: 0px;\">\n<div class=\"TextEditor\" contenteditable=\"false\"><div class=\"document-section\">Closer</div>\n</div>\n</div>\n</div>");
    
  });

});
define('meme-gen-tutorial/templates/frames/_meme-list-item-liked', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    


    data.buffer.push("<div class=\"meme-list-item panel panel-default\"><div class=\"panel-body\">\n	<div class=\"meme-item not-editable\" style=\"background-image: url(http://lh4.ggpht.com/NgmqkelleJw8GYypJRPyo10HUnMZ7aR8YbkT8ZNXAQC9KLChDT-yGvOy9R4WGEuEUDpjs-ERNYx6kU9PKWDS9OAtAOsp=s0)\"><div class=\"opener\" style=\"font-size: 55px; top: 0px;\">\n	<div class=\"TextEditor\" contenteditable=\"false\"><div class=\"document-section\">Opener</div>\n</div>\n</div>\n<div class=\"closer\" style=\"font-size: 60px; bottom: 0px;\">\n	<div class=\"TextEditor\" contenteditable=\"false\"><div class=\"document-section\">Closer</div>\n</div>\n</div>\n\n</div>\n</div>\n<div class=\"panel-footer\">\n	\n	<a>\n	<button type=\"button\" class=\"btn\" aria-label=\"Left Align\">\n	<span class=\"glyphicon glyphicon-pencil\" aria-hidden=\"true\"></span>\n	</button>\n	</a>\n	<button type=\"button\" class=\"btn\" aria-label=\"Left Align\">\n	<span class=\"glyphicon glyphicon-trash\" aria-hidden=\"true\"></span>\n	</button>\n	\n	<button type=\"button\" class=\"btn liked\" aria-label=\"Left Align\">\n	<span class=\"glyphicon glyphicon-heart\" aria-hidden=\"true\"></span>\n	<span class=\"badge\">0</span>\n	</button>\n	<span class=\"label label-info\">Created by User</span>\n</div></div>");
    
  });

});
define('meme-gen-tutorial/templates/frames/_meme-list-item-of-another', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    


    data.buffer.push("<div class=\"meme-list-item panel panel-default\"><div class=\"panel-body\">\n	<div class=\"meme-item not-editable\" style=\"background-image: url(http://lh4.ggpht.com/NgmqkelleJw8GYypJRPyo10HUnMZ7aR8YbkT8ZNXAQC9KLChDT-yGvOy9R4WGEuEUDpjs-ERNYx6kU9PKWDS9OAtAOsp=s0)\"><div class=\"opener\" style=\"font-size: 55px; top: 0px;\">\n	<div class=\"TextEditor\" contenteditable=\"false\"><div class=\"document-section\">Opener</div>\n</div>\n</div>\n<div class=\"closer\" style=\"font-size: 60px; bottom: 0px;\">\n	<div class=\"TextEditor\" contenteditable=\"false\"><div class=\"document-section\">Closer</div>\n</div>\n</div>\n\n</div>\n</div>\n<div class=\"panel-footer\">\n	<button type=\"button\" class=\"btn\" aria-label=\"Left Align\">\n	<span class=\"glyphicon glyphicon-heart\" aria-hidden=\"true\"></span>\n	<span class=\"badge\">0</span>\n	</button>\n	<span class=\"label label-info\">Created by User</span>\n</div></div>");
    
  });

});
define('meme-gen-tutorial/templates/frames/_meme-list-item', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    


    data.buffer.push("<div class=\"meme-list-item panel panel-default\">\n	<div class=\"panel-body\">\n		<div class=\"meme-item not-editable\" style=\"background-image: url(http://lh4.ggpht.com/NgmqkelleJw8GYypJRPyo10HUnMZ7aR8YbkT8ZNXAQC9KLChDT-yGvOy9R4WGEuEUDpjs-ERNYx6kU9PKWDS9OAtAOsp=s0)\"><div class=\"opener\" style=\"font-size: 55px; top: 0px;\">\n			<div class=\"TextEditor\" contenteditable=\"false\"><div class=\"document-section\">Opener</div>\n		</div>\n	</div>\n	<div class=\"closer\" style=\"font-size: 60px; bottom: 0px;\">\n		<div class=\"TextEditor\" contenteditable=\"false\"><div class=\"document-section\">Closer</div>\n	</div>\n</div>\n</div>\n</div>\n<div class=\"panel-footer\">\n<a>\n<button type=\"button\" class=\"btn\" aria-label=\"Left Align\">\n<span class=\"glyphicon glyphicon-pencil\" aria-hidden=\"true\"></span>\n</button>\n</a>\n<button type=\"button\" class=\"btn\" aria-label=\"Left Align\">\n<span class=\"glyphicon glyphicon-trash\" aria-hidden=\"true\"></span>\n</button>\n<button type=\"button\" class=\"btn\" aria-label=\"Left Align\">\n<span class=\"glyphicon glyphicon-heart\" aria-hidden=\"true\"></span>\n<span class=\"badge\">0</span>\n</button>\n<span class=\"label label-info\">Created by User</span>\n</div></div>");
    
  });

});
define('meme-gen-tutorial/templates/frames/_memes', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    


    data.buffer.push("<div class=\"memes-container\">\n	<div class=\"memes-filters\">\n		<div class=\"form-group\">\n			<a>\n				<button type=\"button\" class=\"btn btn-default full-width\" aria-label=\"Left Align\">\n				<span class=\"glyphicon glyphicon-plus\" aria-hidden=\"true\"></span>\n				Create a Meme\n				</button>\n			</a>\n		</div>\n		<div class=\"form-group\">\n			<input class=\"ember-text-field form-control\" placeholder=\"Filter by meme text\" type=\"text\">\n		</div>\n		<div class=\"users\">\n			<div class=\"panel panel-default\">\n				<div class=\"panel-heading\">\n					Filter by Users\n				</div>\n				<div class=\"panel-body\">\n					<div class=\"label label-primary\">Rami\n					</div><div class=\"label label-primary\">Amir\n				</div><div class=\"label label-primary\">Emmanuel\n			</div><div class=\"label label-primary\">Eyal\n		</div><div class=\"label label-primary\">Gal\n	</div><div class=\"label label-primary\">Gennady\n</div><div class=\"label label-primary\">Gilad\n</div><div class=\"label label-primary\">Jonathan\n</div><div class=\"label label-primary\">Liad\n</div><div class=\"label label-primary\">Ronny\n</div><div class=\"label label-primary\">Tal\n</div><div class=\"label label-primary\">Yoni\n</div>\n</div>\n</div>\n</div>\n</div>\n<div class=\"memes-list\">\n<div class=\"meme-list-item panel panel-default\">  <div class=\"panel-body\">\n<div class=\"meme-item not-editable\" style=\"background-image: url(http://lh4.ggpht.com/NgmqkelleJw8GYypJRPyo10HUnMZ7aR8YbkT8ZNXAQC9KLChDT-yGvOy9R4WGEuEUDpjs-ERNYx6kU9PKWDS9OAtAOsp=s0)\"><div class=\"opener\" style=\"font-size: 55px; top: 0px;\">\n<div class=\"TextEditor\" contenteditable=\"false\"><div class=\"document-section\">Opener</div>\n</div>\n</div>\n<div class=\"closer\" style=\"font-size: 60px; bottom: 0px;\">\n<div class=\"TextEditor\" contenteditable=\"false\"><div class=\"document-section\">Closer</div>\n</div>\n</div>\n</div>\n</div>\n<div class=\"panel-footer\">\n<a>\n<button type=\"button\" class=\"btn\" aria-label=\"Left Align\">\n<span class=\"glyphicon glyphicon-pencil\" aria-hidden=\"true\"></span>\n</button>\n</a>\n<button type=\"button\" class=\"btn\" aria-label=\"Left Align\" data-ember-action=\"666\">\n<span class=\"glyphicon glyphicon-trash\" aria-hidden=\"true\"></span>\n</button>\n<button type=\"button\" class=\"btn\" data-bindattr-638=\"638\" aria-label=\"Left Align\" data-ember-action=\"639\">\n<span class=\"glyphicon glyphicon-heart\" aria-hidden=\"true\"></span>\n<span class=\"badge\">0</span>\n</button>\n<span class=\"label label-info\">Created by Rami</span>\n</div>\n</div>\n<div class=\"meme-list-item panel panel-default\">  <div class=\"panel-body\">\n<div class=\"meme-item not-editable\" style=\"background-image: url(http://lh4.ggpht.com/NgmqkelleJw8GYypJRPyo10HUnMZ7aR8YbkT8ZNXAQC9KLChDT-yGvOy9R4WGEuEUDpjs-ERNYx6kU9PKWDS9OAtAOsp=s0)\"><div class=\"opener\" style=\"font-size: 55px; top: 0px;\">\n<div class=\"TextEditor\" contenteditable=\"false\"><div class=\"document-section\">Opener</div>\n</div>\n</div>\n<div class=\"closer\" style=\"font-size: 60px; bottom: 0px;\">\n<div class=\"TextEditor\" contenteditable=\"false\"><div class=\"document-section\">Closer</div>\n</div>\n</div>\n</div>\n</div>\n<div class=\"panel-footer\">\n<a>\n<button type=\"button\" class=\"btn\" aria-label=\"Left Align\">\n<span class=\"glyphicon glyphicon-pencil\" aria-hidden=\"true\"></span>\n</button>\n</a>\n<button type=\"button\" class=\"btn\" aria-label=\"Left Align\" data-ember-action=\"666\">\n<span class=\"glyphicon glyphicon-trash\" aria-hidden=\"true\"></span>\n</button>\n<button type=\"button\" class=\"btn\" data-bindattr-638=\"638\" aria-label=\"Left Align\" data-ember-action=\"639\">\n<span class=\"glyphicon glyphicon-heart\" aria-hidden=\"true\"></span>\n<span class=\"badge\">0</span>\n</button>\n<span class=\"label label-info\">Created by Rami</span>\n</div>\n</div>\n</div>\n</div>");
    
  });

});
define('meme-gen-tutorial/templates/frames/_user-filter-toggler-selected', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    


    data.buffer.push("<div class=\"label label-success\">Username</div>");
    
  });

});
define('meme-gen-tutorial/templates/frames/_user-filter-toggler', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    


    data.buffer.push("<div class=\"label label-primary\">Username</div>");
    
  });

});
define('meme-gen-tutorial/templates/index', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1;


    stack1 = helpers._triageMustache.call(depth0, "outlet", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n");
    return buffer;
    
  });

});
define('meme-gen-tutorial/templates/meme-list-item', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1, helper, options, self=this, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;

  function program1(depth0,data) {
    
    var buffer = '', stack1, helper, options;
    data.buffer.push("\n      ");
    stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(2, program2, data),contexts:[depth0,depth0],types:["STRING","ID"],data:data},helper ? helper.call(depth0, "meme.edit", "meme", options) : helperMissing.call(depth0, "link-to", "meme.edit", "meme", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n      <button type=\"button\" class=\"btn\" aria-label=\"Left Align\" ");
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "deleteMeme", "meme", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0,depth0],types:["STRING","ID"],data:data})));
    data.buffer.push(">\n        <span class=\"glyphicon glyphicon-trash\" aria-hidden=\"true\"></span>\n      </button>\n    ");
    return buffer;
    }
  function program2(depth0,data) {
    
    
    data.buffer.push("\n        <button type=\"button\" class=\"btn\" aria-label=\"Left Align\">\n          <span class=\"glyphicon glyphicon-pencil\" aria-hidden=\"true\"></span>\n        </button>\n      ");
    }

    data.buffer.push("  <div class=\"panel-body\">\n    ");
    data.buffer.push(escapeExpression((helper = helpers['meme-item'] || (depth0 && depth0['meme-item']),options={hash:{
      'content': ("view.content")
    },hashTypes:{'content': "ID"},hashContexts:{'content': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "meme-item", options))));
    data.buffer.push("\n  </div>\n  <div class=\"panel-footer\">\n    ");
    stack1 = helpers['if'].call(depth0, "view.content.isMine", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n  	<button type=\"button\" ");
    data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
      'class': (":btn view.content.likedByMe:liked")
    },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},contexts:[],types:[],data:data})));
    data.buffer.push(" aria-label=\"Left Align\" ");
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "toggleLike", "view.content", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0,depth0],types:["STRING","ID"],data:data})));
    data.buffer.push(">\n	  <span class=\"glyphicon glyphicon-heart\" aria-hidden=\"true\"></span>\n	  <span class='badge'>");
    stack1 = helpers._triageMustache.call(depth0, "view.content.likes", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</span>\n	</button>\n	<span class=\"label label-info\">Created by ");
    stack1 = helpers._triageMustache.call(depth0, "view.content.user.name", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</span>\n  </div>\n");
    return buffer;
    
  });

});
define('meme-gen-tutorial/templates/meme-with-controls', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1, helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, self=this;

  function program1(depth0,data) {
    
    
    data.buffer.push("\n			<button type=\"button\" class=\"btn btn-default\">\n				Cancel\n			</button>\n		");
    }

    data.buffer.push("<div class=\"panel panel-default meme-panel\">\n	<div class=\"panel-heading\">\n		<span>");
    stack1 = helpers._triageMustache.call(depth0, "title", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</span>\n	</div>\n	<div class=\"panel-body flex\">\n		<div class=\"panel panel-default meme-controls\">\n			<div class=\"panel-body\">\n				<div class=\"form-group\">\n					<label>Image URL</label>\n					");
    data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
      'classNames': ("form-control"),
      'placeholder': ("Image URL"),
      'value': ("model.imgSrc")
    },hashTypes:{'classNames': "STRING",'placeholder': "STRING",'value': "ID"},hashContexts:{'classNames': depth0,'placeholder': depth0,'value': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
    data.buffer.push("\n				</div>\n				<div class=\"form-group\">\n					<label>Opener Font Size</label>\n					");
    data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
      'type': ("range"),
      'classNames': ("form-control"),
      'value': ("model.openerFontSize")
    },hashTypes:{'type': "STRING",'classNames': "STRING",'value': "ID"},hashContexts:{'type': depth0,'classNames': depth0,'value': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
    data.buffer.push("\n				</div>\n				<div class=\"form-group\">\n					<label>Closer Font Size</label>\n					");
    data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
      'type': ("range"),
      'classNames': ("form-control"),
      'value': ("model.closerFontSize")
    },hashTypes:{'type': "STRING",'classNames': "STRING",'value': "ID"},hashContexts:{'type': depth0,'classNames': depth0,'value': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
    data.buffer.push("\n				</div>\n			</div>\n		</div>\n		");
    data.buffer.push(escapeExpression((helper = helpers['meme-item'] || (depth0 && depth0['meme-item']),options={hash:{
      'editable': (true),
      'content': ("model")
    },hashTypes:{'editable': "BOOLEAN",'content': "ID"},hashContexts:{'editable': depth0,'content': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "meme-item", options))));
    data.buffer.push("\n	</div>\n	<div class=\"panel-footer align-right\">\n		<button type=\"button\" class=\"btn btn-success\" ");
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "saveMeme", "model", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0,depth0],types:["STRING","ID"],data:data})));
    data.buffer.push(">\n			");
    stack1 = helpers._triageMustache.call(depth0, "actionName", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n		</button>\n		");
    stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "memes.index", options) : helperMissing.call(depth0, "link-to", "memes.index", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n		\n	</div>\n</div>");
    return buffer;
    
  });

});
define('meme-gen-tutorial/templates/meme', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1;


    stack1 = helpers._triageMustache.call(depth0, "outlet", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n");
    return buffer;
    
  });

});
define('meme-gen-tutorial/templates/meme/error', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    


    data.buffer.push("<div class=\"panel panel-default meme-panel\">\n	<div class=\"panel-heading\">\n		<span>Error</span>\n	</div>\n	<div class=\"panel-body\">\n		Could not find meme\n	</div>\n</div>");
    
  });

});
define('meme-gen-tutorial/templates/meme/index', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;


    data.buffer.push(escapeExpression((helper = helpers['meme-item'] || (depth0 && depth0['meme-item']),options={hash:{
      'editable': (true),
      'content': ("model")
    },hashTypes:{'editable': "BOOLEAN",'content': "ID"},hashContexts:{'editable': depth0,'content': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "meme-item", options))));
    
  });

});
define('meme-gen-tutorial/templates/memes', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1;


    stack1 = helpers._triageMustache.call(depth0, "outlet", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n");
    return buffer;
    
  });

});
define('meme-gen-tutorial/templates/memes/index', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1, helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, self=this;

  function program1(depth0,data) {
    
    
    data.buffer.push("\n				<button type=\"button\" class=\"btn btn-default full-width\" aria-label=\"Left Align\">\n				  <span class=\"glyphicon glyphicon-plus\" aria-hidden=\"true\"></span>\n				  Create a Meme\n				</button>\n			");
    }

  function program3(depth0,data) {
    
    var buffer = '', helper, options;
    data.buffer.push("\n			");
    data.buffer.push(escapeExpression((helper = helpers['meme-list-item'] || (depth0 && depth0['meme-list-item']),options={hash:{
      'content': ("meme"),
      'toggleLike': ("toggleLike"),
      'deleteMeme': ("deleteMeme")
    },hashTypes:{'content': "ID",'toggleLike': "STRING",'deleteMeme': "STRING"},hashContexts:{'content': depth0,'toggleLike': depth0,'deleteMeme': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "meme-list-item", options))));
    data.buffer.push("\n		");
    return buffer;
    }

  function program5(depth0,data) {
    
    
    data.buffer.push("\n			<div class=\"panel panel-default\">\n			  <div class=\"panel-body center\">\n			    No memes were found\n			  </div>\n			</div>\n		");
    }

    data.buffer.push("<div class='memes-container'>\n	<div class='memes-filters'>\n		<div class=\"form-group\">\n			");
    stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "memes.create", options) : helperMissing.call(depth0, "link-to", "memes.create", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n		</div>\n		<div class=\"form-group\">\n			");
    data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
      'value': ("searchTerm"),
      'classNames': ("form-control"),
      'placeholder': ("Filter by meme text")
    },hashTypes:{'value': "ID",'classNames': "STRING",'placeholder': "STRING"},hashContexts:{'value': depth0,'classNames': depth0,'placeholder': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
    data.buffer.push("\n		</div>\n		");
    data.buffer.push(escapeExpression((helper = helpers.outlet || (depth0 && depth0.outlet),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "users-filter", options) : helperMissing.call(depth0, "outlet", "users-filter", options))));
    data.buffer.push("\n	</div>\n	<div class=\"memes-list\">\n		");
    stack1 = helpers.each.call(depth0, "meme", "in", "filteredMemes", {hash:{},hashTypes:{},hashContexts:{},inverse:self.program(5, program5, data),fn:self.program(3, program3, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n	</div>\n</div>");
    return buffer;
    
  });

});
define('meme-gen-tutorial/templates/spec', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1, helper, options, self=this, helperMissing=helpers.helperMissing;

  function program1(depth0,data) {
    
    
    data.buffer.push("/memes");
    }

  function program3(depth0,data) {
    
    
    data.buffer.push("/memes/create");
    }

  function program5(depth0,data) {
    
    
    data.buffer.push("/memes/:meme_id/edit");
    }

  function program7(depth0,data) {
    
    
    data.buffer.push("meme-list-item");
    }

  function program9(depth0,data) {
    
    
    data.buffer.push("user-filter-toggler");
    }

  function program11(depth0,data) {
    
    
    data.buffer.push("meme-item");
    }

    data.buffer.push("<div class=\"panel panel-default\">\n	<div class='panel-body'>\n		<div class='row'>\n			<div class=\"col-xs-2\">\n				<h4>Routes</h4>\n				<div class=\"list-group\">\n					");
    stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{
      'classNames': ("list-group-item")
    },hashTypes:{'classNames': "STRING"},hashContexts:{'classNames': depth0},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "spec.memes-route", options) : helperMissing.call(depth0, "link-to", "spec.memes-route", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n					");
    stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{
      'classNames': ("list-group-item")
    },hashTypes:{'classNames': "STRING"},hashContexts:{'classNames': depth0},inverse:self.noop,fn:self.program(3, program3, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "spec.create-route", options) : helperMissing.call(depth0, "link-to", "spec.create-route", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n					");
    stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{
      'classNames': ("list-group-item")
    },hashTypes:{'classNames': "STRING"},hashContexts:{'classNames': depth0},inverse:self.noop,fn:self.program(5, program5, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "spec.edit-route", options) : helperMissing.call(depth0, "link-to", "spec.edit-route", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n				</div>\n				<h4>Components</h4>\n				<div class=\"list-group\">\n					");
    stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{
      'classNames': ("list-group-item")
    },hashTypes:{'classNames': "STRING"},hashContexts:{'classNames': depth0},inverse:self.noop,fn:self.program(7, program7, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "spec.meme-list-item", options) : helperMissing.call(depth0, "link-to", "spec.meme-list-item", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n					");
    stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{
      'classNames': ("list-group-item")
    },hashTypes:{'classNames': "STRING"},hashContexts:{'classNames': depth0},inverse:self.noop,fn:self.program(9, program9, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "spec.user-filter-toggler", options) : helperMissing.call(depth0, "link-to", "spec.user-filter-toggler", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n					");
    stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{
      'classNames': ("list-group-item")
    },hashTypes:{'classNames': "STRING"},hashContexts:{'classNames': depth0},inverse:self.noop,fn:self.program(11, program11, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "spec.meme-item", options) : helperMissing.call(depth0, "link-to", "spec.meme-item", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n				</div>\n			</div>\n			<div class=\"col-xs-10\">\n				");
    stack1 = helpers._triageMustache.call(depth0, "outlet", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n			</div>\n		</div>	\n	</div>\n</div>");
    return buffer;
    
  });

});
define('meme-gen-tutorial/templates/spec/create-route', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var stack1, helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, self=this;

  function program1(depth0,data) {
    
    var buffer = '', helper, options;
    data.buffer.push("\n	<div class=\"panel panel-default\">\n		<div class=\"panel-heading\"><h3 class=\"panel-title\">/memes/create</h3></div>\n		<div class='panel-body'>\n			<div class='row'>\n				<div class=\"col-xs-6 frame\" style=\"zoom:0.5\">\n					");
    data.buffer.push(escapeExpression((helper = helpers.partial || (depth0 && depth0.partial),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "frames/create", options) : helperMissing.call(depth0, "partial", "frames/create", options))));
    data.buffer.push("\n				</div>\n				<div class=\"col-xs-6\">\n					");
    data.buffer.push(escapeExpression((helper = helpers['code-snippet'] || (depth0 && depth0['code-snippet']),options={hash:{
      'name': ("create.html"),
      'indent': (false),
      'language': ("html")
    },hashTypes:{'name': "STRING",'indent': "BOOLEAN",'language': "STRING"},hashContexts:{'name': depth0,'indent': depth0,'language': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "code-snippet", options))));
    data.buffer.push("\n				</div>\n			</div>\n		</div>\n	</div>\n");
    return buffer;
    }

    stack1 = (helper = helpers['element-highlighter'] || (depth0 && depth0['element-highlighter']),options={hash:{
      'data': ("highlightData.create")
    },hashTypes:{'data': "ID"},hashContexts:{'data': depth0},inverse:self.noop,fn:self.program(1, program1, data),contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "element-highlighter", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    else { data.buffer.push(''); }
    
  });

});
define('meme-gen-tutorial/templates/spec/edit-route', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var stack1, helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, self=this;

  function program1(depth0,data) {
    
    var buffer = '', helper, options;
    data.buffer.push("\n	<div class=\"panel panel-default\">\n		<div class=\"panel-heading\"><h3 class=\"panel-title\">/memes/:meme_id/edit</h3></div>\n		<div class='panel-body'>\n			<div class='row'>\n				<div class=\"col-xs-6 frame\" style=\"zoom:0.5\">\n					");
    data.buffer.push(escapeExpression((helper = helpers.partial || (depth0 && depth0.partial),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "frames/edit", options) : helperMissing.call(depth0, "partial", "frames/edit", options))));
    data.buffer.push("\n				</div>\n				<div class=\"col-xs-6\">\n					");
    data.buffer.push(escapeExpression((helper = helpers['code-snippet'] || (depth0 && depth0['code-snippet']),options={hash:{
      'name': ("edit.html"),
      'indent': (false),
      'language': ("html")
    },hashTypes:{'name': "STRING",'indent': "BOOLEAN",'language': "STRING"},hashContexts:{'name': depth0,'indent': depth0,'language': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "code-snippet", options))));
    data.buffer.push("\n				</div>\n			</div>\n		</div>\n	</div>\n");
    return buffer;
    }

    stack1 = (helper = helpers['element-highlighter'] || (depth0 && depth0['element-highlighter']),options={hash:{
      'data': ("highlightData.edit")
    },hashTypes:{'data': "ID"},hashContexts:{'data': depth0},inverse:self.noop,fn:self.program(1, program1, data),contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "element-highlighter", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    else { data.buffer.push(''); }
    
  });

});
define('meme-gen-tutorial/templates/spec/index', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1;


    stack1 = helpers._triageMustache.call(depth0, "outlet", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n");
    return buffer;
    
  });

});
define('meme-gen-tutorial/templates/spec/meme-item', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1, helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, self=this;

  function program1(depth0,data) {
    
    var buffer = '', helper, options;
    data.buffer.push("\n			<div class=\"panel panel-default\">\n				<div class=\"panel-heading\"><h3 class=\"panel-title\">Not Editable</h3></div>\n				<div class='panel-body'>\n					<div class='row'>\n						<div class=\"col-xs-6 frame\" style=\"zoom:0.7;\">\n							");
    data.buffer.push(escapeExpression((helper = helpers.partial || (depth0 && depth0.partial),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "frames/meme-item", options) : helperMissing.call(depth0, "partial", "frames/meme-item", options))));
    data.buffer.push("\n						</div>\n						<div class=\"col-xs-6\">\n							");
    data.buffer.push(escapeExpression((helper = helpers['code-snippet'] || (depth0 && depth0['code-snippet']),options={hash:{
      'name': ("meme-item.html"),
      'indent': (false),
      'language': ("html")
    },hashTypes:{'name': "STRING",'indent': "BOOLEAN",'language': "STRING"},hashContexts:{'name': depth0,'indent': depth0,'language': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "code-snippet", options))));
    data.buffer.push("\n						</div>\n					</div>\n				</div>\n			</div>\n		");
    return buffer;
    }

  function program3(depth0,data) {
    
    var buffer = '', helper, options;
    data.buffer.push("\n			<div class=\"panel panel-default\">\n				<div class=\"panel-heading\"><h3 class=\"panel-title\">Editable</h3></div>\n				<div class='panel-body'>\n					<div class='row'>\n						<div class=\"col-xs-6 frame\" style=\"zoom:0.7;\">\n							");
    data.buffer.push(escapeExpression((helper = helpers.partial || (depth0 && depth0.partial),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "frames/meme-item-editable", options) : helperMissing.call(depth0, "partial", "frames/meme-item-editable", options))));
    data.buffer.push("\n						</div>\n						<div class=\"col-xs-6\">\n							");
    data.buffer.push(escapeExpression((helper = helpers['code-snippet'] || (depth0 && depth0['code-snippet']),options={hash:{
      'name': ("meme-item-editable.html"),
      'indent': (false),
      'language': ("html")
    },hashTypes:{'name': "STRING",'indent': "BOOLEAN",'language': "STRING"},hashContexts:{'name': depth0,'indent': depth0,'language': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "code-snippet", options))));
    data.buffer.push("\n						</div>\n					</div>\n				</div>\n			</div>\n		");
    return buffer;
    }

    data.buffer.push("<div class=\"panel panel-default\">\n	<div class=\"panel-heading\"><h3 class=\"panel-title\">meme-item Component</h3></div>\n	<div class='panel-body'>\n		");
    stack1 = (helper = helpers['element-highlighter'] || (depth0 && depth0['element-highlighter']),options={hash:{
      'data': ("highlightData.memeItem")
    },hashTypes:{'data': "ID"},hashContexts:{'data': depth0},inverse:self.noop,fn:self.program(1, program1, data),contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "element-highlighter", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n		");
    stack1 = (helper = helpers['element-highlighter'] || (depth0 && depth0['element-highlighter']),options={hash:{
      'data': ("highlightData.memeItem")
    },hashTypes:{'data': "ID"},hashContexts:{'data': depth0},inverse:self.noop,fn:self.program(3, program3, data),contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "element-highlighter", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n	</div>\n</div>");
    return buffer;
    
  });

});
define('meme-gen-tutorial/templates/spec/meme-list-item', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1, helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, self=this;

  function program1(depth0,data) {
    
    var buffer = '', helper, options;
    data.buffer.push("\n			<div class=\"panel panel-default\">\n				<div class=\"panel-heading\"><h3 class=\"panel-title\">Does not belong to current user; Not liked by current user</h3></div>\n				<div class='panel-body'>\n					<div class='row'>\n						<div class=\"col-xs-6 frame\" style=\"zoom:0.7;\">\n							");
    data.buffer.push(escapeExpression((helper = helpers.partial || (depth0 && depth0.partial),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "frames/meme-list-item-of-another", options) : helperMissing.call(depth0, "partial", "frames/meme-list-item-of-another", options))));
    data.buffer.push("\n						</div>\n						<div class=\"col-xs-6\">\n							");
    data.buffer.push(escapeExpression((helper = helpers['code-snippet'] || (depth0 && depth0['code-snippet']),options={hash:{
      'name': ("meme-list-item-of-another.html"),
      'indent': (false),
      'language': ("html")
    },hashTypes:{'name': "STRING",'indent': "BOOLEAN",'language': "STRING"},hashContexts:{'name': depth0,'indent': depth0,'language': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "code-snippet", options))));
    data.buffer.push("\n						</div>\n					</div>\n				</div>\n			</div>\n		");
    return buffer;
    }

  function program3(depth0,data) {
    
    var buffer = '', helper, options;
    data.buffer.push("\n			<div class=\"panel panel-default\">\n				<div class=\"panel-heading\"><h3 class=\"panel-title\">Belongs to current user; Not liked by current user</h3></div>\n				<div class='panel-body'>\n					<div class='row'>\n						<div class=\"col-xs-6 frame\" style=\"zoom:0.7;\">\n							");
    data.buffer.push(escapeExpression((helper = helpers.partial || (depth0 && depth0.partial),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "frames/meme-list-item", options) : helperMissing.call(depth0, "partial", "frames/meme-list-item", options))));
    data.buffer.push("\n						</div>\n						<div class=\"col-xs-6\">\n							");
    data.buffer.push(escapeExpression((helper = helpers['code-snippet'] || (depth0 && depth0['code-snippet']),options={hash:{
      'name': ("meme-list-item.html"),
      'indent': (false),
      'language': ("html")
    },hashTypes:{'name': "STRING",'indent': "BOOLEAN",'language': "STRING"},hashContexts:{'name': depth0,'indent': depth0,'language': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "code-snippet", options))));
    data.buffer.push("\n						</div>\n					</div>\n				</div>\n			</div>\n		");
    return buffer;
    }

  function program5(depth0,data) {
    
    var buffer = '', helper, options;
    data.buffer.push("\n			<div class=\"panel panel-default\">\n				<div class=\"panel-heading\"><h3 class=\"panel-title\">Belongs to current user; Liked by current user</h3></div>\n				<div class='panel-body'>\n					<div class='row'>\n						<div class=\"col-xs-6 frame\" style=\"zoom:0.7;\">\n							");
    data.buffer.push(escapeExpression((helper = helpers.partial || (depth0 && depth0.partial),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "frames/meme-list-item-liked", options) : helperMissing.call(depth0, "partial", "frames/meme-list-item-liked", options))));
    data.buffer.push("\n						</div>\n						<div class=\"col-xs-6\">\n							");
    data.buffer.push(escapeExpression((helper = helpers['code-snippet'] || (depth0 && depth0['code-snippet']),options={hash:{
      'name': ("meme-list-item-liked.html"),
      'indent': (false),
      'language': ("html")
    },hashTypes:{'name': "STRING",'indent': "BOOLEAN",'language': "STRING"},hashContexts:{'name': depth0,'indent': depth0,'language': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "code-snippet", options))));
    data.buffer.push("\n						</div>\n					</div>\n				</div>\n			</div>\n		");
    return buffer;
    }

    data.buffer.push("<div class=\"panel panel-default\">\n	<div class=\"panel-heading\"><h3 class=\"panel-title\">meme-list-item Component</h3></div>\n	<div class='panel-body'>\n		");
    stack1 = (helper = helpers['element-highlighter'] || (depth0 && depth0['element-highlighter']),options={hash:{
      'data': ("highlightData.ownedByAnother")
    },hashTypes:{'data': "ID"},hashContexts:{'data': depth0},inverse:self.noop,fn:self.program(1, program1, data),contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "element-highlighter", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n		");
    stack1 = (helper = helpers['element-highlighter'] || (depth0 && depth0['element-highlighter']),options={hash:{
      'data': ("highlightData.ownedByCurrentUser")
    },hashTypes:{'data': "ID"},hashContexts:{'data': depth0},inverse:self.noop,fn:self.program(3, program3, data),contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "element-highlighter", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n		");
    stack1 = (helper = helpers['element-highlighter'] || (depth0 && depth0['element-highlighter']),options={hash:{
      'data': ("highlightData.ownedByCurrentUser")
    },hashTypes:{'data': "ID"},hashContexts:{'data': depth0},inverse:self.noop,fn:self.program(5, program5, data),contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "element-highlighter", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n	</div>\n</div>");
    return buffer;
    
  });

});
define('meme-gen-tutorial/templates/spec/memes-route', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var stack1, helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, self=this;

  function program1(depth0,data) {
    
    var buffer = '', helper, options;
    data.buffer.push("\n	<div class=\"panel panel-default\">\n		<div class=\"panel-heading\"><h3 class=\"panel-title\">/memes</h3></div>\n		<div class='panel-body'>\n			<div class='row'>\n				<div class=\"col-xs-6 frame\" style=\"zoom: 0.4\">\n					");
    data.buffer.push(escapeExpression((helper = helpers.partial || (depth0 && depth0.partial),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "frames/memes", options) : helperMissing.call(depth0, "partial", "frames/memes", options))));
    data.buffer.push("\n				</div>\n				<div class=\"col-xs-6\">\n					");
    data.buffer.push(escapeExpression((helper = helpers['code-snippet'] || (depth0 && depth0['code-snippet']),options={hash:{
      'name': ("memes.html"),
      'indent': (false),
      'language': ("html")
    },hashTypes:{'name': "STRING",'indent': "BOOLEAN",'language': "STRING"},hashContexts:{'name': depth0,'indent': depth0,'language': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "code-snippet", options))));
    data.buffer.push("\n				</div>\n			</div>\n		</div>\n	</div>\n");
    return buffer;
    }

    stack1 = (helper = helpers['element-highlighter'] || (depth0 && depth0['element-highlighter']),options={hash:{
      'data': ("highlightData.memes")
    },hashTypes:{'data': "ID"},hashContexts:{'data': depth0},inverse:self.noop,fn:self.program(1, program1, data),contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "element-highlighter", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    else { data.buffer.push(''); }
    
  });

});
define('meme-gen-tutorial/templates/spec/user-filter-toggler', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1, helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, self=this;

  function program1(depth0,data) {
    
    var buffer = '', helper, options;
    data.buffer.push("\n			<div class=\"panel panel-default\">\n				<div class=\"panel-heading\"><h3 class=\"panel-title\">Not Selected</h3></div>\n				<div class='panel-body'>\n					<div class='row'>\n						<div class=\"col-xs-6 frame\">\n							");
    data.buffer.push(escapeExpression((helper = helpers.partial || (depth0 && depth0.partial),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "frames/user-filter-toggler", options) : helperMissing.call(depth0, "partial", "frames/user-filter-toggler", options))));
    data.buffer.push("\n						</div>\n						<div class=\"col-xs-6\">\n							");
    data.buffer.push(escapeExpression((helper = helpers['code-snippet'] || (depth0 && depth0['code-snippet']),options={hash:{
      'name': ("user-filter-toggler.html"),
      'indent': (false),
      'language': ("html")
    },hashTypes:{'name': "STRING",'indent': "BOOLEAN",'language': "STRING"},hashContexts:{'name': depth0,'indent': depth0,'language': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "code-snippet", options))));
    data.buffer.push("\n						</div>\n					</div>\n				</div>\n			</div>\n		");
    return buffer;
    }

  function program3(depth0,data) {
    
    var buffer = '', helper, options;
    data.buffer.push("\n			<div class=\"panel panel-default\">\n				<div class=\"panel-heading\"><h3 class=\"panel-title\">Selected</h3></div>\n				<div class='panel-body'>\n					<div class='row'>\n						<div class=\"col-xs-6 frame\">\n							");
    data.buffer.push(escapeExpression((helper = helpers.partial || (depth0 && depth0.partial),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "frames/user-filter-toggler-selected", options) : helperMissing.call(depth0, "partial", "frames/user-filter-toggler-selected", options))));
    data.buffer.push("\n						</div>\n						<div class=\"col-xs-6\">\n							");
    data.buffer.push(escapeExpression((helper = helpers['code-snippet'] || (depth0 && depth0['code-snippet']),options={hash:{
      'name': ("user-filter-toggler-selected.html"),
      'indent': (false),
      'language': ("html")
    },hashTypes:{'name': "STRING",'indent': "BOOLEAN",'language': "STRING"},hashContexts:{'name': depth0,'indent': depth0,'language': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "code-snippet", options))));
    data.buffer.push("\n						</div>\n					</div>\n				</div>\n			</div>\n		");
    return buffer;
    }

    data.buffer.push("<div class=\"panel panel-default\">\n	<div class=\"panel-heading\"><h3 class=\"panel-title\">user-filter-toggler Component</h3></div>\n	<div class='panel-body'>\n		");
    stack1 = (helper = helpers['element-highlighter'] || (depth0 && depth0['element-highlighter']),options={hash:{
      'data': ("highlightData.userFilterToggler")
    },hashTypes:{'data': "ID"},hashContexts:{'data': depth0},inverse:self.noop,fn:self.program(1, program1, data),contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "element-highlighter", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n		");
    stack1 = (helper = helpers['element-highlighter'] || (depth0 && depth0['element-highlighter']),options={hash:{
      'data': ("highlightData.userFilterToggler")
    },hashTypes:{'data': "ID"},hashContexts:{'data': depth0},inverse:self.noop,fn:self.program(3, program3, data),contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "element-highlighter", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n	</div>\n</div>");
    return buffer;
    
  });

});
define('meme-gen-tutorial/templates/users-filter', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, self=this;

  function program1(depth0,data) {
    
    var helper, options;
    data.buffer.push(escapeExpression((helper = helpers['user-filter-toggler'] || (depth0 && depth0['user-filter-toggler']),options={hash:{
      'tagName': ("div"),
      'content': ("user"),
      'toggleUser': ("toggleUser"),
      'selected': ("user.selected")
    },hashTypes:{'tagName': "STRING",'content': "ID",'toggleUser': "STRING",'selected': "ID"},hashContexts:{'tagName': depth0,'content': depth0,'toggleUser': depth0,'selected': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "user-filter-toggler", options))));
    }

    data.buffer.push("<div class=\"users\">\n	<div class=\"panel panel-default\">\n		<div class=\"panel-heading\">\n			Filter by Users\n		</div>\n		<div class=\"panel-body\">\n			");
    stack1 = helpers.each.call(depth0, "user", "in", "usersToFilterBy", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n		</div>\n	</div>\n</div>");
    return buffer;
    
  });

});
define('meme-gen-tutorial/tests/adapters/application.jshint', function () {

  'use strict';

  module('JSHint - adapters');
  test('adapters/application.js should pass jshint', function() { 
    ok(true, 'adapters/application.js should pass jshint.'); 
  });

});
define('meme-gen-tutorial/tests/app.jshint', function () {

  'use strict';

  module('JSHint - .');
  test('app.js should pass jshint', function() { 
    ok(true, 'app.js should pass jshint.'); 
  });

});
define('meme-gen-tutorial/tests/components/element-highlighter.jshint', function () {

  'use strict';

  module('JSHint - components');
  test('components/element-highlighter.js should pass jshint', function() { 
    ok(true, 'components/element-highlighter.js should pass jshint.'); 
  });

});
define('meme-gen-tutorial/tests/components/meme-item.jshint', function () {

  'use strict';

  module('JSHint - components');
  test('components/meme-item.js should pass jshint', function() { 
    ok(true, 'components/meme-item.js should pass jshint.'); 
  });

});
define('meme-gen-tutorial/tests/components/meme-list-item.jshint', function () {

  'use strict';

  module('JSHint - components');
  test('components/meme-list-item.js should pass jshint', function() { 
    ok(true, 'components/meme-list-item.js should pass jshint.'); 
  });

});
define('meme-gen-tutorial/tests/components/user-filter-toggler.jshint', function () {

  'use strict';

  module('JSHint - components');
  test('components/user-filter-toggler.js should pass jshint', function() { 
    ok(true, 'components/user-filter-toggler.js should pass jshint.'); 
  });

});
define('meme-gen-tutorial/tests/controllers/meme/edit.jshint', function () {

  'use strict';

  module('JSHint - controllers/meme');
  test('controllers/meme/edit.js should pass jshint', function() { 
    ok(true, 'controllers/meme/edit.js should pass jshint.'); 
  });

});
define('meme-gen-tutorial/tests/controllers/memes/create.jshint', function () {

  'use strict';

  module('JSHint - controllers/memes');
  test('controllers/memes/create.js should pass jshint', function() { 
    ok(true, 'controllers/memes/create.js should pass jshint.'); 
  });

});
define('meme-gen-tutorial/tests/controllers/memes/index.jshint', function () {

  'use strict';

  module('JSHint - controllers/memes');
  test('controllers/memes/index.js should pass jshint', function() { 
    ok(true, 'controllers/memes/index.js should pass jshint.'); 
  });

});
define('meme-gen-tutorial/tests/controllers/spec.jshint', function () {

  'use strict';

  module('JSHint - controllers');
  test('controllers/spec.js should pass jshint', function() { 
    ok(true, 'controllers/spec.js should pass jshint.'); 
  });

});
define('meme-gen-tutorial/tests/controllers/spec/create-route.jshint', function () {

  'use strict';

  module('JSHint - controllers/spec');
  test('controllers/spec/create-route.js should pass jshint', function() { 
    ok(true, 'controllers/spec/create-route.js should pass jshint.'); 
  });

});
define('meme-gen-tutorial/tests/controllers/spec/edit-route.jshint', function () {

  'use strict';

  module('JSHint - controllers/spec');
  test('controllers/spec/edit-route.js should pass jshint', function() { 
    ok(true, 'controllers/spec/edit-route.js should pass jshint.'); 
  });

});
define('meme-gen-tutorial/tests/controllers/spec/meme-item.jshint', function () {

  'use strict';

  module('JSHint - controllers/spec');
  test('controllers/spec/meme-item.js should pass jshint', function() { 
    ok(true, 'controllers/spec/meme-item.js should pass jshint.'); 
  });

});
define('meme-gen-tutorial/tests/controllers/spec/meme-list-item.jshint', function () {

  'use strict';

  module('JSHint - controllers/spec');
  test('controllers/spec/meme-list-item.js should pass jshint', function() { 
    ok(true, 'controllers/spec/meme-list-item.js should pass jshint.'); 
  });

});
define('meme-gen-tutorial/tests/controllers/spec/memes-route.jshint', function () {

  'use strict';

  module('JSHint - controllers/spec');
  test('controllers/spec/memes-route.js should pass jshint', function() { 
    ok(true, 'controllers/spec/memes-route.js should pass jshint.'); 
  });

});
define('meme-gen-tutorial/tests/controllers/spec/user-filter-toggler.jshint', function () {

  'use strict';

  module('JSHint - controllers/spec');
  test('controllers/spec/user-filter-toggler.js should pass jshint', function() { 
    ok(true, 'controllers/spec/user-filter-toggler.js should pass jshint.'); 
  });

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
define('meme-gen-tutorial/tests/initializers/current-user.jshint', function () {

  'use strict';

  module('JSHint - initializers');
  test('initializers/current-user.js should pass jshint', function() { 
    ok(true, 'initializers/current-user.js should pass jshint.'); 
  });

});
define('meme-gen-tutorial/tests/initializers/meme-route-fixer.jshint', function () {

  'use strict';

  module('JSHint - initializers');
  test('initializers/meme-route-fixer.js should pass jshint', function() { 
    ok(true, 'initializers/meme-route-fixer.js should pass jshint.'); 
  });

});
define('meme-gen-tutorial/tests/meme-gen-tutorial/tests/helpers/resolver.jshint', function () {

  'use strict';

  module('JSHint - meme-gen-tutorial/tests/helpers');
  test('meme-gen-tutorial/tests/helpers/resolver.js should pass jshint', function() { 
    ok(true, 'meme-gen-tutorial/tests/helpers/resolver.js should pass jshint.'); 
  });

});
define('meme-gen-tutorial/tests/meme-gen-tutorial/tests/helpers/start-app.jshint', function () {

  'use strict';

  module('JSHint - meme-gen-tutorial/tests/helpers');
  test('meme-gen-tutorial/tests/helpers/start-app.js should pass jshint', function() { 
    ok(true, 'meme-gen-tutorial/tests/helpers/start-app.js should pass jshint.'); 
  });

});
define('meme-gen-tutorial/tests/meme-gen-tutorial/tests/test-helper.jshint', function () {

  'use strict';

  module('JSHint - meme-gen-tutorial/tests');
  test('meme-gen-tutorial/tests/test-helper.js should pass jshint', function() { 
    ok(true, 'meme-gen-tutorial/tests/test-helper.js should pass jshint.'); 
  });

});
define('meme-gen-tutorial/tests/meme-gen-tutorial/tests/unit/adapters/application-test.jshint', function () {

  'use strict';

  module('JSHint - meme-gen-tutorial/tests/unit/adapters');
  test('meme-gen-tutorial/tests/unit/adapters/application-test.js should pass jshint', function() { 
    ok(true, 'meme-gen-tutorial/tests/unit/adapters/application-test.js should pass jshint.'); 
  });

});
define('meme-gen-tutorial/tests/meme-gen-tutorial/tests/unit/components/element-highlighter-test.jshint', function () {

  'use strict';

  module('JSHint - meme-gen-tutorial/tests/unit/components');
  test('meme-gen-tutorial/tests/unit/components/element-highlighter-test.js should pass jshint', function() { 
    ok(true, 'meme-gen-tutorial/tests/unit/components/element-highlighter-test.js should pass jshint.'); 
  });

});
define('meme-gen-tutorial/tests/meme-gen-tutorial/tests/unit/components/meme-item-test.jshint', function () {

  'use strict';

  module('JSHint - meme-gen-tutorial/tests/unit/components');
  test('meme-gen-tutorial/tests/unit/components/meme-item-test.js should pass jshint', function() { 
    ok(true, 'meme-gen-tutorial/tests/unit/components/meme-item-test.js should pass jshint.'); 
  });

});
define('meme-gen-tutorial/tests/meme-gen-tutorial/tests/unit/components/meme-list-item-test.jshint', function () {

  'use strict';

  module('JSHint - meme-gen-tutorial/tests/unit/components');
  test('meme-gen-tutorial/tests/unit/components/meme-list-item-test.js should pass jshint', function() { 
    ok(true, 'meme-gen-tutorial/tests/unit/components/meme-list-item-test.js should pass jshint.'); 
  });

});
define('meme-gen-tutorial/tests/meme-gen-tutorial/tests/unit/components/user-filter-toggler-test.jshint', function () {

  'use strict';

  module('JSHint - meme-gen-tutorial/tests/unit/components');
  test('meme-gen-tutorial/tests/unit/components/user-filter-toggler-test.js should pass jshint', function() { 
    ok(true, 'meme-gen-tutorial/tests/unit/components/user-filter-toggler-test.js should pass jshint.'); 
  });

});
define('meme-gen-tutorial/tests/meme-gen-tutorial/tests/unit/controllers/meme/edit-test.jshint', function () {

  'use strict';

  module('JSHint - meme-gen-tutorial/tests/unit/controllers/meme');
  test('meme-gen-tutorial/tests/unit/controllers/meme/edit-test.js should pass jshint', function() { 
    ok(true, 'meme-gen-tutorial/tests/unit/controllers/meme/edit-test.js should pass jshint.'); 
  });

});
define('meme-gen-tutorial/tests/meme-gen-tutorial/tests/unit/controllers/memes/create-test.jshint', function () {

  'use strict';

  module('JSHint - meme-gen-tutorial/tests/unit/controllers/memes');
  test('meme-gen-tutorial/tests/unit/controllers/memes/create-test.js should pass jshint', function() { 
    ok(true, 'meme-gen-tutorial/tests/unit/controllers/memes/create-test.js should pass jshint.'); 
  });

});
define('meme-gen-tutorial/tests/meme-gen-tutorial/tests/unit/controllers/memes/index-test.jshint', function () {

  'use strict';

  module('JSHint - meme-gen-tutorial/tests/unit/controllers/memes');
  test('meme-gen-tutorial/tests/unit/controllers/memes/index-test.js should pass jshint', function() { 
    ok(true, 'meme-gen-tutorial/tests/unit/controllers/memes/index-test.js should pass jshint.'); 
  });

});
define('meme-gen-tutorial/tests/meme-gen-tutorial/tests/unit/controllers/spec-test.jshint', function () {

  'use strict';

  module('JSHint - meme-gen-tutorial/tests/unit/controllers');
  test('meme-gen-tutorial/tests/unit/controllers/spec-test.js should pass jshint', function() { 
    ok(true, 'meme-gen-tutorial/tests/unit/controllers/spec-test.js should pass jshint.'); 
  });

});
define('meme-gen-tutorial/tests/meme-gen-tutorial/tests/unit/controllers/spec/create-route-test.jshint', function () {

  'use strict';

  module('JSHint - meme-gen-tutorial/tests/unit/controllers/spec');
  test('meme-gen-tutorial/tests/unit/controllers/spec/create-route-test.js should pass jshint', function() { 
    ok(true, 'meme-gen-tutorial/tests/unit/controllers/spec/create-route-test.js should pass jshint.'); 
  });

});
define('meme-gen-tutorial/tests/meme-gen-tutorial/tests/unit/controllers/spec/edit-route-test.jshint', function () {

  'use strict';

  module('JSHint - meme-gen-tutorial/tests/unit/controllers/spec');
  test('meme-gen-tutorial/tests/unit/controllers/spec/edit-route-test.js should pass jshint', function() { 
    ok(true, 'meme-gen-tutorial/tests/unit/controllers/spec/edit-route-test.js should pass jshint.'); 
  });

});
define('meme-gen-tutorial/tests/meme-gen-tutorial/tests/unit/controllers/spec/meme-item-test.jshint', function () {

  'use strict';

  module('JSHint - meme-gen-tutorial/tests/unit/controllers/spec');
  test('meme-gen-tutorial/tests/unit/controllers/spec/meme-item-test.js should pass jshint', function() { 
    ok(true, 'meme-gen-tutorial/tests/unit/controllers/spec/meme-item-test.js should pass jshint.'); 
  });

});
define('meme-gen-tutorial/tests/meme-gen-tutorial/tests/unit/controllers/spec/meme-list-item-test.jshint', function () {

  'use strict';

  module('JSHint - meme-gen-tutorial/tests/unit/controllers/spec');
  test('meme-gen-tutorial/tests/unit/controllers/spec/meme-list-item-test.js should pass jshint', function() { 
    ok(true, 'meme-gen-tutorial/tests/unit/controllers/spec/meme-list-item-test.js should pass jshint.'); 
  });

});
define('meme-gen-tutorial/tests/meme-gen-tutorial/tests/unit/controllers/spec/memes-route-test.jshint', function () {

  'use strict';

  module('JSHint - meme-gen-tutorial/tests/unit/controllers/spec');
  test('meme-gen-tutorial/tests/unit/controllers/spec/memes-route-test.js should pass jshint', function() { 
    ok(true, 'meme-gen-tutorial/tests/unit/controllers/spec/memes-route-test.js should pass jshint.'); 
  });

});
define('meme-gen-tutorial/tests/meme-gen-tutorial/tests/unit/controllers/spec/user-filter-toggler-test.jshint', function () {

  'use strict';

  module('JSHint - meme-gen-tutorial/tests/unit/controllers/spec');
  test('meme-gen-tutorial/tests/unit/controllers/spec/user-filter-toggler-test.js should pass jshint', function() { 
    ok(true, 'meme-gen-tutorial/tests/unit/controllers/spec/user-filter-toggler-test.js should pass jshint.'); 
  });

});
define('meme-gen-tutorial/tests/meme-gen-tutorial/tests/unit/initializers/current-user-test.jshint', function () {

  'use strict';

  module('JSHint - meme-gen-tutorial/tests/unit/initializers');
  test('meme-gen-tutorial/tests/unit/initializers/current-user-test.js should pass jshint', function() { 
    ok(true, 'meme-gen-tutorial/tests/unit/initializers/current-user-test.js should pass jshint.'); 
  });

});
define('meme-gen-tutorial/tests/meme-gen-tutorial/tests/unit/initializers/meme-route-fixer-test.jshint', function () {

  'use strict';

  module('JSHint - meme-gen-tutorial/tests/unit/initializers');
  test('meme-gen-tutorial/tests/unit/initializers/meme-route-fixer-test.js should pass jshint', function() { 
    ok(true, 'meme-gen-tutorial/tests/unit/initializers/meme-route-fixer-test.js should pass jshint.'); 
  });

});
define('meme-gen-tutorial/tests/meme-gen-tutorial/tests/unit/mixins/spec-controller-test.jshint', function () {

  'use strict';

  module('JSHint - meme-gen-tutorial/tests/unit/mixins');
  test('meme-gen-tutorial/tests/unit/mixins/spec-controller-test.js should pass jshint', function() { 
    ok(true, 'meme-gen-tutorial/tests/unit/mixins/spec-controller-test.js should pass jshint.'); 
  });

});
define('meme-gen-tutorial/tests/meme-gen-tutorial/tests/unit/models/meme-test.jshint', function () {

  'use strict';

  module('JSHint - meme-gen-tutorial/tests/unit/models');
  test('meme-gen-tutorial/tests/unit/models/meme-test.js should pass jshint', function() { 
    ok(true, 'meme-gen-tutorial/tests/unit/models/meme-test.js should pass jshint.'); 
  });

});
define('meme-gen-tutorial/tests/meme-gen-tutorial/tests/unit/models/user-test.jshint', function () {

  'use strict';

  module('JSHint - meme-gen-tutorial/tests/unit/models');
  test('meme-gen-tutorial/tests/unit/models/user-test.js should pass jshint', function() { 
    ok(true, 'meme-gen-tutorial/tests/unit/models/user-test.js should pass jshint.'); 
  });

});
define('meme-gen-tutorial/tests/meme-gen-tutorial/tests/unit/routes/index-test.jshint', function () {

  'use strict';

  module('JSHint - meme-gen-tutorial/tests/unit/routes');
  test('meme-gen-tutorial/tests/unit/routes/index-test.js should pass jshint', function() { 
    ok(true, 'meme-gen-tutorial/tests/unit/routes/index-test.js should pass jshint.'); 
  });

});
define('meme-gen-tutorial/tests/meme-gen-tutorial/tests/unit/routes/meme/edit-test.jshint', function () {

  'use strict';

  module('JSHint - meme-gen-tutorial/tests/unit/routes/meme');
  test('meme-gen-tutorial/tests/unit/routes/meme/edit-test.js should pass jshint', function() { 
    ok(true, 'meme-gen-tutorial/tests/unit/routes/meme/edit-test.js should pass jshint.'); 
  });

});
define('meme-gen-tutorial/tests/meme-gen-tutorial/tests/unit/routes/memes-test.jshint', function () {

  'use strict';

  module('JSHint - meme-gen-tutorial/tests/unit/routes');
  test('meme-gen-tutorial/tests/unit/routes/memes-test.js should pass jshint', function() { 
    ok(true, 'meme-gen-tutorial/tests/unit/routes/memes-test.js should pass jshint.'); 
  });

});
define('meme-gen-tutorial/tests/meme-gen-tutorial/tests/unit/routes/memes/create-test.jshint', function () {

  'use strict';

  module('JSHint - meme-gen-tutorial/tests/unit/routes/memes');
  test('meme-gen-tutorial/tests/unit/routes/memes/create-test.js should pass jshint', function() { 
    ok(true, 'meme-gen-tutorial/tests/unit/routes/memes/create-test.js should pass jshint.'); 
  });

});
define('meme-gen-tutorial/tests/meme-gen-tutorial/tests/unit/routes/memes/index-test.jshint', function () {

  'use strict';

  module('JSHint - meme-gen-tutorial/tests/unit/routes/memes');
  test('meme-gen-tutorial/tests/unit/routes/memes/index-test.js should pass jshint', function() { 
    ok(true, 'meme-gen-tutorial/tests/unit/routes/memes/index-test.js should pass jshint.'); 
  });

});
define('meme-gen-tutorial/tests/meme-gen-tutorial/tests/unit/routes/spec-test.jshint', function () {

  'use strict';

  module('JSHint - meme-gen-tutorial/tests/unit/routes');
  test('meme-gen-tutorial/tests/unit/routes/spec-test.js should pass jshint', function() { 
    ok(true, 'meme-gen-tutorial/tests/unit/routes/spec-test.js should pass jshint.'); 
  });

});
define('meme-gen-tutorial/tests/meme-gen-tutorial/tests/unit/routes/spec/create-route-test.jshint', function () {

  'use strict';

  module('JSHint - meme-gen-tutorial/tests/unit/routes/spec');
  test('meme-gen-tutorial/tests/unit/routes/spec/create-route-test.js should pass jshint', function() { 
    ok(true, 'meme-gen-tutorial/tests/unit/routes/spec/create-route-test.js should pass jshint.'); 
  });

});
define('meme-gen-tutorial/tests/meme-gen-tutorial/tests/unit/routes/spec/edit-route-test.jshint', function () {

  'use strict';

  module('JSHint - meme-gen-tutorial/tests/unit/routes/spec');
  test('meme-gen-tutorial/tests/unit/routes/spec/edit-route-test.js should pass jshint', function() { 
    ok(true, 'meme-gen-tutorial/tests/unit/routes/spec/edit-route-test.js should pass jshint.'); 
  });

});
define('meme-gen-tutorial/tests/meme-gen-tutorial/tests/unit/routes/spec/index-test.jshint', function () {

  'use strict';

  module('JSHint - meme-gen-tutorial/tests/unit/routes/spec');
  test('meme-gen-tutorial/tests/unit/routes/spec/index-test.js should pass jshint', function() { 
    ok(true, 'meme-gen-tutorial/tests/unit/routes/spec/index-test.js should pass jshint.'); 
  });

});
define('meme-gen-tutorial/tests/meme-gen-tutorial/tests/unit/routes/spec/meme-item-test.jshint', function () {

  'use strict';

  module('JSHint - meme-gen-tutorial/tests/unit/routes/spec');
  test('meme-gen-tutorial/tests/unit/routes/spec/meme-item-test.js should pass jshint', function() { 
    ok(true, 'meme-gen-tutorial/tests/unit/routes/spec/meme-item-test.js should pass jshint.'); 
  });

});
define('meme-gen-tutorial/tests/meme-gen-tutorial/tests/unit/routes/spec/meme-list-item-test.jshint', function () {

  'use strict';

  module('JSHint - meme-gen-tutorial/tests/unit/routes/spec');
  test('meme-gen-tutorial/tests/unit/routes/spec/meme-list-item-test.js should pass jshint', function() { 
    ok(true, 'meme-gen-tutorial/tests/unit/routes/spec/meme-list-item-test.js should pass jshint.'); 
  });

});
define('meme-gen-tutorial/tests/meme-gen-tutorial/tests/unit/routes/spec/memes-route-test.jshint', function () {

  'use strict';

  module('JSHint - meme-gen-tutorial/tests/unit/routes/spec');
  test('meme-gen-tutorial/tests/unit/routes/spec/memes-route-test.js should pass jshint', function() { 
    ok(true, 'meme-gen-tutorial/tests/unit/routes/spec/memes-route-test.js should pass jshint.'); 
  });

});
define('meme-gen-tutorial/tests/meme-gen-tutorial/tests/unit/routes/spec/user-filter-toggler-test.jshint', function () {

  'use strict';

  module('JSHint - meme-gen-tutorial/tests/unit/routes/spec');
  test('meme-gen-tutorial/tests/unit/routes/spec/user-filter-toggler-test.js should pass jshint', function() { 
    ok(true, 'meme-gen-tutorial/tests/unit/routes/spec/user-filter-toggler-test.js should pass jshint.'); 
  });

});
define('meme-gen-tutorial/tests/meme-gen-tutorial/tests/unit/serializers/application-test.jshint', function () {

  'use strict';

  module('JSHint - meme-gen-tutorial/tests/unit/serializers');
  test('meme-gen-tutorial/tests/unit/serializers/application-test.js should pass jshint', function() { 
    ok(true, 'meme-gen-tutorial/tests/unit/serializers/application-test.js should pass jshint.'); 
  });

});
define('meme-gen-tutorial/tests/mixins/spec-controller.jshint', function () {

  'use strict';

  module('JSHint - mixins');
  test('mixins/spec-controller.js should pass jshint', function() { 
    ok(true, 'mixins/spec-controller.js should pass jshint.'); 
  });

});
define('meme-gen-tutorial/tests/models/meme.jshint', function () {

  'use strict';

  module('JSHint - models');
  test('models/meme.js should pass jshint', function() { 
    ok(true, 'models/meme.js should pass jshint.'); 
  });

});
define('meme-gen-tutorial/tests/models/user.jshint', function () {

  'use strict';

  module('JSHint - models');
  test('models/user.js should pass jshint', function() { 
    ok(true, 'models/user.js should pass jshint.'); 
  });

});
define('meme-gen-tutorial/tests/router.jshint', function () {

  'use strict';

  module('JSHint - .');
  test('router.js should pass jshint', function() { 
    ok(true, 'router.js should pass jshint.'); 
  });

});
define('meme-gen-tutorial/tests/routes/index.jshint', function () {

  'use strict';

  module('JSHint - routes');
  test('routes/index.js should pass jshint', function() { 
    ok(true, 'routes/index.js should pass jshint.'); 
  });

});
define('meme-gen-tutorial/tests/routes/meme/edit.jshint', function () {

  'use strict';

  module('JSHint - routes/meme');
  test('routes/meme/edit.js should pass jshint', function() { 
    ok(true, 'routes/meme/edit.js should pass jshint.'); 
  });

});
define('meme-gen-tutorial/tests/routes/memes.jshint', function () {

  'use strict';

  module('JSHint - routes');
  test('routes/memes.js should pass jshint', function() { 
    ok(true, 'routes/memes.js should pass jshint.'); 
  });

});
define('meme-gen-tutorial/tests/routes/memes/create.jshint', function () {

  'use strict';

  module('JSHint - routes/memes');
  test('routes/memes/create.js should pass jshint', function() { 
    ok(true, 'routes/memes/create.js should pass jshint.'); 
  });

});
define('meme-gen-tutorial/tests/routes/memes/index.jshint', function () {

  'use strict';

  module('JSHint - routes/memes');
  test('routes/memes/index.js should pass jshint', function() { 
    ok(true, 'routes/memes/index.js should pass jshint.'); 
  });

});
define('meme-gen-tutorial/tests/routes/spec.jshint', function () {

  'use strict';

  module('JSHint - routes');
  test('routes/spec.js should pass jshint', function() { 
    ok(true, 'routes/spec.js should pass jshint.'); 
  });

});
define('meme-gen-tutorial/tests/routes/spec/create-route.jshint', function () {

  'use strict';

  module('JSHint - routes/spec');
  test('routes/spec/create-route.js should pass jshint', function() { 
    ok(true, 'routes/spec/create-route.js should pass jshint.'); 
  });

});
define('meme-gen-tutorial/tests/routes/spec/edit-route.jshint', function () {

  'use strict';

  module('JSHint - routes/spec');
  test('routes/spec/edit-route.js should pass jshint', function() { 
    ok(true, 'routes/spec/edit-route.js should pass jshint.'); 
  });

});
define('meme-gen-tutorial/tests/routes/spec/index.jshint', function () {

  'use strict';

  module('JSHint - routes/spec');
  test('routes/spec/index.js should pass jshint', function() { 
    ok(true, 'routes/spec/index.js should pass jshint.'); 
  });

});
define('meme-gen-tutorial/tests/routes/spec/meme-item.jshint', function () {

  'use strict';

  module('JSHint - routes/spec');
  test('routes/spec/meme-item.js should pass jshint', function() { 
    ok(true, 'routes/spec/meme-item.js should pass jshint.'); 
  });

});
define('meme-gen-tutorial/tests/routes/spec/meme-list-item.jshint', function () {

  'use strict';

  module('JSHint - routes/spec');
  test('routes/spec/meme-list-item.js should pass jshint', function() { 
    ok(true, 'routes/spec/meme-list-item.js should pass jshint.'); 
  });

});
define('meme-gen-tutorial/tests/routes/spec/memes-route.jshint', function () {

  'use strict';

  module('JSHint - routes/spec');
  test('routes/spec/memes-route.js should pass jshint', function() { 
    ok(true, 'routes/spec/memes-route.js should pass jshint.'); 
  });

});
define('meme-gen-tutorial/tests/routes/spec/user-filter-toggler.jshint', function () {

  'use strict';

  module('JSHint - routes/spec');
  test('routes/spec/user-filter-toggler.js should pass jshint', function() { 
    ok(true, 'routes/spec/user-filter-toggler.js should pass jshint.'); 
  });

});
define('meme-gen-tutorial/tests/serializers/application.jshint', function () {

  'use strict';

  module('JSHint - serializers');
  test('serializers/application.js should pass jshint', function() { 
    ok(true, 'serializers/application.js should pass jshint.'); 
  });

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
define('meme-gen-tutorial/tests/unit/routes/memes/index-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("route:memes/index", "MemesIndexRoute", {});

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
  require("meme-gen-tutorial/app")["default"].create({});
}

/* jshint ignore:end */
//# sourceMappingURL=meme-gen-tutorial.map