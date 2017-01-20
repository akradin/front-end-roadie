import ApplicationAdapter from 'roadie/application/adapter';

export default ApplicationAdapter.extend({
  createRecord (store, type, record) {
    let api = this.get('host');
    let serialized = this.serialize(record, { includeid: true });
    let bandId = serialized.band_id;
    let url = `${api}/band/${bandId}/tasks`;
    let data = { task : serialized };


    return this.ajax(url, 'POST', { data });
  }
});
