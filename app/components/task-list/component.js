import Ember from 'ember';

export default Ember.Component.extend({
  task: {
    name: null,
    due_date: null,
    priority: null,
    details: null,
    completed: false,
  },
  actions:{
    createTask(){
      let task = this.get('task');
      task.band = this.get('band');
      this.sendAction('createTask', task);
      this.set('task.name', '');
      this.set('task.due_date', '');
      this.set('task.priority', '');
      this.set('task.details', '');
    },
    toggleComplete(){
    },
    deleteTask(task){
      this.sendAction('deleteTask', task);
      task.rollbackAttributes();
    },
    editTask(task){
      this.sendAction('editTask', task);
    },
    completeTask(task){
      this.sendAction('completeTask', task);
    }
  }
});
