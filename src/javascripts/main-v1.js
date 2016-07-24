import ol from 'openlayers'
import 'openlayers/dist/ol.css'
import '../stylesheets/main-v2.sass'

window.onload = () => {


// objs

var obj1 = {}
var obj2 = {}

// layers

obj1.layers = {
  osm: new ol.layer.Tile({
    source: new ol.source.OSM()
  })
}

obj2.layers = {
  cyberjapandata: {
    gazo1: new ol.layer.Tile({
      source: new ol.source.XYZ({
        url: 'https://cyberjapandata.gsi.go.jp/xyz/gazo1/{z}/{x}/{y}.jpg',
        projection: 'EPSG:3857',
        attributions: [
          new ol.Attribution({
            html: "<a href='http://maps.gsi.go.jp/development/ichiran.html' target='_blank'>地理院タイル：国土画像情報（第一期：1974～1978年撮影）</a>"
          })
        ]
      })
    })
  }
}

// maps


obj1.map = new ol.Map({
  target: 'map1',
  loadTilesWhileInteracting: true,
  // controls: ol.control.defaults({
  //   attributionOptions: ({
  //     collapsible: false
  //   })
  // }).extend([
  //   new app.RotateNorthControl()
  // ]),
  interactions: ol.interaction.defaults().extend([
    new ol.interaction.DragRotateAndZoom()
  ]),
  view: new ol.View({
    center: ol.proj.fromLonLat([134.229723, 35.269379]),
    zoom: 16,
    minZoom: 4,
    maxZoom: 20
  })
});

obj2.map = new ol.Map({
  target: 'map2',
  loadTilesWhileInteracting: true,
  // controls: ol.control.defaults({
  //   attributionOptions: ({
  //     collapsible: false
  //   })
  // }).extend([
  //   new app.RotateNorthControl()
  // ]),
  interactions: ol.interaction.defaults().extend([
    new ol.interaction.DragRotateAndZoom()
  ]),
  view: new ol.View({
    center: ol.proj.fromLonLat([134.229723, 35.269379]),
    zoom: 16,
    minZoom: 4,
    maxZoom: 20
  })
});

// add layers

obj1.map.addLayer(obj1.layers.osm)
obj2.map.addLayer(obj2.layers.cyberjapandata.gazo1)

// geolocation

navigator.geolocation.getCurrentPosition(function(position) {
  var lonlat = [position.coords.longitude, position.coords.latitude]
  obj1.map.getView().setCenter(ol.proj.fromLonLat(lonlat))
  obj2.map.getView().setCenter(ol.proj.fromLonLat(lonlat))
}, function() {
  console.log(arguments);
}, {
  enableHighAccuracy: true
})

var watchID = navigator.geolocation.watchPosition(function(position) {
  console.log(position);
}, function(error) {
  console.log(error);
})

function onSuccess(heading) {
  console.log(heading);
};

function onError(compassError) {
  console.log(compassError);
};

var options = {
  frequency: 3000
}; // Update every 3 seconds

// var watchID = navigator.compass.watchHeading(onSuccess, onError, options);




// navigator.compass.getCurrentHeading(function() {
//   console.log(heading);
// }, function(error) {
//   console.log(error);
// });

// var deviceOrientation = new ol.DeviceOrientation();
// deviceOrientation.on(['change:alpha'], function(event) {
//   // console.log('wwwwww', event);
// });


// var h1 = 0;
// window.addEventListener('deviceorientation', function(event) {
//   var diff = screen.orientation.angle
//   heading = (event.alpha - 90 - diff) / (180 / Math.PI)
//   h2 = heading
//   if (h1 == 0)
//     h1 = h2
//   if (Math.abs(h1 - h2) > 0.1) {
//     obj1.map.getView().setRotation(heading)
//   }
// }, true);
// deviceOrientation.setTracking(true);

// events (^_^)/

function syncMapView(src, dst) {
  var center = src.getCenter()
  var zoom = src.getZoom()
  var rotation = src.getRotation()
  var resolution = src.getResolution()
  dst.setCenter(center)
  dst.setRotation(rotation)
  dst.setResolution(resolution)
  if (zoom)
    dst.setZoom(zoom)
    // console.log('syncMapView', center, zoom, rotation, resolution);
}

obj1.map.on('pointerdrag', function(event) {
  syncMapView(obj1.map.getView(), obj2.map.getView())
})

obj1.map.on('moveend', function(event) {
  syncMapView(obj1.map.getView(), obj2.map.getView())
})

obj2.map.on('pointerdrag', function(event) {
  syncMapView(obj2.map.getView(), obj1.map.getView())
})

obj2.map.on('moveend', function(event) {
  syncMapView(obj2.map.getView(), obj1.map.getView())
})

}


