import Ember from 'ember';

export default Ember.Component.extend({
  Contact: {
    name: null,
    phone_number: null,
    email: null,
    company: null,
    details: null
  },
  actions :{
    createContact(){
      let contact = this.get('Contact');
      this.set('Contact', {});
      contact.band = this.get('band');
      this.sendAction('createContact', contact);
    },
    deleteContact(contact){
      this.sendAction('deleteContact', contact);
    },
    editContact(contact){
      this.sendAction('editContact', contact);
    }
  }
});
