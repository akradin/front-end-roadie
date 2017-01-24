import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    delete(){
      this.sendAction('delete',this.get('contact'));
    },
    edit(){
      this.sendAction('edit', this.get('contact'));
    }
  }
});
