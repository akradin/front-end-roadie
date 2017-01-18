import Ember from 'ember';

export default Ember.Route.extend({
  model(params){
    return this.get('store').findRecord('band', params.band_id);
  },
  actions:{
    createContact(newContact){
      let contact = this.get('store').createRecord('contact', newContact);
      contact.save();
    },
    deleteContact(contact){
      contact.destroyRecord();
    },
    editContact(contact){
      this.transitionTo('contacts/edit', contact);
    }
  }
});
