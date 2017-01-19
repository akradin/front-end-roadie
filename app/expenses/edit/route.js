import Ember from 'ember';

export default Ember.Route.extend({
  model (params) {
    return this.get('store').findRecord('Expense', params.expense_id);
  },
  actions:{
    updateSave(expense){
      return expense.save()
      .then(() => this.get('flashMessages').success('Updated! We are still working out the kinks, so for now you have to click to get back to your band'))
      .then(() => this.transitionTo('bands'))
      .catch(() => {
        this.get('flashMessages')
        .danger('Oh No! Something is not quite right. Make sure you have filled out required fields with the right format');
        expense.rollbackAttributes();
      });
    }
  }
});
