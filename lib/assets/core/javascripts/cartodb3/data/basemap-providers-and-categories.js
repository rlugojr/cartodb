var PROVIDER_LEAFLET = 'leaflet';
var PROVIDER_GOOGLE_MAPS = 'googlemaps';
var CATEGORY_GOOGLE_MAPS = 'GMaps';
var LAYER_TYPE_GOOGLE_MAPS = 'GMapsBase';
var LAYER_TYPE_TILED = 'Tiled';

module.exports = {
  getProvider: function (category) {
    if (!category) {
      return;
    }
    if (this.isGoogleMapsCategory(category)) {
      return PROVIDER_GOOGLE_MAPS;
    }
    return PROVIDER_LEAFLET;
  },

  getLayerType: function (category) {
    if (this.isGoogleMapsCategory(category)) {
      return LAYER_TYPE_GOOGLE_MAPS;
    }
    return LAYER_TYPE_TILED;
  },

  isGoogleMapsCategory: function (category) {
    return category === CATEGORY_GOOGLE_MAPS;
  }
};
