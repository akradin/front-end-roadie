import Ember from 'ember';

export default Ember.Route.extend({
  model(params){
    return this.get('store').findRecord('band', params.band_id);
  },
  actions:{
    createExpense(newExpense){
      let expense = this.get('store').createRecord('expense', newExpense);
      return expense.save()
      .then(() => this.get('flashMessages').success('Expense created, remember to turn that into a profit!'))
      .catch(() => {
        this.get('flashMessages')
        .danger('Oh No! Something is not quite right. Make sure you have filled out required fields with the right format. Estimates are okay!');
        expense.rollbackAttributes();
      });
    },
    editExpense(expense){
      this.transitionTo('expenses/edit', expense);
    },
    deleteExpense(expense){
      expense.destroyRecord();
    }
  }

});