// var markers = [{
//   coordinates: [134.22972, 35.269379],
//   title: '諏訪幼稚園・現中町公民館'
// }, {
//   coordinates: [134.227492, 35.270289],
//   title: '新町筏屋前'
// }, {
//   coordinates: [134.228828, 35.269696],
//   title: '大正期・横町'
// }, {
//   coordinates: [134.227162, 35.270196],
//   title: '錦橋'
// }, {
//   coordinates: [134.229170, 35.270123],
//   title: '横町山崎長栄堂前'
// }, {
//   coordinates: [134.231158, 35.267176],
//   title: '国道53号工事'
// }]
//
// var geojson = {
//   type: 'FeatureCollection',
//   features: []
// }
// markers.forEach(function(value, index, array) {
//     console.log(value.coordinates);
//     var feature = {
//       type: 'Feature',
//       geometry: {
//         type: 'Point',
//         coordinates: value.coordinates
//       },
//       properties: {
//         title: value.title
//       }
//     }
//     geojson.features.push(feature)
//   })
//   // openlayers
//
// var image = new ol.style.Circle({
//   radius: 5,
//   fill: null,
//   stroke: new ol.style.Stroke({
//     color: 'red',
//     width: 1
//   })
// });
//
// var style = new ol.style.Style({
//   image: image
// })
//
//
// window.app = {};
// var app = window.app;


//
// Define rotate to north control.
//


//
// /**
//  * @constructor
//  * @extends {ol.control.Control}
//  * @param {Object=} opt_options Control options.
//  */
// app.RotateNorthControl = function(opt_options) {
//
//   var options = opt_options || {};
//
//   var button = document.createElement('button');
//   button.innerHTML = 'N';
//
//   var this_ = this;
//
//   var handleRotateNorth = function(e) {
//     console.log('www');
//     layers.osm.setVisible(true)
//     this_.getMap().getView().setRotation(0);
//   };
//
//   button.addEventListener('click', handleRotateNorth, false);
//   button.addEventListener('touchstart', handleRotateNorth, false);
//
//   var element = document.createElement('div');
//   element.className = 'rotate-north ol-unselectable ol-control';
//   element.appendChild(button);
//
//   ol.control.Control.call(this, {
//     element: element,
//     target: options.target
//   });
//
// };
// ol.inherits(app.RotateNorthControl, ol.control.Control);

//   geojson: new ol.layer.Vector({
//     source: new ol.source.Vector({
//       features: (new ol.format.GeoJSON()).readFeatures(geojson, {
//         dataProjection: 'EPSG:4326',
//         featureProjection: 'EPSG:3857'
//       })
//     }),
//     style: new ol.style.Style({
//       image: new ol.style.Icon({
//         anchor: [0.5, 30],
//         anchorXUnits: 'fraction',
//         anchorYUnits: 'pixels',
//         opacity: 0.85,
//         src: 'https://a.tiles.mapbox.com/v4/marker/pin-m+004358.png?access_token=pk.eyJ1IjoiZ2l0aHViIiwiYSI6IjEzMDNiZjNlZGQ5Yjg3ZjBkNGZkZWQ3MTIxN2FkODIxIn0.o0lbEdOfJYEOaibweUDlzA'
//       })
//     }),
//     visible: true
//   })
// }

// var app = {
//   // Application Constructor
//   initialize: function() {
//     this.bindEvents();
//   },
//   // Bind Event Listeners
//   //
//   // Bind any events that are required on startup. Common events are:
//   // 'load', 'deviceready', 'offline', and 'online'.
//   bindEvents: function() {
//     document.addEventListener('deviceready', this.onDeviceReady, false);
//   },
//   // deviceready Event Handler
//   //
//   // The scope of 'this' is the event. In order to call the 'receivedEvent'
//   // function, we must explicitly call 'app.receivedEvent(...);'
//   onDeviceReady: function() {
//     app.receivedEvent('deviceready');
//   },
//   // Update DOM on a Received Event
//   receivedEvent: function(id) {
//     var parentElement = document.getElementById(id);
//     // var listeningElement = parentElement.querySelector('.listening');
//     // var receivedElement = parentElement.querySelector('.received');
//
//     // listeningElement.setAttribute('style', 'display:none;');
//     // receivedElement.setAttribute('style', 'display:block;');
//
//     console.log('Received Event: ' + id);
//   }
// };
// app.initialize();
//

// var markers = []
// var map = L.map('map');
//
// objects.forEach(function(value, index, array) {
//   var marker = L.marker(value.latlng);
//   marker.bindPopup('<p>' + value.title + '</p>')
//   markers.push(marker);
// });
//
// var group = new L.featureGroup(markers);
//
// group.addTo(map);
// map.fitBounds(group.getBounds());
//
