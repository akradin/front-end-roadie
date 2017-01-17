import Ember from 'ember';

export default Ember.Component.extend({
  Expense:{
    name: null,
    description: null,
    cost: null
  },
  actions : {
    newExpense(){
      this.sendAction('newExpense', this.get('Expense'));
    },
    editExpense(expense){
      this.sendAction('editExpense', expense);
    },
    deleteExpense(expense){
      this.sendAction('deleteExpense', expense);
    }
  }
});
