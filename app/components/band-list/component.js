import Ember from 'ember';

export default Ember.Component.extend({
  Band: {
    name: null
  },

  actions: {
    newBand(){
      this.sendAction('newBand', this.get('Band'));
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
