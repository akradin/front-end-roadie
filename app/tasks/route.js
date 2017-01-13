import Ember from 'ember';

export default Ember.Route.extend({
  model(){
    return this.get('store').findAll('Task');
  },
  actions:{
    newTask(newTask){
      console.log("new Task is", newTask);
      let task = this.get('store').createRecord('task', newTask);
      console.log("task is", task);
      task.save();
    }
  }
});
