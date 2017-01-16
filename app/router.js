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
  this.route('tasks');
  this.route('tasks/edit', { path: 'tasks/:task_id/edit'});
  this.route('bands');
  this.route('bands/edit', { path: 'bands/:band_id/edit'});
});

export default Router;
