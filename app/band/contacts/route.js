import Ember from 'ember';

export default Ember.Route.extend({
  model(params){
    return this.get('store').findRecord('band', params.band_id);
  },
  actions:{
    willTransition() {
      let store = this.get('store');
      store.peekAll('contact').forEach(function(contact) {
        if (contact.get('isNew') && contact.get('hasDirtyAttributes')) {
          contact.rollbackAttributes();
        }
      });
      return true;
    },

    deleteContact(contact){
      let band = contact.get('band');
      contact.destroyRecord();
      this.transitionTo('band', band);
      this.transitionTo('band/contacts', band);
    },
    editContact(contact){
      this.transitionTo('contacts/edit', contact);
    }
  }
});
