import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    delete(){
      this.sendAction('delete', this.get('task'));
      console.log('deleting', this.get('task'));

    },
    edit(){
      this.sendAction('edit', this.get('task'));
    },
    complete(){
      this.sendAction('complete', this.get('task'));
    }
  }
});
