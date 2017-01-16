import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    update(){
      console.log("click", this.get('task'));
      this.sendAction('update', this.get('task'));
    }
  }
});
