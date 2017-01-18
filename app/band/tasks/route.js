import Ember from 'ember';

export default Ember.Route.extend({
  model(params){
    return this.get('store').findRecord('band', params.band_id);
  },
  actions: {
    newTask(newTask){
      let task = this.get('store').createRecord('task', newTask);
      task.save()
    }
  },
});
