import Ember from 'ember';

export default Ember.Route.extend({
  model (params) {
    return this.get('store').findRecord('Contact', params.contact_id);
  },
  actions:{
    saveUpdate(contact){
      contact.save();
      this.transitionTo('bands');
    }
  }
});
