import ol from 'openlayers'

export default class Layers {

  constructor(config) {
    this.layers = {}
    config.tiles.forEach((tile, index) => {
      if (tile.name == 'osm')
        this.addOSM()
      else if (tile.name == 'cyberjapandata')
        this.addCyberJapanData(tile.mapid)
      else
        this.addXYZ(tile.name)
    })
    config.markers.forEach((marker, index) => {
      this.addGeoJSON(marker.name)
    })
  }

  addOSM() {
    this.layers['osm'] = new ol.layer.Tile({
      source: new ol.source.OSM()
    })
  }

  addCyberJapanData(mapid) {
    this.layers[`cyberjapandata/${mapid}`] = new ol.layer.Tile({
      source: new ol.source.XYZ({
        url: `https://cyberjapandata.gsi.go.jp/xyz/${mapid}/{z}/{x}/{y}.jpg`,
        projection: 'EPSG:3857',
        attributions: [
          new ol.Attribution({
            html: "<a href='http://maps.gsi.go.jp/development/ichiran.html' target='_blank'>地理院タイル</a>"
          })
        ]
      })
    })
  }

  addXYZ(name) {
    this.layers[name] = new ol.layer.Tile({
      source: new ol.source.XYZ({
        url: `data/${name}/{z}/{x}/{-y}.png`,
        attributions: [
          new ol.Attribution({
            html: ""
          })
        ]
      })
    })
  }

  addGeoJSON(name) {
    this.layers[name] = new ol.layer.Vector({
      source: new ol.source.Vector({
        url: `data/${name}/data.geojson`,
        format: new ol.format.GeoJSON(),
        attributions: [
          new ol.Attribution({
            html: "<a href='http://db.pref.tottori.jp/opendataResearch.nsf/list1_forweb/A6116EF0703660CF49257D66002453E6' target='_blank'>鳥取県オープンデータカタログ</a> and "
          })
        ]
      }),
      style: this.getMarkerStyle
    })
  }

  getMarkerStyle(feature, resolution) {
    return new ol.style.Style({
      image: new ol.style.Icon(({
        anchor: [0.5, 30],
        anchorXUnits: 'fraction',
        anchorYUnits: 'pixels',
        opacity: 0.9,
        scale: 0.5,
        src: require('../images/marker-icon.png')
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
        text: `${feature.get('title')}`
      })
    })
  }

}
