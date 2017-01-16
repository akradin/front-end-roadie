import Ember from 'ember';

export default Ember.Component.extend({
  actions :{
    update(){
      console.log(this.get('band'));
      this.sendAction('update', this.get('band'))
    }
  }
});
