import Ember from 'ember';

export default Ember.Component.extend({
  expense:{
    name: null,
    details: null,
    cost: null
  },
  actions : {
    createExpense(){
      let expense = this.get('expense');
      expense.band = this.get('band');
      this.sendAction('createExpense', expense);
      this.set('expense.name', '');
      this.set('expense.details', '');
      this.set('expense.cost', '');

    },
    editExpense(expense){
      this.sendAction('editExpense', expense);
    },
    deleteExpense(expense){
      this.sendAction('deleteExpense', expense);
    }
  }
});
