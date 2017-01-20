import Ember from 'ember';

export default Ember.Component.extend({
  Task: {
    name: null,
    due_date: null,
    priority: null,
    details: null,
    completed: false,
  },
  actions:{
    createTask(){
      let task = this.get('Task');
      this.set('Task', {});
      task.band = this.get('band');
      this.sendAction('createTask', task);
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
