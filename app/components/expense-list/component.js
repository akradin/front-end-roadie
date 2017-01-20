import Ember from 'ember';

export default Ember.Component.extend({
  Expense:{
    name: null,
    description: null,
    cost: null
  },
  actions : {
    createExpense(){
      let expense = this.get('Expense');
      this.set('Expense', {});
      expense.band = this.get('band');
      this.sendAction('createExpense', expense);
    },
    editExpense(expense){
      this.sendAction('editExpense', expense);
    },
    deleteExpense(expense){
      this.sendAction('deleteExpense', expense);
    }
  }
});
