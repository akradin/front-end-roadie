import Ember from 'ember';

export default Ember.Route.extend({
  actions:{
    newBand(newBand){
      console.log("new band is", newBand);
    }
  }
});
