import Ember from 'ember';

export default Ember.Route.extend({
  model(){
  return this.get('store').findAll('expense');
  },
  actions:{
    newExpense(newExpense){
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
