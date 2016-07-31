import ol from 'openlayers'
import 'jquery'
import 'jquery-ui'
import 'bootstrap-webpack!../../bootstrap.config.js'
import 'openlayers/dist/ol.css'
import '../stylesheets/main-v2.sass'
import Layers from './layers.js'

var layers = undefined
var map = new ol.Map({
  loadTilesWhileInteracting: true,
  interactions: ol.interaction.defaults().extend([
    new ol.interaction.DragRotateAndZoom()
  ]),
  view: new ol.View({
    zoom: 16,
    minZoom: 4,
    maxZoom: 20
  })
})

window.onload = () => {
  map.setTarget('map')
}

$.getJSON('data/config.json')
  .done(function(config) {
    layers = new Layers(config)
    Object.keys(layers.layers).forEach((key) => {
      var layer = layers.layers[key]
      map.addLayer(layer)
    })
    map.getView().setCenter(ol.proj.fromLonLat(config.map.view.center))

  })
  .fail(function() {
    console.log('error', arguments)
  })

map.on('click', function(evt) {
  var feature = map.forEachFeatureAtPixel(evt.pixel, (feature, layer) => {
    return feature
  })
  if (!feature)
    return
  var content = ''
  var props = feature.getProperties()
  Object.keys(props).forEach((name) => {
    switch (name) {
      case 'id':
      case 'title':
      case 'longitude':
      case 'latitude':
      case 'title':
      case 'headers':
      case 'geometry':
        return
      default:
        if(props[name])
          content += `<dl><dt>${name}</dt><dd>${props[name]}</dd></dl>`
    }
  })
  var lonlat = ol.proj.transform(feature.getGeometry().getCoordinates(), 'EPSG:3857', 'EPSG:4326')
  var url = `http://maps.google.com/?ll=${lonlat[1]},${lonlat[0]}&z=19&t=h&q=${lonlat[1]},${lonlat[0]}(${feature.get('title')})`
  var modal = $('#marker-description-modal')
  modal.find('.modal-title').html('<span class="glyphicon glyphicon-map-marker" aria-hidden="true"></span> ' + feature.get('title'))
  modal.find('.modal-body').html(content)
  $('#google-maps-link').attr('href', url)
  modal.modal('show')
})

// swicher button

var button = document.createElement('button');
button.innerHTML = 'M';

var handleRotateNorth = function(e) {
var layer1 = obj.layers.osm
layer1.setVisible(!layer1.getVisible())
var layer2 = obj.layers.cyberjapandata.gazo1
layer2.setVisible(!layer2.getVisible())
}

button.addEventListener('click', handleRotateNorth, false);



var element = document.createElement('div');
element.className = 'rotate-north ol-unselectable ol-control';
element.appendChild(button);

var RotateNorthControl = new ol.control.Control({
  element: element
})
map.addControl(RotateNorthControl);

// current location button

var button2 = document.createElement('button');
button2.innerHTML = 'C';

var handleLocation = function(e) {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var lonlat = [position.coords.longitude, position.coords.latitude]
      map.getView().setCenter(ol.proj.fromLonLat(lonlat))
    }, function() {
      console.log(arguments);
    }, {
      enableHighAccuracy: true
    })
  }
};

button2.addEventListener('click', handleLocation, false);

var element2 = document.createElement('div');
element2.className = 'current-location ol-unselectable ol-control';
element2.appendChild(button2);
var CurrentLocationC = new ol.control.Control({
  element: element2
})
map.addControl(CurrentLocationC);
