import Ember from 'ember';

export default Ember.Route.extend({
  model(){
    return this.get('store').findAll('Band');
  },
  actions:{

    willTransition() {
      let store = this.get('store');
      store.peekAll('band').forEach(function(band) {
        if (band.get('isNew') && band.get('hasDirtyAttributes')) {
          band.rollbackAttributes();
        }
      });
      return true;
    },
    newBand(newBand){
      let band = this.get('store').createRecord('band', newBand);
        return band.save()
        .then(() => this.get('flashMessages').success('Band created, rock on'))
        .catch(() => {
          this.get('flashMessages')
          .danger('Oh No! you need to add a name!');
        })
        .then(()=> band.rollbackAttributes());

    },
    editBand(band){
      this.transitionTo('bands/edit', band);
    },
    deleteBand(band){
      return band.destroyRecord()
      .then(() => this.get('flashMessages').success('Band deleted, sorry to hear it!'))
      .catch(() => {
        this.get('flashMessages')
        .danger('Oh No! you cannot delete a band that has conent');
      });
    },
    goToBand(band){
      this.transitionTo('band', band);
    }
  }
});
