import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    delete(){
      console.log("first step of delete", this.get('task'));
      this.sendAction('delete', this.get('task'));

    }
  }
});
