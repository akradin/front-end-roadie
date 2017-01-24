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
    createContact(newContact){

      let contact = this.get('store').createRecord('contact', newContact);
      return contact.save()
      .then(() => this.get('flashMessages').success('Contact created, keep making connections!'))
      .catch(() => {
        this.get('flashMessages')
        .danger('Oh No! Something is not quite right. Make sure you have filled out required fields with the right format');
        contact.rollbackAttributes();
      });
    },

    deleteContact(contact){
      contact.destroyRecord();
      // contact.rollbackAttributes();
    },
    editContact(contact){
      this.transitionTo('contacts/edit', contact);
    }
  }
});
