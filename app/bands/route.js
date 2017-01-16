import Ember from 'ember';

export default Ember.Route.extend({
  model(){
    return this.get('store').findAll('band');
  },
  actions:{
    newBand(newBand){
      console.log("new band is", newBand);
      let band = this.get('store').createRecord('band', newBand);
      console.log("last band is", band);
      band.save();
    },
    editBand(band){
      this.transitionTo('bands/edit', band);
    },
    deleteBand(band){
      band.destroyRecord();
    }
  }
});
