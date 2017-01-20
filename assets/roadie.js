"use strict";

/* jshint ignore:start */



/* jshint ignore:end */

define('roadie/ajax/service', ['exports', 'ember', 'ember-ajax/services/ajax', 'roadie/config/environment'], function (exports, _ember, _emberAjaxServicesAjax, _roadieConfigEnvironment) {
  exports['default'] = _emberAjaxServicesAjax['default'].extend({
    host: _roadieConfigEnvironment['default'].apiHost,

    auth: _ember['default'].inject.service(),
    headers: _ember['default'].computed('auth.credentials.token', {
      get: function get() {
        var headers = {};
        var token = this.get('auth.credentials.token');
        if (token) {
          headers.Authorization = 'Token token=' + token;
        }

        return headers;
      }
    })
  });
});
define('roadie/app', ['exports', 'ember', 'roadie/resolver', 'ember-load-initializers', 'roadie/config/environment'], function (exports, _ember, _roadieResolver, _emberLoadInitializers, _roadieConfigEnvironment) {

  var App = undefined;

  _ember['default'].MODEL_FACTORY_INJECTIONS = true;

  App = _ember['default'].Application.extend({
    modulePrefix: _roadieConfigEnvironment['default'].modulePrefix,
    podModulePrefix: _roadieConfigEnvironment['default'].podModulePrefix,
    Resolver: _roadieResolver['default']
  });

  (0, _emberLoadInitializers['default'])(App, _roadieConfigEnvironment['default'].modulePrefix);

  exports['default'] = App;
});
define('roadie/application/adapter', ['exports', 'roadie/config/environment', 'active-model-adapter', 'ember'], function (exports, _roadieConfigEnvironment, _activeModelAdapter, _ember) {
  exports['default'] = _activeModelAdapter['default'].extend({
    host: _roadieConfigEnvironment['default'].apiHost,

    auth: _ember['default'].inject.service(),

    headers: _ember['default'].computed('auth.credentials.token', {
      get: function get() {
        var headers = {};
        var token = this.get('auth.credentials.token');
        if (token) {
          headers.Authorization = 'Token token=' + token;
        }

        return headers;
      }
    })
  });
});
define('roadie/application/route', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({
    auth: _ember['default'].inject.service(),
    flashMessages: _ember['default'].inject.service(),
    actions: {
      signOut: function signOut() {
        var _this = this;

        this.get('auth').signOut().then(function () {
          return _this.get('store').unloadAll();
        }).then(function () {
          return _this.transitionTo('sign-in');
        }).then(function () {
          _this.get('flashMessages').warning('You have been signed out.');
        })['catch'](function () {
          _this.get('flashMessages').danger('There was a problem. Are you sure you\'re signed-in?');
        });
      },

      error: function error(reason) {
        var unauthorized = reason.errors && reason.errors.some(function (error) {
          return error.status === '401';
        });

        if (unauthorized) {
          this.get('flashMessages').danger('You must be authenticated to access this page.');
          this.transitionTo('/sign-in');
        } else {
          console.error(reason);
          this.get('flashMessages').danger('There was a problem. Please try again.');
        }

        return false;
      }
    }
  });
});
define('roadie/application/serializer', ['exports', 'active-model-adapter'], function (exports, _activeModelAdapter) {
  exports['default'] = _activeModelAdapter.ActiveModelSerializer.extend({});
});
define("roadie/application/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "+emuzEgX", "block": "{\"statements\":[[\"append\",[\"helper\",[\"my-application\"],null,[[\"signOut\"],[\"signOut\"]]],false],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "roadie/application/template.hbs" } });
});
define('roadie/auth/service', ['exports', 'ember', 'ember-local-storage'], function (exports, _ember, _emberLocalStorage) {
  exports['default'] = _ember['default'].Service.extend({
    ajax: _ember['default'].inject.service(),
    credentials: (0, _emberLocalStorage.storageFor)('auth'),
    isAuthenticated: _ember['default'].computed.bool('credentials.token'),

    signUp: function signUp(credentials) {
      return this.get('ajax').post('/sign-up', {
        data: {
          credentials: {
            email: credentials.email,
            password: credentials.password,
            password_confirmation: credentials.passwordConfirmation
          }
        }
      });
    },

    signIn: function signIn(credentials) {
      var _this = this;

      return this.get('ajax').post('/sign-in', {
        data: {
          credentials: {
            email: credentials.email,
            password: credentials.password
          }
        }
      }).then(function (result) {
        _this.get('credentials').set('id', result.user.id);
        _this.get('credentials').set('email', result.user.email);
        _this.get('credentials').set('token', result.user.token);
      });
    },

    changePassword: function changePassword(passwords) {
      return this.get('ajax').patch('/change-password/' + this.get('credentials.id'), {
        data: {
          passwords: {
            old: passwords.previous,
            'new': passwords.next
          }
        }
      });
    },

    signOut: function signOut() {
      var _this2 = this;

      return this.get('ajax').del('/sign-out/' + this.get('credentials.id'))['finally'](function () {
        return _this2.get('credentials').reset();
      });
    }
  });
});
define('roadie/auth/storage', ['exports', 'ember-local-storage/local/object'], function (exports, _emberLocalStorageLocalObject) {
  exports['default'] = _emberLocalStorageLocalObject['default'].extend({});
});
define('roadie/band/contacts/new/route', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({
    model: function model(params) {
      return this.get('store').findRecord('band', params.band_id);
    },
    actions: {
      createContact: function createContact(newContact) {
        var _this = this;

        var contact = this.get('store').createRecord('contact', newContact);
        return contact.save().then(function () {
          return _this.get('flashMessages').success('Contact created, keep making connections!');
        }).then(function () {
          return _this.transitionTo('band', newContact.band);
        })['catch'](function () {
          _this.get('flashMessages').danger('Oh No! Something is not quite right. Make sure you have filled out required fields with the right format');
          contact.rollbackAttributes();
        });
      }
    }
  });
});
define("roadie/band/contacts/new/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "TKohtxws", "block": "{\"statements\":[[\"append\",[\"helper\",[\"contact-list\"],null,[[\"band\",\"createContact\"],[[\"get\",[\"model\"]],\"createContact\"]]],false],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "roadie/band/contacts/new/template.hbs" } });
});
define('roadie/band/contacts/route', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({
    model: function model(params) {
      return this.get('store').findRecord('band', params.band_id);
    },
    actions: {
      willTransition: function willTransition() {
        var store = this.get('store');
        store.peekAll('contact').forEach(function (contact) {
          if (contact.get('isNew') && contact.get('hasDirtyAttributes')) {
            contact.rollbackAttributes();
          }
        });
        return true;
      },

      deleteContact: function deleteContact(contact) {
        var band = contact.get('band');
        contact.destroyRecord();
        this.transitionTo('band', band);
        this.transitionTo('band/contacts', band);
      },
      editContact: function editContact(contact) {
        this.transitionTo('contacts/edit', contact);
      }
    }
  });
});
define("roadie/band/contacts/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "m3ZN4M/s", "block": "{\"statements\":[[\"text\",\"\\n\"],[\"block\",[\"link-to\"],[\"band/contacts/new\",[\"get\",[\"model\"]]],null,1],[\"text\",\"\\n\\n\"],[\"block\",[\"each\"],[[\"get\",[\"model\",\"contacts\"]]],null,0]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[{\"statements\":[[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"contact-info\"],[\"flush-element\"],[\"append\",[\"unknown\",[\"contact\",\"name\"]],false],[\"close-element\"],[\"text\",\"\\n\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"contact-info\"],[\"flush-element\"],[\"append\",[\"unknown\",[\"contact\",\"phone_number\"]],false],[\"close-element\"],[\"text\",\"\\n\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"contact-info\"],[\"flush-element\"],[\"append\",[\"unknown\",[\"contact\",\"email\"]],false],[\"close-element\"],[\"text\",\"\\n\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"contact-info\"],[\"flush-element\"],[\"append\",[\"unknown\",[\"contact\",\"company\"]],false],[\"close-element\"],[\"text\",\"\\n\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"contact-info\"],[\"flush-element\"],[\"append\",[\"unknown\",[\"contact\",\"details\"]],false],[\"close-element\"],[\"text\",\"\\n\"],[\"append\",[\"helper\",[\"contact-list/edit\"],null,[[\"contact\",\"delete\",\"edit\"],[[\"get\",[\"contact\"]],\"deleteContact\",\"editContact\"]]],false],[\"text\",\"\\n\\n\"]],\"locals\":[\"contact\"]},{\"statements\":[[\"text\",\"Add Contact \"]],\"locals\":[]}],\"hasPartials\":false}", "meta": { "moduleName": "roadie/band/contacts/template.hbs" } });
});
define('roadie/band/expenses/route', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({
    model: function model(params) {
      return this.get('store').findRecord('band', params.band_id);
    },
    actions: {
      createExpense: function createExpense(newExpense) {
        var _this = this;

        var expense = this.get('store').createRecord('expense', newExpense);
        return expense.save().then(function () {
          return _this.get('flashMessages').success('Expense created, remember to turn that into a profit!');
        })['catch'](function () {
          _this.get('flashMessages').danger('Oh No! Something is not quite right. Make sure you have filled out required fields with the right format. Estimates are okay!');
          expense.rollbackAttributes();
        });
      },
      editExpense: function editExpense(expense) {
        this.transitionTo('expenses/edit', expense);
      },
      deleteExpense: function deleteExpense(expense) {
        expense.destroyRecord();
      }
    }

  });
});
define("roadie/band/expenses/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "XOQeavNY", "block": "{\"statements\":[[\"append\",[\"helper\",[\"expense-list\"],null,[[\"band\",\"createExpense\"],[[\"get\",[\"model\"]],\"createExpense\"]]],false],[\"text\",\"\\n\\n\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"expense-header\"],[\"flush-element\"],[\"text\",\"Name\"],[\"close-element\"],[\"text\",\"\\n\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"expense-header\"],[\"flush-element\"],[\"text\",\"Cost\"],[\"close-element\"],[\"text\",\"\\n\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"expense-header\"],[\"flush-element\"],[\"text\",\"Description\"],[\"close-element\"],[\"text\",\"\\n\"],[\"open-element\",\"br\",[]],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n\"],[\"block\",[\"each\"],[[\"get\",[\"model\",\"expenses\"]]],null,0],[\"text\",\"\\n\"],[\"append\",[\"unknown\",[\"outlet\"]],false],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[{\"statements\":[[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"expense-info\"],[\"flush-element\"],[\"append\",[\"unknown\",[\"expense\",\"name\"]],false],[\"close-element\"],[\"text\",\"\\n\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"expense-info\"],[\"flush-element\"],[\"append\",[\"unknown\",[\"expense\",\"cost\"]],false],[\"close-element\"],[\"text\",\"\\n\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"expense-info\"],[\"flush-element\"],[\"append\",[\"unknown\",[\"expense\",\"description\"]],false],[\"close-element\"],[\"text\",\"\\n\"],[\"append\",[\"helper\",[\"expense-list/edit\"],null,[[\"expense\",\"delete\",\"edit\"],[[\"get\",[\"expense\"]],\"deleteExpense\",\"editExpense\"]]],false],[\"text\",\"\\n\"]],\"locals\":[\"expense\"]}],\"hasPartials\":false}", "meta": { "moduleName": "roadie/band/expenses/template.hbs" } });
});
define('roadie/band/model', ['exports', 'ember-data'], function (exports, _emberData) {
  exports['default'] = _emberData['default'].Model.extend({
    name: _emberData['default'].attr('string'),
    tasks: _emberData['default'].hasMany('tasks'),
    expenses: _emberData['default'].hasMany('expenses'),
    contacts: _emberData['default'].hasMany('contacts')
  });
});
define('roadie/band/route', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({
    model: function model(params) {
      return this.get('store').findRecord('band', params.band_id);
    }

  });
});
define('roadie/band/tasks/route', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({
    model: function model(params) {
      return this.get('store').findRecord('band', params.band_id);
    },
    actions: {
      createTask: function createTask(newTask) {
        var _this = this;

        var task = this.get('store').createRecord('task', newTask);
        return task.save().then(function () {
          return _this.get('flashMessages').success('Task created, keep making working hard!');
        })['catch'](function () {
          _this.get('flashMessages').danger('Oh No! Something is not quite right. Make sure you have filled out required fields with the right format');
          task.rollbackAttributes();
        });
      },
      editTask: function editTask(task) {
        this.transitionTo('tasks/edit', task);
      },
      deleteTask: function deleteTask(task) {
        var band = task.get('band');
        task.destroyRecord();
        // this.transitionTo('band/tasks', band);
      }
    }
  });
});
define("roadie/band/tasks/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "OTV94Zpv", "block": "{\"statements\":[[\"append\",[\"helper\",[\"task-list\"],null,[[\"band\",\"createTask\"],[[\"get\",[\"model\"]],\"createTask\"]]],false],[\"text\",\"\\n\\n\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"task-header\"],[\"flush-element\"],[\"text\",\"Name\"],[\"close-element\"],[\"text\",\"\\n\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"task-header\"],[\"flush-element\"],[\"text\",\"Due Date\"],[\"close-element\"],[\"text\",\"\\n\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"task-header\"],[\"flush-element\"],[\"text\",\"Priority\"],[\"close-element\"],[\"text\",\"\\n\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"task-header\"],[\"flush-element\"],[\"text\",\"Details\"],[\"close-element\"],[\"text\",\"\\n\"],[\"open-element\",\"br\",[]],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n\"],[\"block\",[\"each\"],[[\"get\",[\"model\",\"tasks\"]]],null,0],[\"append\",[\"unknown\",[\"outlet\"]],false],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[{\"statements\":[[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"task-info\"],[\"flush-element\"],[\"append\",[\"unknown\",[\"task\",\"name\"]],false],[\"close-element\"],[\"text\",\"\\n\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"task-info\"],[\"flush-element\"],[\"append\",[\"unknown\",[\"task\",\"due_date\"]],false],[\"close-element\"],[\"text\",\"\\n\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"task-info\"],[\"flush-element\"],[\"append\",[\"unknown\",[\"task\",\"priority\"]],false],[\"close-element\"],[\"text\",\"\\n\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"task-info\"],[\"flush-element\"],[\"append\",[\"unknown\",[\"task\",\"details\"]],false],[\"close-element\"],[\"text\",\"\\n\"],[\"append\",[\"helper\",[\"task-list/edit\"],null,[[\"task\",\"delete\",\"edit\"],[[\"get\",[\"task\"]],\"deleteTask\",\"editTask\"]]],false],[\"text\",\"\\n\"]],\"locals\":[\"task\"]}],\"hasPartials\":false}", "meta": { "moduleName": "roadie/band/tasks/template.hbs" } });
});
define("roadie/band/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "cgu8ebG/", "block": "{\"statements\":[[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"band-links\"],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"link-to\"],[\"band/tasks\",[\"get\",[\"model\"]]],null,2],[\"block\",[\"link-to\"],[\"band/expenses\",[\"get\",[\"model\"]]],null,1],[\"block\",[\"link-to\"],[\"band/contacts\",[\"get\",[\"model\"]]],null,0],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[{\"statements\":[[\"open-element\",\"h3\",[]],[\"static-attr\",\"class\",\"band-link-headers\"],[\"flush-element\"],[\"text\",\"Contacts\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"open-element\",\"h3\",[]],[\"static-attr\",\"class\",\"band-link-headers\"],[\"flush-element\"],[\"text\",\"Expenses\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"open-element\",\"h3\",[]],[\"static-attr\",\"class\",\"band-link-headers\"],[\"flush-element\"],[\"text\",\"Tasks\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]}],\"hasPartials\":false}", "meta": { "moduleName": "roadie/band/template.hbs" } });
});
define('roadie/bands/edit/route', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({
    model: function model(params) {
      return this.get('store').findRecord('Band', params.band_id);
    },
    actions: {
      updateBand: function updateBand(band) {
        band.save();
        this.transitionTo('bands');
      }
    }
  });
});
define("roadie/bands/edit/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "hLz8i4oZ", "block": "{\"statements\":[[\"append\",[\"helper\",[\"band-list/modify\"],null,[[\"band\",\"update\"],[[\"get\",[\"model\"]],\"updateBand\"]]],false],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "roadie/bands/edit/template.hbs" } });
});
define('roadie/bands/route', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({
    model: function model() {
      return this.get('store').findAll('Band');
    },
    actions: {

      willTransition: function willTransition() {
        var store = this.get('store');
        store.peekAll('band').forEach(function (band) {
          if (band.get('isNew') && band.get('hasDirtyAttributes')) {
            band.rollbackAttributes();
          }
        });
        return true;
      },
      newBand: function newBand(_newBand) {
        var _this = this;

        var band = this.get('store').createRecord('band', _newBand);
        return band.save().then(function () {
          return _this.get('flashMessages').success('Band created, rock on');
        })['catch'](function () {
          _this.get('flashMessages').danger('Oh No! you need to add a name!');
        }).then(function () {
          return band.rollbackAttributes();
        });
      },
      editBand: function editBand(band) {
        this.transitionTo('bands/edit', band);
      },
      deleteBand: function deleteBand(band) {
        var _this2 = this;

        return band.destroyRecord().then(function () {
          return _this2.get('flashMessages').success('Band deleted, sorry to hear it!');
        })['catch'](function () {
          _this2.get('flashMessages').danger('Oh No! you cannot delete a band that has conent');
        });
      },
      goToBand: function goToBand(band) {
        this.transitionTo('band', band);
      }
    }
  });
});
define("roadie/bands/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "roUFemC5", "block": "{\"statements\":[[\"append\",[\"helper\",[\"band-list\"],null,[[\"bands\",\"newBand\",\"editBand\",\"deleteBand\",\"goToBand\"],[[\"get\",[\"model\"]],\"newBand\",\"editBand\",\"deleteBand\",\"goToBand\"]]],false],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "roadie/bands/template.hbs" } });
});
define('roadie/blueprints/ember-datepicker', ['exports', 'ember-datepicker/blueprints/ember-datepicker'], function (exports, _emberDatepickerBlueprintsEmberDatepicker) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberDatepickerBlueprintsEmberDatepicker['default'];
    }
  });
});
define('roadie/change-password/route', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({
    auth: _ember['default'].inject.service(),
    flashMessages: _ember['default'].inject.service(),

    actions: {
      changePassword: function changePassword(passwords) {
        var _this = this;

        this.get('auth').changePassword(passwords).then(function () {
          return _this.get('auth').signOut();
        }).then(function () {
          return _this.transitionTo('sign-in');
        }).then(function () {
          _this.get('flashMessages').success('Successfully changed your password!');
        }).then(function () {
          _this.get('flashMessages').warning('You have been signed out.');
        })['catch'](function () {
          _this.get('flashMessages').danger('There was a problem. Please try again.');
        });
      }
    }
  });
});
define("roadie/change-password/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "tGo+DGc3", "block": "{\"statements\":[[\"open-element\",\"h2\",[]],[\"flush-element\"],[\"text\",\"Change Password\"],[\"close-element\"],[\"text\",\"\\n\\n\"],[\"append\",[\"helper\",[\"change-password-form\"],null,[[\"submit\"],[\"changePassword\"]]],false],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "roadie/change-password/template.hbs" } });
});
define('roadie/components/band-list/card/component', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Component.extend({
    actions: {
      edit: function edit() {
        this.sendAction('edit', this.get('band'));
      },
      'delete': function _delete() {
        this.sendAction('delete', this.get('band'));
      },
      goToBand: function goToBand() {
        this.sendAction('goToBand', this.get('band'));
      }
    }
  });
});
define("roadie/components/band-list/card/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "ZrpTx5fb", "block": "{\"statements\":[[\"open-element\",\"button\",[]],[\"modifier\",[\"action\"],[[\"get\",[null]],\"edit\"]],[\"flush-element\"],[\"text\",\"Update\"],[\"close-element\"],[\"text\",\"\\n\\n\"],[\"open-element\",\"button\",[]],[\"modifier\",[\"action\"],[[\"get\",[null]],\"delete\"]],[\"flush-element\"],[\"text\",\"Delete\"],[\"close-element\"],[\"text\",\"\\n\\n\\n\"],[\"yield\",\"default\"],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[\"default\"],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "roadie/components/band-list/card/template.hbs" } });
});
define('roadie/components/band-list/component', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Component.extend({
    Band: {
      name: null
    },

    actions: {
      newBand: function newBand() {
        var band = this.get('Band');
        this.sendAction('newBand', band);
        this.set('Band.name', '');
      },
      editBand: function editBand(band) {
        this.sendAction('editBand', band);
      },
      deleteBand: function deleteBand(band) {
        this.sendAction('deleteBand', band);
      },
      goToBand: function goToBand(band) {
        this.sendAction('goToBand', band);
      }
    }
  });
});
define('roadie/components/band-list/modify/component', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Component.extend({
    actions: {
      update: function update() {
        this.sendAction('update', this.get('band'));
      }
    }
  });
});
define("roadie/components/band-list/modify/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "QuNPpgB1", "block": "{\"statements\":[[\"open-element\",\"form\",[]],[\"modifier\",[\"action\"],[[\"get\",[null]],\"update\"],[[\"on\"],[\"submit\"]]],[\"flush-element\"],[\"text\",\"\\n\"],[\"append\",[\"helper\",[\"input\"],null,[[\"placeholder\",\"value\"],[\"update\",[\"get\",[\"band\",\"name\"]]]]],false],[\"text\",\"\\n\\n\"],[\"open-element\",\"button\",[]],[\"flush-element\"],[\"text\",\"update\"],[\"close-element\"],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\\n\\n\"],[\"yield\",\"default\"],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[\"default\"],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "roadie/components/band-list/modify/template.hbs" } });
});
define("roadie/components/band-list/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "N8exwhWH", "block": "{\"statements\":[[\"open-element\",\"form\",[]],[\"modifier\",[\"action\"],[[\"get\",[null]],\"newBand\"],[[\"on\"],[\"submit\"]]],[\"flush-element\"],[\"text\",\"\\n\"],[\"append\",[\"helper\",[\"input\"],null,[[\"placeholder\",\"value\"],[\"New band\",[\"get\",[\"Band\",\"name\"]]]]],false],[\"text\",\"\\n\\n\"],[\"open-element\",\"button\",[]],[\"flush-element\"],[\"text\",\"new band\"],[\"close-element\"],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\"],[\"block\",[\"each\"],[[\"get\",[\"bands\"]]],null,0],[\"text\",\"\\n\"],[\"yield\",\"default\"],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[\"default\"],\"blocks\":[{\"statements\":[[\"text\",\"  \"],[\"open-element\",\"div\",[]],[\"modifier\",[\"action\"],[[\"get\",[null]],\"transition\"],[[\"on\"],[\"click\"]]],[\"flush-element\"],[\"append\",[\"unknown\",[\"band\",\"name\"]],false],[\"close-element\"],[\"text\",\"\\n\"],[\"append\",[\"helper\",[\"band-list/card\"],null,[[\"band\",\"edit\",\"delete\",\"goToBand\"],[[\"get\",[\"band\"]],\"editBand\",\"deleteBand\",\"goToBand\"]]],false],[\"text\",\"\\n\\n\"]],\"locals\":[\"band\"]}],\"hasPartials\":false}", "meta": { "moduleName": "roadie/components/band-list/template.hbs" } });
});
define('roadie/components/change-password-form/component', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Component.extend({
    tagName: 'form',
    classNames: ['form-horizontal'],

    passwords: {},

    actions: {
      submit: function submit() {
        this.sendAction('submit', this.get('passwords'));
      },

      reset: function reset() {
        this.set('passwords', {});
      }
    }
  });
});
define("roadie/components/change-password-form/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "X4EQ9h94", "block": "{\"statements\":[[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"form-group\"],[\"flush-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"label\",[]],[\"static-attr\",\"for\",\"previous\"],[\"flush-element\"],[\"text\",\"Old Password\"],[\"close-element\"],[\"text\",\"\\n  \"],[\"append\",[\"helper\",[\"input\"],null,[[\"type\",\"class\",\"id\",\"placeholder\",\"value\"],[\"password\",\"form-control\",\"previous\",\"Old password\",[\"get\",[\"passwords\",\"previous\"]]]]],false],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\\n\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"form-group\"],[\"flush-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"label\",[]],[\"static-attr\",\"for\",\"next\"],[\"flush-element\"],[\"text\",\"New Password\"],[\"close-element\"],[\"text\",\"\\n  \"],[\"append\",[\"helper\",[\"input\"],null,[[\"type\",\"class\",\"id\",\"placeholder\",\"value\"],[\"password\",\"form-control\",\"next\",\"New password\",[\"get\",[\"passwords\",\"next\"]]]]],false],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\\n\"],[\"open-element\",\"button\",[]],[\"static-attr\",\"type\",\"submit\"],[\"static-attr\",\"class\",\"btn btn-primary\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"submit\"]],[\"flush-element\"],[\"text\",\"\\n  Change Password\\n\"],[\"close-element\"],[\"text\",\"\\n\\n\"],[\"open-element\",\"button\",[]],[\"static-attr\",\"class\",\"btn btn-default\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"reset\"]],[\"flush-element\"],[\"text\",\"\\n  Cancel\\n\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "roadie/components/change-password-form/template.hbs" } });
});
define('roadie/components/contact-list/component', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Component.extend({
    Contact: {
      name: null,
      phone_number: null,
      email: null,
      company: null,
      details: null
    },
    actions: {
      createContact: function createContact() {
        var contact = this.get('Contact');
        this.set('Contact', {});
        contact.band = this.get('band');
        this.sendAction('createContact', contact);
      },
      deleteContact: function deleteContact(contact) {
        this.sendAction('deleteContact', contact);
      },
      editContact: function editContact(contact) {
        this.sendAction('editContact', contact);
      }
    }
  });
});
define('roadie/components/contact-list/edit/component', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Component.extend({
    actions: {
      'delete': function _delete() {
        this.sendAction('delete', this.get('contact'));
      },
      edit: function edit() {
        this.sendAction('edit', this.get('contact'));
      }
    }
  });
});
define("roadie/components/contact-list/edit/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "Bckq2p3Q", "block": "{\"statements\":[[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"button-wrapper\"],[\"flush-element\"],[\"text\",\"\\n\"],[\"open-element\",\"button\",[]],[\"static-attr\",\"class\",\"edit\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"edit\"]],[\"flush-element\"],[\"text\",\"Edit\"],[\"close-element\"],[\"text\",\"\\n\"],[\"open-element\",\"button\",[]],[\"static-attr\",\"class\",\"delete\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"delete\"]],[\"flush-element\"],[\"text\",\"Delete\"],[\"close-element\"],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "roadie/components/contact-list/edit/template.hbs" } });
});
define('roadie/components/contact-list/modify/component', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Component.extend({
    actions: {
      update: function update() {
        this.sendAction('update', this.get('contact'));
      }
    }
  });
});
define("roadie/components/contact-list/modify/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "5s6+3KUk", "block": "{\"statements\":[[\"open-element\",\"form\",[]],[\"modifier\",[\"action\"],[[\"get\",[null]],\"update\"],[[\"on\"],[\"submit\"]]],[\"flush-element\"],[\"text\",\"\\n\"],[\"append\",[\"helper\",[\"input\"],null,[[\"placeholder\",\"value\"],[\"Name (required)\",[\"get\",[\"contact\",\"name\"]]]]],false],[\"text\",\"\\n\"],[\"append\",[\"helper\",[\"input\"],null,[[\"placeholder\",\"value\"],[\"Phone Number  - 1234567890\",[\"get\",[\"contact\",\"phone_number\"]]]]],false],[\"text\",\"\\n\"],[\"append\",[\"helper\",[\"input\"],null,[[\"placeholder\",\"value\"],[\"email\",[\"get\",[\"contact\",\"email\"]]]]],false],[\"text\",\"\\n\"],[\"append\",[\"helper\",[\"input\"],null,[[\"placeholder\",\"value\"],[\"company\",[\"get\",[\"contact\",\"company\"]]]]],false],[\"text\",\"\\n\"],[\"append\",[\"helper\",[\"input\"],null,[[\"placeholder\",\"value\"],[\"details\",[\"get\",[\"contact\",\"details\"]]]]],false],[\"text\",\"\\n\"],[\"open-element\",\"button\",[]],[\"flush-element\"],[\"text\",\"Update Contact\"],[\"close-element\"],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\\n\"],[\"yield\",\"default\"],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[\"default\"],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "roadie/components/contact-list/modify/template.hbs" } });
});
define("roadie/components/contact-list/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "oMr5uAZj", "block": "{\"statements\":[[\"open-element\",\"form\",[]],[\"static-attr\",\"class\",\"create-contact\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"createContact\"],[[\"on\"],[\"submit\"]]],[\"flush-element\"],[\"text\",\"\\n\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"contact-form\"],[\"flush-element\"],[\"append\",[\"helper\",[\"input\"],null,[[\"placeholder\",\"value\"],[\"Name (required)\",[\"get\",[\"Contact\",\"name\"]]]]],false],[\"close-element\"],[\"text\",\"\\n\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"contact-form\"],[\"flush-element\"],[\"append\",[\"helper\",[\"input\"],null,[[\"placeholder\",\"value\"],[\"Phone Number - 1234567890\",[\"get\",[\"Contact\",\"phone_number\"]]]]],false],[\"close-element\"],[\"text\",\"\\n\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"contact-form\"],[\"flush-element\"],[\"append\",[\"helper\",[\"input\"],null,[[\"placeholder\",\"value\"],[\"email\",[\"get\",[\"Contact\",\"email\"]]]]],false],[\"close-element\"],[\"text\",\"\\n\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"contact-form\"],[\"flush-element\"],[\"append\",[\"helper\",[\"input\"],null,[[\"placeholder\",\"value\"],[\"company\",[\"get\",[\"Contact\",\"company\"]]]]],false],[\"close-element\"],[\"text\",\"\\n\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"contact-form\"],[\"flush-element\"],[\"append\",[\"helper\",[\"input\"],null,[[\"placeholder\",\"value\"],[\"details\",[\"get\",[\"Contact\",\"details\"]]]]],false],[\"close-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"button-holder\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"button\",[]],[\"static-attr\",\"class\",\"add-item\"],[\"flush-element\"],[\"text\",\"Add Contact\"],[\"close-element\"],[\"text\",\"\\n  \"],[\"close-element\"],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\\n\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "roadie/components/contact-list/template.hbs" } });
});
define('roadie/components/email-input/component', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Component.extend({
    tagName: 'div',
    classNames: ['form-group']
  });
});
define("roadie/components/email-input/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "i77BoHSJ", "block": "{\"statements\":[[\"open-element\",\"label\",[]],[\"static-attr\",\"for\",\"email\"],[\"flush-element\"],[\"text\",\"Email\"],[\"close-element\"],[\"text\",\"\\n\"],[\"append\",[\"helper\",[\"input\"],null,[[\"type\",\"id\",\"placeholder\",\"value\"],[\"email\",\"email\",\"Email\",[\"get\",[\"email\"]]]]],false],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "roadie/components/email-input/template.hbs" } });
});
define('roadie/components/ember-datepicker', ['exports', 'ember-datepicker/components/ember-datepicker'], function (exports, _emberDatepickerComponentsEmberDatepicker) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberDatepickerComponentsEmberDatepicker['default'];
    }
  });
});
define('roadie/components/expense-list/component', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Component.extend({
    Expense: {
      name: null,
      description: null,
      cost: null
    },
    actions: {
      createExpense: function createExpense() {
        var expense = this.get('Expense');
        this.set('Expense', {});
        expense.band = this.get('band');
        this.sendAction('createExpense', expense);
      },
      editExpense: function editExpense(expense) {
        this.sendAction('editExpense', expense);
      },
      deleteExpense: function deleteExpense(expense) {
        this.sendAction('deleteExpense', expense);
      }
    }
  });
});
define('roadie/components/expense-list/edit/component', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Component.extend({
    actions: {
      edit: function edit() {
        this.sendAction('edit', this.get('expense'));
      },
      'delete': function _delete() {
        this.sendAction('delete', this.get('expense'));
      }
    }
  });
});
define("roadie/components/expense-list/edit/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "kiXLkWDh", "block": "{\"statements\":[[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"button-wrapper\"],[\"flush-element\"],[\"text\",\"\\n\"],[\"open-element\",\"button\",[]],[\"static-attr\",\"class\",\"edit\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"edit\"]],[\"flush-element\"],[\"text\",\"Update\"],[\"close-element\"],[\"text\",\"\\n\"],[\"open-element\",\"button\",[]],[\"static-attr\",\"class\",\"delete\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"delete\"]],[\"flush-element\"],[\"text\",\"Delete\"],[\"close-element\"],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "roadie/components/expense-list/edit/template.hbs" } });
});
define('roadie/components/expense-list/modify/component', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Component.extend({
    actions: {
      update: function update() {
        this.sendAction('update', this.get('expense'));
      }
    }
  });
});
define("roadie/components/expense-list/modify/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "SSqErX7z", "block": "{\"statements\":[[\"open-element\",\"form\",[]],[\"modifier\",[\"action\"],[[\"get\",[null]],\"update\"],[[\"on\"],[\"submit\"]]],[\"flush-element\"],[\"text\",\"\\n\"],[\"append\",[\"helper\",[\"input\"],null,[[\"placeholder\",\"value\"],[\"Name\",[\"get\",[\"expense\",\"name\"]]]]],false],[\"text\",\"\\n\"],[\"append\",[\"helper\",[\"input\"],null,[[\"placeholder\",\"value\"],[\"Description\",[\"get\",[\"expense\",\"description\"]]]]],false],[\"text\",\"\\n\"],[\"append\",[\"helper\",[\"input\"],null,[[\"placeholder\",\"value\"],[\"Price\",[\"get\",[\"expense\",\"cost\"]]]]],false],[\"text\",\"\\n\"],[\"open-element\",\"button\",[]],[\"flush-element\"],[\"text\",\"Edit Expense\"],[\"close-element\"],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "roadie/components/expense-list/modify/template.hbs" } });
});
define("roadie/components/expense-list/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "N2UT2nIe", "block": "{\"statements\":[[\"open-element\",\"form\",[]],[\"modifier\",[\"action\"],[[\"get\",[null]],\"createExpense\"],[[\"on\"],[\"submit\"]]],[\"flush-element\"],[\"text\",\"\\n\"],[\"append\",[\"helper\",[\"input\"],null,[[\"placeholder\",\"value\"],[\"Name (Required)\",[\"get\",[\"Expense\",\"name\"]]]]],false],[\"text\",\"\\n\"],[\"append\",[\"helper\",[\"input\"],null,[[\"placeholder\",\"value\"],[\"Price (xx.xx)\",[\"get\",[\"Expense\",\"cost\"]]]]],false],[\"text\",\"\\n\"],[\"append\",[\"helper\",[\"input\"],null,[[\"placeholder\",\"value\"],[\"Description\",[\"get\",[\"Expense\",\"description\"]]]]],false],[\"text\",\"\\n\"],[\"open-element\",\"button\",[]],[\"static-attr\",\"class\",\"add-item\"],[\"flush-element\"],[\"text\",\"Add Expense\"],[\"close-element\"],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\\n\\n\"],[\"block\",[\"each\"],[[\"get\",[\"expense\"]]],null,0]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[{\"statements\":[[\"open-element\",\"div\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"expense\",\"name\"]],false],[\"close-element\"],[\"text\",\"\\n\"],[\"append\",[\"helper\",[\"expense-list/edit\"],null,[[\"expense\",\"edit\",\"delete\"],[[\"get\",[\"expense\"]],\"editExpense\",\"deleteExpense\"]]],false],[\"text\",\"\\n\"]],\"locals\":[\"expense\"]}],\"hasPartials\":false}", "meta": { "moduleName": "roadie/components/expense-list/template.hbs" } });
});
define('roadie/components/flash-message', ['exports', 'ember-cli-flash/components/flash-message'], function (exports, _emberCliFlashComponentsFlashMessage) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberCliFlashComponentsFlashMessage['default'];
    }
  });
});
define('roadie/components/hamburger-menu/component', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Component.extend({
    tagName: 'button',
    classNames: ['navbar-toggle', 'collapsed'],
    attributeBindings: ['toggle:data-toggle', 'target:data-target', 'expanded:aria-expanded'],
    toggle: 'collapse',
    target: '#navigation',
    expanded: false
  });
});
define("roadie/components/hamburger-menu/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "HpmOly5q", "block": "{\"statements\":[[\"text\",\"  \"],[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"sr-only\"],[\"flush-element\"],[\"text\",\"Toggle navigation\"],[\"close-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"icon-bar\"],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"icon-bar\"],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"icon-bar\"],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "roadie/components/hamburger-menu/template.hbs" } });
});
define('roadie/components/my-application/component', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Component.extend({
    auth: _ember['default'].inject.service(),

    user: _ember['default'].computed.alias('auth.credentials.email'),
    isAuthenticated: _ember['default'].computed.alias('auth.isAuthenticated'),

    actions: {
      signOut: function signOut() {
        this.sendAction('signOut');
      }
    }
  });
});
define("roadie/components/my-application/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "xXH7DR3Y", "block": "{\"statements\":[[\"open-element\",\"nav\",[]],[\"static-attr\",\"class\",\"navbar navbar-default\"],[\"flush-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"container-fluid\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"append\",[\"unknown\",[\"navbar-header\"]],false],[\"text\",\"\\n\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"collapse navbar-collapse\"],[\"static-attr\",\"id\",\"navigation\"],[\"flush-element\"],[\"text\",\"\\n      \"],[\"open-element\",\"ul\",[]],[\"static-attr\",\"class\",\"nav navbar-nav\"],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"if\"],[[\"get\",[\"isAuthenticated\"]]],null,7],[\"text\",\"      \"],[\"close-element\"],[\"text\",\"\\n      \"],[\"open-element\",\"ul\",[]],[\"static-attr\",\"class\",\"nav navbar-nav navbar-right\"],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"if\"],[[\"get\",[\"isAuthenticated\"]]],null,5,3],[\"text\",\"      \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n  \"],[\"close-element\"],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\\n\\n\"],[\"block\",[\"each\"],[[\"get\",[\"flashMessages\",\"queue\"]]],null,0],[\"text\",\"\\n\\n  \"],[\"append\",[\"unknown\",[\"outlet\"]],false],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[{\"statements\":[[\"text\",\"  \"],[\"append\",[\"helper\",[\"flash-message\"],null,[[\"flash\"],[[\"get\",[\"flash\"]]]]],false],[\"text\",\"\\n\"]],\"locals\":[\"flash\"]},{\"statements\":[[\"text\",\"Sign In\"]],\"locals\":[]},{\"statements\":[[\"text\",\"Sign Up\"]],\"locals\":[]},{\"statements\":[[\"text\",\"        \"],[\"open-element\",\"li\",[]],[\"flush-element\"],[\"block\",[\"link-to\"],[\"sign-up\"],null,2],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"li\",[]],[\"flush-element\"],[\"block\",[\"link-to\"],[\"sign-in\"],null,1],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"li\",[]],[\"flush-element\"],[\"text\",\"Looks like you need to sign up or in to get started.\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"Change Password\"]],\"locals\":[]},{\"statements\":[[\"text\",\"        \"],[\"open-element\",\"li\",[]],[\"flush-element\"],[\"block\",[\"link-to\"],[\"change-password\"],null,4],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"li\",[]],[\"flush-element\"],[\"open-element\",\"a\",[]],[\"static-attr\",\"href\",\"#\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"signOut\"]],[\"flush-element\"],[\"text\",\"Sign Out\"],[\"close-element\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"Bands\"]],\"locals\":[]},{\"statements\":[[\"text\",\"        \"],[\"open-element\",\"li\",[]],[\"flush-element\"],[\"block\",[\"link-to\"],[\"bands\"],null,6],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]}],\"hasPartials\":false}", "meta": { "moduleName": "roadie/components/my-application/template.hbs" } });
});
define('roadie/components/navbar-header/component', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Component.extend({
    tagName: 'div',
    classNames: ['navbar-header']
  });
});
define("roadie/components/navbar-header/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "0X2jeO9E", "block": "{\"statements\":[[\"append\",[\"unknown\",[\"hamburger-menu\"]],false],[\"text\",\"\\n\"],[\"block\",[\"link-to\"],[\"application\"],[[\"class\"],[\"navbar-brand\"]],0],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[{\"statements\":[[\"text\",\"Roadie\"]],\"locals\":[]}],\"hasPartials\":false}", "meta": { "moduleName": "roadie/components/navbar-header/template.hbs" } });
});
define('roadie/components/password-confirmation-input/component', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Component.extend({
    tagName: 'div',
    classNames: ['form-group']
  });
});
define("roadie/components/password-confirmation-input/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "capP+EHh", "block": "{\"statements\":[[\"open-element\",\"label\",[]],[\"static-attr\",\"for\",\"password-confirmation\"],[\"flush-element\"],[\"text\",\"Password Confirmation\"],[\"close-element\"],[\"text\",\"\\n\"],[\"append\",[\"helper\",[\"input\"],null,[[\"type\",\"id\",\"placeholder\",\"value\"],[\"password\",\"password-confirmation\",\"Password Confirmation\",[\"get\",[\"password\"]]]]],false],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "roadie/components/password-confirmation-input/template.hbs" } });
});
define('roadie/components/password-input/component', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Component.extend({
    tagName: 'div',
    classNames: ['form-group']
  });
});
define("roadie/components/password-input/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "8dYLpjlN", "block": "{\"statements\":[[\"open-element\",\"label\",[]],[\"static-attr\",\"for\",\"kind\"],[\"flush-element\"],[\"text\",\"Password\"],[\"close-element\"],[\"text\",\"\\n\"],[\"append\",[\"helper\",[\"input\"],null,[[\"type\",\"id\",\"placeholder\",\"value\"],[\"password\",\"password\",\"Password\",[\"get\",[\"password\"]]]]],false],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "roadie/components/password-input/template.hbs" } });
});
define('roadie/components/sign-in-form/component', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Component.extend({
    tagName: 'form',
    classNames: ['form-horizontal'],

    actions: {
      submit: function submit() {
        this.sendAction('submit', this.get('credentials'));
      },

      reset: function reset() {
        this.set('credentials', {});
      }
    }
  });
});
define("roadie/components/sign-in-form/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "/9bxo2Mk", "block": "{\"statements\":[[\"append\",[\"helper\",[\"email-input\"],null,[[\"email\"],[[\"get\",[\"credentials\",\"email\"]]]]],false],[\"text\",\"\\n\"],[\"append\",[\"helper\",[\"password-input\"],null,[[\"password\"],[[\"get\",[\"credentials\",\"password\"]]]]],false],[\"text\",\"\\n\\n\"],[\"open-element\",\"button\",[]],[\"static-attr\",\"type\",\"submit\"],[\"static-attr\",\"class\",\"btn btn-primary\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"submit\"]],[\"flush-element\"],[\"text\",\"\\n  Sign In\\n\"],[\"close-element\"],[\"text\",\"\\n\\n\"],[\"open-element\",\"button\",[]],[\"static-attr\",\"class\",\"btn btn-default\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"reset\"]],[\"flush-element\"],[\"text\",\"\\n  Cancel\\n\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "roadie/components/sign-in-form/template.hbs" } });
});
define('roadie/components/sign-up-form/component', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Component.extend({
    tagName: 'form',
    classNames: ['form-horizontal'],

    credentials: {},

    actions: {
      submit: function submit() {
        this.sendAction('submit', this.get('credentials'));
      },

      reset: function reset() {
        this.set('credentials', {});
      }
    }
  });
});
define("roadie/components/sign-up-form/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "p17gn7WL", "block": "{\"statements\":[[\"append\",[\"helper\",[\"email-input\"],null,[[\"email\"],[[\"get\",[\"credentials\",\"email\"]]]]],false],[\"text\",\"\\n\"],[\"append\",[\"helper\",[\"password-input\"],null,[[\"password\"],[[\"get\",[\"credentials\",\"password\"]]]]],false],[\"text\",\"\\n\"],[\"append\",[\"helper\",[\"password-confirmation-input\"],null,[[\"password\"],[[\"get\",[\"credentials\",\"passwordConfirmation\"]]]]],false],[\"text\",\"\\n\\n\"],[\"open-element\",\"button\",[]],[\"static-attr\",\"type\",\"submit\"],[\"static-attr\",\"class\",\"btn btn-primary\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"submit\"]],[\"flush-element\"],[\"text\",\"\\n  Sign Up\\n\"],[\"close-element\"],[\"text\",\"\\n\\n\"],[\"open-element\",\"button\",[]],[\"static-attr\",\"class\",\"btn btn-default\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"reset\"]],[\"flush-element\"],[\"text\",\"\\n  Cancel\\n\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "roadie/components/sign-up-form/template.hbs" } });
});
define('roadie/components/task-list/component', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Component.extend({
    Task: {
      name: null,
      due_date: null,
      priority: null,
      details: null,
      completed: false
    },
    actions: {
      createTask: function createTask() {
        var task = this.get('Task');
        this.set('Task', {});
        task.band = this.get('band');
        this.sendAction('createTask', task);
      },
      toggleComplete: function toggleComplete() {},
      deleteTask: function deleteTask(task) {
        this.sendAction('deleteTask', task);
        task.rollbackAttributes();
      },
      editTask: function editTask(task) {
        this.sendAction('editTask', task);
      },
      completeTask: function completeTask(task) {
        this.sendAction('completeTask', task);
      }
    }
  });
});
define('roadie/components/task-list/edit/component', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Component.extend({
    actions: {
      'delete': function _delete() {
        this.sendAction('delete', this.get('task'));
      },
      edit: function edit() {
        this.sendAction('edit', this.get('task'));
      },
      complete: function complete() {
        this.sendAction('complete', this.get('task'));
      }
    }
  });
});
define("roadie/components/task-list/edit/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "nrw9sV/e", "block": "{\"statements\":[[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"button-wrapper\"],[\"flush-element\"],[\"text\",\"\\n\"],[\"open-element\",\"button\",[]],[\"static-attr\",\"class\",\"edit\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"edit\"]],[\"flush-element\"],[\"text\",\"edit\"],[\"close-element\"],[\"text\",\"\\n\"],[\"open-element\",\"button\",[]],[\"static-attr\",\"class\",\"delete\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"delete\"]],[\"flush-element\"],[\"text\",\"delete\"],[\"close-element\"],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "roadie/components/task-list/edit/template.hbs" } });
});
define('roadie/components/task-list/modify/component', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Component.extend({
    actions: {
      update: function update() {
        this.sendAction('update', this.get('task'));
      }
    }
  });
});
define("roadie/components/task-list/modify/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "gNM4bEVZ", "block": "{\"statements\":[[\"open-element\",\"form\",[]],[\"modifier\",[\"action\"],[[\"get\",[null]],\"update\"],[[\"on\"],[\"submit\"]]],[\"flush-element\"],[\"text\",\"\\n\"],[\"append\",[\"helper\",[\"input\"],null,[[\"value\"],[[\"get\",[\"task\",\"name\"]]]]],false],[\"text\",\"\\n\"],[\"append\",[\"helper\",[\"input\"],null,[[\"placeholder\",\"value\"],[\"due date\",[\"get\",[\"task\",\"due_date\"]]]]],false],[\"text\",\"\\n\"],[\"append\",[\"helper\",[\"input\"],null,[[\"placeholder\",\"value\"],[\"priority level\",[\"get\",[\"task\",\"priority\"]]]]],false],[\"text\",\"\\n\"],[\"append\",[\"helper\",[\"input\"],null,[[\"placeholder\",\"value\"],[\"details\",[\"get\",[\"task\",\"details\"]]]]],false],[\"text\",\"\\n\"],[\"open-element\",\"button\",[]],[\"flush-element\"],[\"text\",\"update\"],[\"close-element\"],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\\n\\n\"],[\"yield\",\"default\"],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[\"default\"],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "roadie/components/task-list/modify/template.hbs" } });
});
define("roadie/components/task-list/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "MRTY+Ljj", "block": "{\"statements\":[[\"open-element\",\"form\",[]],[\"static-attr\",\"class\",\"create-task\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"createTask\"],[[\"on\"],[\"submit\"]]],[\"flush-element\"],[\"text\",\"\\n\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"task-form\"],[\"flush-element\"],[\"append\",[\"helper\",[\"input\"],null,[[\"placeholder\",\"value\"],[\"Name (required)\",[\"get\",[\"Task\",\"name\"]]]]],false],[\"close-element\"],[\"text\",\"\\n\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"task-form\"],[\"flush-element\"],[\"append\",[\"helper\",[\"input\"],null,[[\"placeholder\",\"value\"],[\"Due Date (required, YYYY-MM-DD)\",[\"get\",[\"Task\",\"due_date\"]]]]],false],[\"close-element\"],[\"text\",\"\\n\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"task-form\"],[\"flush-element\"],[\"append\",[\"helper\",[\"input\"],null,[[\"placeholder\",\"value\"],[\"priority level (required, maximum of 9)\",[\"get\",[\"Task\",\"priority\"]]]]],false],[\"close-element\"],[\"text\",\"\\n\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"task-form\"],[\"flush-element\"],[\"append\",[\"helper\",[\"input\"],null,[[\"placeholder\",\"value\"],[\"details\",[\"get\",[\"Task\",\"details\"]]]]],false],[\"close-element\"],[\"text\",\"\\n\"],[\"open-element\",\"button\",[]],[\"static-attr\",\"class\",\"add-item\"],[\"flush-element\"],[\"text\",\"Add Task\"],[\"close-element\"],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\\n\\n\"],[\"block\",[\"each\"],[[\"get\",[\"task\"]]],null,0],[\"yield\",\"default\"],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[\"default\"],\"blocks\":[{\"statements\":[[\"text\",\"  \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"task-item\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"toggleComplete\"],[[\"on\"],[\"click\"]]],[\"flush-element\"],[\"append\",[\"unknown\",[\"task\",\"name\"]],false],[\"close-element\"],[\"text\",\"\\n  \"],[\"append\",[\"helper\",[\"task-list/edit\"],null,[[\"task\",\"delete\",\"edit\",\"complete\"],[[\"get\",[\"task\"]],\"deleteTask\",\"editTask\",\"completeTask\"]]],false],[\"text\",\"\\n\"]],\"locals\":[\"task\"]}],\"hasPartials\":false}", "meta": { "moduleName": "roadie/components/task-list/template.hbs" } });
});
define('roadie/contact/adapter', ['exports', 'roadie/application/adapter'], function (exports, _roadieApplicationAdapter) {
  exports['default'] = _roadieApplicationAdapter['default'].extend({
    createRecord: function createRecord(store, type, record) {
      var api = this.get('host');
      var serialized = this.serialize(record, { includeid: true });
      var bandId = serialized.band_id;
      var url = api + '/band/' + bandId + '/contacts';
      var data = { contact: serialized };

      return this.ajax(url, 'POST', { data: data });
    }
  });
});
define('roadie/contact/model', ['exports', 'ember-data'], function (exports, _emberData) {
  exports['default'] = _emberData['default'].Model.extend({
    name: _emberData['default'].attr('string'),
    phone_number: _emberData['default'].attr('string'),
    email: _emberData['default'].attr('string'),
    company: _emberData['default'].attr('string'),
    details: _emberData['default'].attr('string'),
    band: _emberData['default'].belongsTo('band')
  });
});
define('roadie/contacts/edit/route', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({
    model: function model(params) {
      return this.get('store').findRecord('Contact', params.contact_id);
    },
    actions: {
      saveUpdate: function saveUpdate(contact) {
        var _this = this;

        return contact.save().then(function () {
          return _this.get('flashMessages').success('Updated! We are still working out the kinks, so for now you have to click to get back to your band');
        }).then(function () {
          return _this.transitionTo('bands');
        })['catch'](function () {
          _this.get('flashMessages').danger('Oh No! Something is not quite right. Make sure you have filled out required fields with the right format');
          contact.rollbackAttributes();
        });
      }
    }
  });
});
define("roadie/contacts/edit/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "vz8vcRbz", "block": "{\"statements\":[[\"append\",[\"helper\",[\"contact-list/modify\"],null,[[\"contact\",\"update\"],[[\"get\",[\"model\"]],\"saveUpdate\"]]],false],[\"text\",\"\\n\\n\"],[\"append\",[\"unknown\",[\"outlet\"]],false],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "roadie/contacts/edit/template.hbs" } });
});
define('roadie/contacts/route', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({
    model: function model() {
      return this.get('store').findAll('contact');
    },
    actions: {
      newContact: function newContact(_newContact) {
        var contact = this.get('store').createRecord('contact', _newContact);
        contact.save();
      },
      deleteContact: function deleteContact(contact) {
        contact.destroyRecord();
      },
      editContact: function editContact(contact) {
        this.transitionTo('contacts/edit', contact);
      }
    }
  });
});
define("roadie/contacts/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "XX701zbf", "block": "{\"statements\":[[\"append\",[\"helper\",[\"contact-list\"],null,[[\"contact\",\"newContact\",\"deleteContact\",\"editContact\"],[[\"get\",[\"model\"]],\"newContact\",\"deleteContact\",\"editContact\"]]],false],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "roadie/contacts/template.hbs" } });
});
define('roadie/controllers/array', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Controller;
});
define('roadie/controllers/object', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Controller;
});
define('roadie/expense/adapter', ['exports', 'roadie/application/adapter'], function (exports, _roadieApplicationAdapter) {
  exports['default'] = _roadieApplicationAdapter['default'].extend({
    createRecord: function createRecord(store, type, record) {
      var api = this.get('host');
      var serialized = this.serialize(record, { includeid: true });
      var bandId = serialized.band_id;
      var url = api + '/band/' + bandId + '/expenses';
      var data = { expense: serialized };

      return this.ajax(url, 'POST', { data: data });
    }
  });
});
define('roadie/expense/model', ['exports', 'ember-data'], function (exports, _emberData) {
  exports['default'] = _emberData['default'].Model.extend({
    name: _emberData['default'].attr('string'),
    description: _emberData['default'].attr('string'),
    cost: _emberData['default'].attr('number'),
    band: _emberData['default'].belongsTo('band')
  });
});
define('roadie/expenses/edit/route', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({
    model: function model(params) {
      return this.get('store').findRecord('Expense', params.expense_id);
    },
    actions: {
      updateSave: function updateSave(expense) {
        var _this = this;

        return expense.save().then(function () {
          return _this.get('flashMessages').success('Updated! We are still working out the kinks, so for now you have to click to get back to your band');
        }).then(function () {
          return _this.transitionTo('bands');
        })['catch'](function () {
          _this.get('flashMessages').danger('Oh No! Something is not quite right. Make sure you have filled out required fields with the right format');
          expense.rollbackAttributes();
        });
      }
    }
  });
});
define("roadie/expenses/edit/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "1uSh31rn", "block": "{\"statements\":[[\"append\",[\"helper\",[\"expense-list/modify\"],null,[[\"expense\",\"update\"],[[\"get\",[\"model\"]],\"updateSave\"]]],false],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "roadie/expenses/edit/template.hbs" } });
});
define('roadie/expenses/route', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({
    model: function model() {
      return this.get('store').findAll('expense');
    },
    actions: {
      createExpense: function createExpense(newExpense) {
        var expense = this.get('store').createRecord('expense', newExpense);
        expense.save();
      },
      editExpense: function editExpense(expense) {
        this.transitionTo('expenses/edit', expense);
      },
      deleteExpense: function deleteExpense(expense) {
        expense.destroyRecord();
      }
    }
  });
});
define("roadie/expenses/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "VhGbwb9q", "block": "{\"statements\":[[\"append\",[\"helper\",[\"expense-list\"],null,[[\"expense\",\"createExpense\",\"editExpense\",\"deleteExpense\"],[[\"get\",[\"model\"]],\"createExpense\",\"editExpense\",\"deleteExpense\"]]],false],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "roadie/expenses/template.hbs" } });
});
define('roadie/flash/object', ['exports', 'ember-cli-flash/flash/object'], function (exports, _emberCliFlashFlashObject) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberCliFlashFlashObject['default'];
    }
  });
});
define('roadie/helpers/app-version', ['exports', 'ember', 'roadie/config/environment'], function (exports, _ember, _roadieConfigEnvironment) {
  exports.appVersion = appVersion;
  var version = _roadieConfigEnvironment['default'].APP.version;

  function appVersion() {
    return version;
  }

  exports['default'] = _ember['default'].Helper.helper(appVersion);
});
define('roadie/helpers/pluralize', ['exports', 'ember-inflector/lib/helpers/pluralize'], function (exports, _emberInflectorLibHelpersPluralize) {
  exports['default'] = _emberInflectorLibHelpersPluralize['default'];
});
define('roadie/helpers/singularize', ['exports', 'ember-inflector/lib/helpers/singularize'], function (exports, _emberInflectorLibHelpersSingularize) {
  exports['default'] = _emberInflectorLibHelpersSingularize['default'];
});
define("roadie/initializers/active-model-adapter", ["exports", "active-model-adapter", "active-model-adapter/active-model-serializer"], function (exports, _activeModelAdapter, _activeModelAdapterActiveModelSerializer) {
  exports["default"] = {
    name: 'active-model-adapter',
    initialize: function initialize() {
      var application = arguments[1] || arguments[0];
      application.register('adapter:-active-model', _activeModelAdapter["default"]);
      application.register('serializer:-active-model', _activeModelAdapterActiveModelSerializer["default"]);
    }
  };
});
define('roadie/initializers/app-version', ['exports', 'ember-cli-app-version/initializer-factory', 'roadie/config/environment'], function (exports, _emberCliAppVersionInitializerFactory, _roadieConfigEnvironment) {
  var _config$APP = _roadieConfigEnvironment['default'].APP;
  var name = _config$APP.name;
  var version = _config$APP.version;
  exports['default'] = {
    name: 'App Version',
    initialize: (0, _emberCliAppVersionInitializerFactory['default'])(name, version)
  };
});
define('roadie/initializers/container-debug-adapter', ['exports', 'ember-resolver/container-debug-adapter'], function (exports, _emberResolverContainerDebugAdapter) {
  exports['default'] = {
    name: 'container-debug-adapter',

    initialize: function initialize() {
      var app = arguments[1] || arguments[0];

      app.register('container-debug-adapter:main', _emberResolverContainerDebugAdapter['default']);
      app.inject('container-debug-adapter:main', 'namespace', 'application:main');
    }
  };
});
define('roadie/initializers/data-adapter', ['exports', 'ember'], function (exports, _ember) {

  /*
    This initializer is here to keep backwards compatibility with code depending
    on the `data-adapter` initializer (before Ember Data was an addon).
  
    Should be removed for Ember Data 3.x
  */

  exports['default'] = {
    name: 'data-adapter',
    before: 'store',
    initialize: function initialize() {}
  };
});
define('roadie/initializers/ember-data', ['exports', 'ember-data/setup-container', 'ember-data/-private/core'], function (exports, _emberDataSetupContainer, _emberDataPrivateCore) {

  /*
  
    This code initializes Ember-Data onto an Ember application.
  
    If an Ember.js developer defines a subclass of DS.Store on their application,
    as `App.StoreService` (or via a module system that resolves to `service:store`)
    this code will automatically instantiate it and make it available on the
    router.
  
    Additionally, after an application's controllers have been injected, they will
    each have the store made available to them.
  
    For example, imagine an Ember.js application with the following classes:
  
    App.StoreService = DS.Store.extend({
      adapter: 'custom'
    });
  
    App.PostsController = Ember.Controller.extend({
      // ...
    });
  
    When the application is initialized, `App.ApplicationStore` will automatically be
    instantiated, and the instance of `App.PostsController` will have its `store`
    property set to that instance.
  
    Note that this code will only be run if the `ember-application` package is
    loaded. If Ember Data is being used in an environment other than a
    typical application (e.g., node.js where only `ember-runtime` is available),
    this code will be ignored.
  */

  exports['default'] = {
    name: 'ember-data',
    initialize: _emberDataSetupContainer['default']
  };
});
define('roadie/initializers/export-application-global', ['exports', 'ember', 'roadie/config/environment'], function (exports, _ember, _roadieConfigEnvironment) {
  exports.initialize = initialize;

  function initialize() {
    var application = arguments[1] || arguments[0];
    if (_roadieConfigEnvironment['default'].exportApplicationGlobal !== false) {
      var theGlobal;
      if (typeof window !== 'undefined') {
        theGlobal = window;
      } else if (typeof global !== 'undefined') {
        theGlobal = global;
      } else if (typeof self !== 'undefined') {
        theGlobal = self;
      } else {
        // no reasonable global, just bail
        return;
      }

      var value = _roadieConfigEnvironment['default'].exportApplicationGlobal;
      var globalName;

      if (typeof value === 'string') {
        globalName = value;
      } else {
        globalName = _ember['default'].String.classify(_roadieConfigEnvironment['default'].modulePrefix);
      }

      if (!theGlobal[globalName]) {
        theGlobal[globalName] = application;

        application.reopen({
          willDestroy: function willDestroy() {
            this._super.apply(this, arguments);
            delete theGlobal[globalName];
          }
        });
      }
    }
  }

  exports['default'] = {
    name: 'export-application-global',

    initialize: initialize
  };
});
define('roadie/initializers/flash-messages', ['exports', 'ember', 'roadie/config/environment'], function (exports, _ember, _roadieConfigEnvironment) {
  exports.initialize = initialize;
  var deprecate = _ember['default'].deprecate;

  var merge = _ember['default'].assign || _ember['default'].merge;
  var INJECTION_FACTORIES_DEPRECATION_MESSAGE = '[ember-cli-flash] Future versions of ember-cli-flash will no longer inject the service automatically. Instead, you should explicitly inject it into your Route, Controller or Component with `Ember.inject.service`.';
  var addonDefaults = {
    timeout: 3000,
    extendedTimeout: 0,
    priority: 100,
    sticky: false,
    showProgress: false,
    type: 'info',
    types: ['success', 'info', 'warning', 'danger', 'alert', 'secondary'],
    injectionFactories: ['route', 'controller', 'view', 'component'],
    preventDuplicates: false
  };

  function initialize() {
    var application = arguments[1] || arguments[0];

    var _ref = _roadieConfigEnvironment['default'] || {};

    var flashMessageDefaults = _ref.flashMessageDefaults;

    var _ref2 = flashMessageDefaults || [];

    var injectionFactories = _ref2.injectionFactories;

    var options = merge(addonDefaults, flashMessageDefaults);
    var shouldShowDeprecation = !(injectionFactories && injectionFactories.length);

    application.register('config:flash-messages', options, { instantiate: false });
    application.inject('service:flash-messages', 'flashMessageDefaults', 'config:flash-messages');

    deprecate(INJECTION_FACTORIES_DEPRECATION_MESSAGE, shouldShowDeprecation, {
      id: 'ember-cli-flash.deprecate-injection-factories',
      until: '2.0.0'
    });

    options.injectionFactories.forEach(function (factory) {
      application.inject(factory, 'flashMessages', 'service:flash-messages');
    });
  }

  exports['default'] = {
    name: 'flash-messages',
    initialize: initialize
  };
});
define('roadie/initializers/injectStore', ['exports', 'ember'], function (exports, _ember) {

  /*
    This initializer is here to keep backwards compatibility with code depending
    on the `injectStore` initializer (before Ember Data was an addon).
  
    Should be removed for Ember Data 3.x
  */

  exports['default'] = {
    name: 'injectStore',
    before: 'store',
    initialize: function initialize() {}
  };
});
define('roadie/initializers/local-storage-adapter', ['exports', 'ember-local-storage/initializers/local-storage-adapter'], function (exports, _emberLocalStorageInitializersLocalStorageAdapter) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberLocalStorageInitializersLocalStorageAdapter['default'];
    }
  });
  Object.defineProperty(exports, 'initialize', {
    enumerable: true,
    get: function get() {
      return _emberLocalStorageInitializersLocalStorageAdapter.initialize;
    }
  });
});
define('roadie/initializers/store', ['exports', 'ember'], function (exports, _ember) {

  /*
    This initializer is here to keep backwards compatibility with code depending
    on the `store` initializer (before Ember Data was an addon).
  
    Should be removed for Ember Data 3.x
  */

  exports['default'] = {
    name: 'store',
    after: 'ember-data',
    initialize: function initialize() {}
  };
});
define('roadie/initializers/text-field', ['exports', 'ember'], function (exports, _ember) {
  exports.initialize = initialize;

  function initialize() {
    _ember['default'].TextField.reopen({
      classNames: ['form-control']
    });
  }

  exports['default'] = {
    name: 'text-field',
    initialize: initialize
  };
});
define('roadie/initializers/transforms', ['exports', 'ember'], function (exports, _ember) {

  /*
    This initializer is here to keep backwards compatibility with code depending
    on the `transforms` initializer (before Ember Data was an addon).
  
    Should be removed for Ember Data 3.x
  */

  exports['default'] = {
    name: 'transforms',
    before: 'store',
    initialize: function initialize() {}
  };
});
define("roadie/instance-initializers/ember-data", ["exports", "ember-data/-private/instance-initializers/initialize-store-service"], function (exports, _emberDataPrivateInstanceInitializersInitializeStoreService) {
  exports["default"] = {
    name: "ember-data",
    initialize: _emberDataPrivateInstanceInitializersInitializeStoreService["default"]
  };
});
define('roadie/resolver', ['exports', 'ember-resolver'], function (exports, _emberResolver) {
  exports['default'] = _emberResolver['default'];
});
define('roadie/router', ['exports', 'ember', 'roadie/config/environment'], function (exports, _ember, _roadieConfigEnvironment) {

  var Router = _ember['default'].Router.extend({
    location: _roadieConfigEnvironment['default'].locationType
  });

  Router.map(function () {
    this.route('sign-up');
    this.route('sign-in');
    this.route('change-password');
    this.route('users');
    this.route('band/tasks', { path: 'band/:band_id/tasks' });
    this.route('band/expenses', { path: 'band/:band_id/expenses' });
    this.route('band/contacts', { path: 'band/:band_id/contacts' });
    this.route('band/contacts/new', { path: 'band/:band_id/contacts/new' });
    this.route('tasks/edit', { path: 'tasks/:task_id/edit' });
    this.route('bands');
    this.route('bands/edit', { path: 'bands/:band_id/edit' });
    this.route('contacts');
    this.route('contacts/edit', { path: 'contacts/:contact_id/edit' });
    this.route('expenses');
    this.route('expenses/edit', { path: 'expenses/:expense_id/edit' });
    this.route('band', { path: 'bands/:band_id' });
    // this.route('band', { path: 'bands/:band_id' }, function() {
    //   this.route('contacts', function() {
    //     this.route('new');
    //   });
    // });
  });

  exports['default'] = Router;
});
define('roadie/services/ajax', ['exports', 'ember-ajax/services/ajax'], function (exports, _emberAjaxServicesAjax) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberAjaxServicesAjax['default'];
    }
  });
});
define('roadie/services/flash-messages', ['exports', 'ember-cli-flash/services/flash-messages'], function (exports, _emberCliFlashServicesFlashMessages) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberCliFlashServicesFlashMessages['default'];
    }
  });
});
define('roadie/sign-in/route', ['exports', 'ember', 'rsvp'], function (exports, _ember, _rsvp) {
  exports['default'] = _ember['default'].Route.extend({
    auth: _ember['default'].inject.service(),
    flashMessages: _ember['default'].inject.service(),

    model: function model() {
      return _rsvp['default'].Promise.resolve({});
    },

    actions: {
      signIn: function signIn(credentials) {
        var _this = this;

        return this.get('auth').signIn(credentials).then(function () {
          return _this.transitionTo('bands');
        }).then(function () {
          return _this.get('flashMessages').success('Thanks for signing in!');
        })['catch'](function () {
          _this.get('flashMessages').danger('There was a problem. Please try again.');
        });
      }
    }
  });
});
define("roadie/sign-in/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "MeU3Vb+O", "block": "{\"statements\":[[\"open-element\",\"h2\",[]],[\"flush-element\"],[\"text\",\"Sign In\"],[\"close-element\"],[\"text\",\"\\n\\n\"],[\"append\",[\"helper\",[\"sign-in-form\"],null,[[\"submit\",\"reset\",\"credentials\"],[\"signIn\",\"reset\",[\"get\",[\"model\"]]]]],false],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "roadie/sign-in/template.hbs" } });
});
define('roadie/sign-up/route', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({
    auth: _ember['default'].inject.service(),
    flashMessages: _ember['default'].inject.service(),

    actions: {
      signUp: function signUp(credentials) {
        var _this = this;

        this.get('auth').signUp(credentials).then(function () {
          return _this.get('auth').signIn(credentials);
        }).then(function () {
          return _this.transitionTo('bands');
        }).then(function () {
          _this.get('flashMessages').success('Successfully signed-up! You have also been signed-in.');
        })['catch'](function () {
          _this.get('flashMessages').danger('There was a problem. Please try again.');
        });
      }
    }
  });
});
define("roadie/sign-up/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "Qlk+/UhB", "block": "{\"statements\":[[\"open-element\",\"h2\",[]],[\"flush-element\"],[\"text\",\"Sign Up\"],[\"close-element\"],[\"text\",\"\\n\\n\"],[\"append\",[\"helper\",[\"sign-up-form\"],null,[[\"submit\"],[\"signUp\"]]],false],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "roadie/sign-up/template.hbs" } });
});
define('roadie/task/adapter', ['exports', 'roadie/application/adapter'], function (exports, _roadieApplicationAdapter) {
  exports['default'] = _roadieApplicationAdapter['default'].extend({
    createRecord: function createRecord(store, type, record) {
      var api = this.get('host');
      var serialized = this.serialize(record, { includeid: true });
      var bandId = serialized.band_id;
      var url = api + '/band/' + bandId + '/tasks';
      var data = { task: serialized };

      return this.ajax(url, 'POST', { data: data });
    }
  });
});
define('roadie/task/model', ['exports', 'ember-data'], function (exports, _emberData) {
  exports['default'] = _emberData['default'].Model.extend({
    name: _emberData['default'].attr('string'),
    due_date: _emberData['default'].attr('string'),
    priority: _emberData['default'].attr('number'),
    details: _emberData['default'].attr('string'),
    // completed: DS.attr('boolean'),
    band: _emberData['default'].belongsTo('band')
  });
});
define('roadie/tasks/edit/route', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({
    model: function model(params) {
      return this.get('store').findRecord('Task', params.task_id);
    },
    actions: {
      saveUpdate: function saveUpdate(task) {
        var _this = this;

        return task.save().then(function () {
          return _this.get('flashMessages').success('Updated! We are still working out the kinks, so for now you have to click to get back to your band');
        }).then(function () {
          return _this.transitionTo('bands');
        })['catch'](function () {
          _this.get('flashMessages').danger('Oh No! Something is not quite right. Make sure you have filled out required fields with the right format');
          task.rollbackAttributes();
        });
      }
    }

  });
});
define("roadie/tasks/edit/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "0Y58CpYi", "block": "{\"statements\":[[\"append\",[\"helper\",[\"task-list/modify\"],null,[[\"task\",\"update\"],[[\"get\",[\"model\"]],\"saveUpdate\"]]],false],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "roadie/tasks/edit/template.hbs" } });
});
define('roadie/tasks/route', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({

    model: function model(params) {
      return this.get('store').findRecord('band', params.band_id);
    },

    actions: {
      createTask: function createTask(task) {},
      deleteTask: function deleteTask(task) {
        task.destroyRecord();
      },
      editTask: function editTask(task) {
        this.transitionTo('tasks/edit', task);
      }
    }
  });
});
define("roadie/tasks/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "1sZcwr0R", "block": "{\"statements\":[[\"text\",\"Here is your to-do list! These are the tasks you need to complete.\\n\"],[\"append\",[\"helper\",[\"task-list\"],null,[[\"task\",\"createTask\",\"deleteTask\",\"editTask\"],[[\"get\",[\"model\"]],\"createTask\",\"deleteTask\",\"editTask\"]]],false],[\"text\",\"\\n\\n\\n\"],[\"append\",[\"unknown\",[\"outlet\"]],false],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "roadie/tasks/template.hbs" } });
});
define('roadie/user/model', ['exports', 'ember-data'], function (exports, _emberData) {
  exports['default'] = _emberData['default'].Model.extend({
    email: _emberData['default'].attr('string')
  });
});
define('roadie/users/route', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({
    model: function model() {
      return this.get('store').findAll('user');
    }
  });
});
define("roadie/users/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "KMTOv4LK", "block": "{\"statements\":[[\"open-element\",\"h2\",[]],[\"flush-element\"],[\"text\",\"Users\"],[\"close-element\"],[\"text\",\"\\n\\n\"],[\"open-element\",\"ul\",[]],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"each\"],[[\"get\",[\"model\"]]],null,0],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[{\"statements\":[[\"text\",\"  \"],[\"open-element\",\"li\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"user\",\"email\"]],false],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[\"user\"]}],\"hasPartials\":false}", "meta": { "moduleName": "roadie/users/template.hbs" } });
});
/* jshint ignore:start */



/* jshint ignore:end */

/* jshint ignore:start */

define('roadie/config/environment', ['ember'], function(Ember) {
  var prefix = 'roadie';
/* jshint ignore:start */

try {
  var metaName = prefix + '/config/environment';
  var rawConfig = document.querySelector('meta[name="' + metaName + '"]').getAttribute('content');
  var config = JSON.parse(unescape(rawConfig));

  var exports = { 'default': config };

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;
}
catch(err) {
  throw new Error('Could not read config from meta tag with name "' + metaName + '".');
}

/* jshint ignore:end */

});

/* jshint ignore:end */

/* jshint ignore:start */

if (!runningTests) {
  require("roadie/app")["default"].create({"name":"roadie","version":"0.0.0+87a128d8"});
}

/* jshint ignore:end */
//# sourceMappingURL=roadie.map
