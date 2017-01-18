import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  due_date: DS.attr('date'),
  priority: DS.attr('number'),
  details: DS.attr('string'),
  completed: DS.attr('boolean'),
  band: DS.belongsTo('band')
});
