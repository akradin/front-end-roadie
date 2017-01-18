import Ember from 'ember';

export default Ember.Route.extend({
  model (params) {
    return this.get('store').findRecord('Expense', params.expense_id);
  },
  actions:{
    updateSave(expense){
      expense.save();
      this.transitionTo('bands');
    }
  }
});
