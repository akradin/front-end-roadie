import Ember from 'ember';

export default Ember.Route.extend({
  model (params) {
    return this.get('store').findRecord('Band', params.band_id);
  },
  actions : {
    updateBand(band){
      band.save();
      this.transitionTo('bands');
    }
  }
});
