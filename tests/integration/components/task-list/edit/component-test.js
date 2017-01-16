import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('task-list/edit', 'Integration | Component | task list/edit', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{task-list/edit}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#task-list/edit}}
      template block text
    {{/task-list/edit}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
