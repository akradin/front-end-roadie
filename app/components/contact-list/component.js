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
    newContact(){
      console.log("beep beep", this.get('contact'));
      this.sendAction('newContact', this.get('Contact'));
    },
    deleteContact(contact){
      this.sendAction('deleteContact', contact);
    },
    editContact(contact){
      this.sendAction('editContact', contact);
    }
  }
});
