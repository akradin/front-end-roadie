import Ember from 'ember';

export default Ember.Component.extend({
  actions :{
    update(){
      this.sendAction('update', this.get('band'));
    }
  }
});
