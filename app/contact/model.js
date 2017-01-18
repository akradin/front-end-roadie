import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  phone_number: DS.attr('string'),
  email: DS.attr('string'),
  company: DS.attr('string'),
  details: DS.attr('string'),
  band: DS.belongsTo('band')
});
