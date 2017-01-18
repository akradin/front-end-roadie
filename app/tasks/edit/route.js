import Ember from 'ember';

export default Ember.Route.extend({
  model (params) {
    return this.get('store').findRecord('Task', params.task_id);
  },
  actions : {
    saveUpdate(task){
      console.log("task is", task);
      task.save();
      this.transitionTo('bands');
    }
  }

});
