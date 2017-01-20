import Ember from 'ember';

export default Ember.Component.extend({
  Band: {
    name: null
  },

  actions: {
    newBand(){
      let band = this.get('Band');
      this.set('Band', {});
      this.sendAction('newBand', band);

    },
    editBand(band){
      this.sendAction('editBand', band);
    },
    deleteBand(band){
      this.sendAction('deleteBand', band);
    },
    goToBand(band){
      this.sendAction('goToBand', band);
    }
  }
});
