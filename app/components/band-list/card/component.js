import Ember from 'ember';

export default Ember.Component.extend({
  actions : {
    edit(){
      this.sendAction('edit', this.get('band'));
    },
    delete(){
      this.sendAction('delete', this.get('band'));
    },
    goToBand(){
      this.sendAction('goToBand', this.get('band'));
    }
  }
});
