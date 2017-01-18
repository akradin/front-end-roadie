import Ember from 'ember';

export default Ember.Route.extend({

  model(){
    return this.get('store').findAll('Task');

  },

  actions:{
    newTask(newTask){
      console.log("new Task is", newTask);
      let task = this.get('store').createRecord('task', newTask);
      console.log(" saved task is", task);
      task.save();
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
