import Ember from 'ember';

export default Ember.Route.extend({
  model(params){
    return this.get('store').findRecord('band', params.band_id);
  },
  actions :{
    createContact(newContact){

      let contact = this.get('store').createRecord('contact', newContact);
      return contact.save()
      .then(() => this.get('flashMessages').success('Contact created, keep making connections!'))
      .then(()=> this.transitionTo('band', newContact.band))
      .catch(() => {
        this.get('flashMessages')
        .danger('Oh No! Something is not quite right. Make sure you have filled out required fields with the right format');
        contact.rollbackAttributes();
      });


    },
  }
});
