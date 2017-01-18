import Ember from 'ember';

export default Ember.Route.extend({
  model(params){
    return this.get('store').findRecord('band', params.band_id);
  },
  actions:{
    createExpense(newExpense){
      let expense = this.get('store').createRecord('expense', newExpense);
      expense.save();
    },
    editExpense(expense){
      this.transitionTo('expenses/edit', expense);
    },
    deleteExpense(expense){
      expense.destroyRecord();
    }
  }

});
