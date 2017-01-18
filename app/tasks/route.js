import Ember from 'ember';

export default Ember.Route.extend({

  model(params){
    return this.get('store').findRecord('band', params.band_id).get('tasks');

  },

  actions:{
    newTask(newTask){
      this.transitionTo('band/tasks', newTask);
    },
    deleteTask(task){
      console.log("DELETING task is", task);
       task.destroyRecord();
    },
    editTask(task){
      this.transitionTo('tasks/edit', task);
    }
  }
});
