import Ember from 'ember';

export default Ember.Route.extend({

  model(params){
    return this.get('store').findRecord('band', params.band_id);

  },

  actions:{
    deleteTask(task){
       task.destroyRecord();
    },
    editTask(task){
      this.transitionTo('tasks/edit', task);
    }
  }
});
