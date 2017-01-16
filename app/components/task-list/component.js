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
      console.log("start of task is", task);
      this.sendAction('newTask', this.get('Task'));
    },
    toggleComplete(){
      console.log('done', this.get('Task'));
    },
    deleteTask(task){
      console.log("second step of delete", task);
      this.sendAction('deleteTask', task);
    },
    editTask(task){
      this.sendAction('editTask', task);
      console.log("second step of edit", task);
    },
  }
});
