import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
});

Router.map(function () {
  this.route('sign-up');
  this.route('sign-in');
  this.route('change-password');
  this.route('users');
  this.route('band/tasks', { path: 'band/:band_id/tasks'});
  this.route('band/expenses', { path: 'band/:band_id/expenses'});
  this.route('band/contacts', { path: 'band/:band_id/contacts'});
  this.route('band/contacts/new', { path: 'band/:band_id/contacts/new'});
  this.route('tasks/edit', { path: 'tasks/:task_id/edit'});
  this.route('bands');
  this.route('bands/edit', { path: 'bands/:band_id/edit'});
  this.route('contacts');
  this.route('contacts/edit', { path: 'contacts/:contact_id/edit'});
  this.route('expenses');
  this.route('expenses/edit', { path: 'expenses/:expense_id/edit'});
  this.route('band', { path: 'bands/:band_id' });
  // this.route('band', { path: 'bands/:band_id' }, function() {
  //   this.route('contacts', function() {
  //     this.route('new');
  //   });
  // });
});


export default Router;
