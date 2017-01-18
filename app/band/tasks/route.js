import Ember from 'ember';

export default Ember.Route.extend({
  model(params){
    return this.get('store').findRecord('band', params.band_id);
  },
  actions: {
    createTask(newTask){
      let task = this.get('store').createRecord('task', newTask);
      // console.log("band id is", this.get('band'));
      task.save();
    },
    editTask(task){
      this.transitionTo('tasks/edit', task);
    },
    deleteTask(task){
      task.destroyRecord();
    }
  },
});
