import Ember from 'ember';

export default Ember.Route.extend({
  model(){
    return this.get('store').findAll('Band');
  },
  actions:{
    newBand(newBand){
      let band = this.get('store').createRecord('band', newBand);
      return band.save()
      .then(() => this.get('flashMessages').success('Band created, rock on'))
      .catch(() => {
        this.get('flashMessages')
        .danger('Oh No! you need to add a name!');
      });


    },
    editBand(band){
      this.transitionTo('bands/edit', band);
    },
    deleteBand(band){
      band.destroyRecord();
    },
    goToBand(band){
      this.transitionTo('band', band)
    }
  }
});
