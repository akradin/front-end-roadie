import ApplicationAdapter from 'roadie/application/adapter';

export default ApplicationAdapter.extend({
  createRecord (store, type, record) {
    let api = this.get('host');
    let serialized = this.serialize(record, { includeid: true });
    console.log("serialized is ", serialized);
    let bandId = serialized.band_id;
    let url = `${api}/band/${bandId}/expenses`;
    let data = { expense : serialized };


    return this.ajax(url, 'POST', { data });
  }
});
