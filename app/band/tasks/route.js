import Ember from 'ember';

export default Ember.Route.extend({
  model(params){
    return this.get('store').findRecord('band', params.band_id);
  },
  actions: {
    createTask(newTask){
      let task = this.get('store').createRecord('task', newTask);
      console.log(task);
      return task.save()
      .then(() => this.get('flashMessages').success('Task created, keep making working hard!'))
      .catch(() => {
        this.get('flashMessages')
        .danger('Oh No! Something is not quite right. Make sure you have filled out required fields with the right format');
        task.rollbackAttributes();
      });

    },
    editTask(task){
      this.transitionTo('tasks/edit', task);
    },
    deleteTask(task){
      task.destroyRecord();
    }
  },
});
