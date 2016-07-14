var app = {
  // Application Constructor
  initialize: function() {
    this.bindEvents();
  },
  // Bind Event Listeners
  //
  // Bind any events that are required on startup. Common events are:
  // 'load', 'deviceready', 'offline', and 'online'.
  bindEvents: function() {
    document.addEventListener('deviceready', this.onDeviceReady, false);
  },
  // deviceready Event Handler
  //
  // The scope of 'this' is the event. In order to call the 'receivedEvent'
  // function, we must explicitly call 'app.receivedEvent(...);'
  onDeviceReady: function() {
    app.receivedEvent('deviceready');
  },
  // Update DOM on a Received Event
  receivedEvent: function(id) {
    var parentElement = document.getElementById(id);
    // var listeningElement = parentElement.querySelector('.listening');
    // var receivedElement = parentElement.querySelector('.received');

    // listeningElement.setAttribute('style', 'display:none;');
    // receivedElement.setAttribute('style', 'display:block;');

    console.log('Received Event: ' + id);
  }
};
app.initialize();

var objects = [{
  latlng: L.latLng(35.269379, 134.229723),
  title: '諏訪幼稚園・現中町公民館'
}, {
  latlng: L.latLng(35.270289, 134.227492),
  title: '新町筏屋前'
}, {
  latlng: L.latLng(35.269696, 134.228828),
  title: '大正期・横町'
}, {
  latlng: L.latLng(35.270196, 134.227162),
  title: '錦橋'
}, {
  latlng: L.latLng(35.270123, 134.229170),
  title: '横町山崎長栄堂前'
}, {
  latlng: L.latLng(35.267176, 134.231158),
  title: '国道53号工事'
}]
var markers = []
var map = L.map('map');

objects.forEach(function(value, index, array) {
  var marker = L.marker(value.latlng);
  marker.bindPopup('<p>' + value.title + '</p>')
  markers.push(marker);
});

var group = new L.featureGroup(markers);

group.addTo(map);
map.fitBounds(group.getBounds());

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpandmbXliNDBjZWd2M2x6bDk3c2ZtOTkifQ._QA7i5Mpkd_m30IGElHziw', {
  maxZoom: 18,
  attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
    '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
    'Imagery © <a href="http://mapbox.com">Mapbox</a>',
  id: 'mapbox.streets'
}).addTo(map);
