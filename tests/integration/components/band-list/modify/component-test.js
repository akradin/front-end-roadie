import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('band-list/modify', 'Integration | Component | band list/modify', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{band-list/modify}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#band-list/modify}}
      template block text
    {{/band-list/modify}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
