import Ember from 'ember';

export default Ember.Component.extend({
  newContact: {
    name: null,
    phone_number: null,
    email: null,
    company: null,
    details: null
  },
  actions :{
    createContact(){
      let newContact = this.get('newContact');
      newContact.band = this.get('band');
      this.sendAction('createContact', this.get('newContact'));
      this.set('newContact.name', '');
      this.set('newContact.phone_number', '');
      this.set('newContact.email', '');
      this.set('newContact.company', '');
      this.set('newContact.details', '');
    },
    deleteContact(contact){
      this.sendAction('deleteContact', contact);
    },
    editContact(contact){
      this.sendAction('editContact', contact);
    }
  }
});
