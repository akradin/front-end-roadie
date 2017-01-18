import Ember from 'ember';

export default Ember.Component.extend({
  Task: {
    name: null,
    due_date: null,
    priority: null,
    details: null,
    completed: false
  },
  actions:{
    newTask(){
      let task = this.get('Task');
      this.sendAction('newTask', task);
    },
    toggleComplete(){
      console.log('done', this.get('Task'));
    },
    deleteTask(task){
      this.sendAction('deleteTask', task);
    },
    editTask(task){
      this.sendAction('editTask', task);
    },
    completeTask(task){
      this.sendAction('completeTask', task);
    }
  }
});
