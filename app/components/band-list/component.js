import Ember from 'ember';

export default Ember.Component.extend({
  Band: {
    name: null
  },

  actions: {
    newBand(){
      console.log(" band is", this.get('Band'));
      this.sendAction('newBand', this.get('Band'));
    },
  }
});
