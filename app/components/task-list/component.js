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
      task.band = this.get('band');
      this.sendAction('createTask', task);
      console.log('band is', this.get('band.id'));
      console.log('click?', task);
    },
    toggleComplete(){
      console.log('done', this.get('Task'));
    },
    deleteTask(task){
      this.sendAction('deleteTask', task);
      console.log('second step of deleting', task);
    },
    editTask(task){
      this.sendAction('editTask', task);
    },
    completeTask(task){
      this.sendAction('completeTask', task);
    }
  }
});
