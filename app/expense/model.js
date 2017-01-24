import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  details: DS.attr('string'),
  cost: DS.attr('number'),
  band: DS.belongsTo('band')
});
