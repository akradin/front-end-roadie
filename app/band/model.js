import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  tasks: DS.hasMany('tasks'),
  expenses: DS.hasMany('expenses'),
  contacts: DS.hasMany('contacts')
});
