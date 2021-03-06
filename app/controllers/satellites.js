import Ember from 'ember';
import country_data from 'npm:country-data';
import customSuggestionTemplate from '../templates/components/satellite-typeahead/suggestion';

const { get, set } = Ember;

function displayName(city='', state='', country='') {
  var city = city;
  var state = state;
  var country = country_data.countries[country];
  country = country ? (country = country.name) : ''
  return `${city}, ${state ? state + ', ': ''}${country}`
}

export default Ember.Controller.extend({

  satellites: Ember.inject.service('satellites'),

  init(){
    this.satelliteQuery = this.satelliteQuery.bind(this);
  },

  customSuggestionTemplate: customSuggestionTemplate,

  satelliteQuery(query, syncResults) {
    const regex = new RegExp(`.*${query}.*`, 'i');

    var filtered = this.get('satellites.list').filter((item) => {
      return regex.test(get(item, 'displayName'));
    });
    syncResults(filtered);
  },

  transformSelection(selection){
    return (selection) ? get(selection, 'displayName') : '';
  },

  satelliteCount: Ember.computed('satellites.list', function(){
    return (this.get('satellites.list') || []).length;
  }),

  actions: {
    selectSatelliteTypeahead(data){
      // if (data) this.transitionToRoute('satellite', get(data, 'uriName'));
      if ( !data ) return;
      var url = get(data, 'website') || get(data, 'facebook') || get(data, 'twitter') || get(data, 'instagram') || ( get(data, 'email') && 'mailto:'+get(data, 'email') );
      url && window.open(url, "_blank");
      return false;
    }
  }

});