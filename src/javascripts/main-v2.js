import ol from 'openlayers'
import 'jquery'
import 'jquery-ui'
import 'bootstrap-webpack'

import 'openlayers/dist/ol.css'
import '../stylesheets/main-v2.sass'


var obj = {}

obj.layers = {
  osm: new ol.layer.Tile({
    source: new ol.source.OSM()
  })
}

obj.layers.points = new ol.layer.Vector({
  source: new ol.source.Vector({
    url: 'data/evacuation-areas.geojson',
    format: new ol.format.GeoJSON(),
    attributions: [
      new ol.Attribution({
        html: "<a href='http://db.pref.tottori.jp/opendataResearch.nsf/list1_forweb/A6116EF0703660CF49257D66002453E6' target='_blank'>鳥取県オープンデータカタログ</a> and "
      })
    ]

  }),
  style: getMarkerStyle
})

obj.layers.cyberjapandata = {
  gazo1: new ol.layer.Tile({
    visible: false,
    source: new ol.source.XYZ({
      url: 'https://cyberjapandata.gsi.go.jp/xyz/gazo1/{z}/{x}/{y}.jpg',
      projection: 'EPSG:3857',
      attributions: [
        new ol.Attribution({
          html: "<a href='http://maps.gsi.go.jp/development/ichiran.html' target='_blank'>国土画像情報(1974-1978年)</a>"
        })
      ]
    })
  })
}

function getMarkerStyle(feature, resolution) {
  return new ol.style.Style({
    image: new ol.style.Icon(({
      anchor: [0.5, 30],
      anchorXUnits: 'fraction',
      anchorYUnits: 'pixels',
      opacity: 0.85,
      src: 'images/marker-icon.png'
    })),
    text: new ol.style.Text({
      fill: new ol.style.Fill({
        color: '#000000'
      }),
      stroke: new ol.style.Stroke({
        color: '#ffffff',
        width: 2
      }),
      scale: 1.2,
      textAlign: 'center',
      textBaseline: 'bottom',
      offsetY: 0,
      text: `${feature.get('title')}（${feature.get('type')}）`,
      font: "Courier New, monospace"
    })
  })
}

window.onload = () => {
  obj.map = new ol.Map({
    target: 'map',
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
  })

  obj.map.addLayer(obj.layers.osm)
  obj.map.addLayer(obj.layers.cyberjapandata.gazo1)
  obj.map.addLayer(obj.layers.points)

  // navigator.geolocation.getCurrentPosition(function(position) {
  //   var lonlat = [position.coords.longitude, position.coords.latitude]
  //   obj.map.getView().setCenter(ol.proj.fromLonLat(lonlat))
  // }, function() {
  //   console.log(arguments);
  // }, {
  //   enableHighAccuracy: true
  // })

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
  obj.map.addControl(RotateNorthControl);

  // current location button

  var button2 = document.createElement('button');
  button2.innerHTML = 'C';

  var handleLocation = function(e) {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        var lonlat = [position.coords.longitude, position.coords.latitude]
        obj.map.getView().setCenter(ol.proj.fromLonLat(lonlat))
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
  obj.map.addControl(CurrentLocationC);

  // google maps

  var map = new google.maps.Map(document.getElementById('google-maps'), {
    // center: position,
    zoom: 19,
    mapTypeId: google.maps.MapTypeId.HYBRID
  })

  var panorama = new google.maps.StreetViewPanorama(
    document.getElementById('google-street-view'), {
      pov: {
        heading: 34,
        pitch: 10
      }
    }
  )
  map.setStreetView(panorama);

  // on click a marker

  obj.map.on('click', function(evt) {
    var feature = obj.map.forEachFeatureAtPixel(evt.pixel,
      function(feature, layer) {
        return feature
      })
    if (feature) {
      var params = {
        tel: '電話',
        fax: 'FAX',
        address: '住所',
        type: '種別',
        area: 'エリア'
      }
      var content = ''
      Object.keys(params).forEach(function(key) {
          if (feature.get(key))
            content += `<dl><dt>${params[key]}</dt><dd>${feature.get(key)}</dd></dl>`
        })
        // console.log(feature);
      var lonlat = ol.proj.transform(feature.getGeometry().getCoordinates(), 'EPSG:3857', 'EPSG:4326')
        // console.log(lonlat);
        // content += `<img src="https://maps.googleapis.com/maps/api/streetview?size=600x300&location=${lonlat[1]},${lonlat[0]}&heading=151.78&pitch=-0.76&key=${'AIzaSyAybwXU3sWcq5mrpMEO_NVu1oGwAzfRzqg'}" class="img-responsive img-rounded">`
      var modal = $('#marker-description-modal')

      // google maps

      modal.find('.modal-title').text(feature.get('title'))
      modal.find('.content').html(content)



      var position = {
        lat: lonlat[1],
        lng: lonlat[0]
      }

      // position: position,

      modal.modal('show')
      // google.maps.event.trigger(map, "resize");

      // google.maps.event.trigger(map, "resize");

      modal.on("shown.bs.modal", function() {
        google.maps.event.trigger(map, "resize");
        google.maps.event.trigger(panorama, "resize");
        map.setCenter(position);
        panorama.setPosition(position);
      })



    } else {
      // noop
    }
  })

}
