import Ember from 'ember';

export default Ember.Route.extend({
  model(){
    return this.get('store').findAll('contact');
  },
  actions:{
    newContact(newContact){
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
