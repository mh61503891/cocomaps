import ol from 'openlayers'

export default class Layers {

  constructor(config) {
    this.layers = {}
    if (config.tiles) {
      config.tiles.forEach((tile) => {
        if (tile.id == 'osm')
          this.addOSM()
        else
          this.addXYZ(tile)
      })
    }
    if (config.markers) {
      config.markers.forEach((marker) => {
        this.addGeoJSON(marker.name)
      })
    }
    this.switchTiles()
  }

  addOSM() {
    this.layers['osm'] = new ol.layer.Tile({
      visible: false,
      source: new ol.source.OSM()
    })
  }

  addXYZ(tile) {
    this.layers[tile.id] = new ol.layer.Tile({
      visible: false,
      source: new ol.source.XYZ({
        url: tile.url,
        projection: 'EPSG:3857',
        attributions: [
          new ol.Attribution({
            html: `<a href='${tile.attribution.url}' target='_blank'>${tile.attribution.title}</a>`
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
        text: `${feature.get('name')}`
      })
    })
  }

  // TODO Refactor
  switchTiles() {
    // 1st-loop
    var flag = false
    var updated = false
    Object.keys(this.layers).forEach((key, index) => {
        var layer = this.layers[key]
        if (layer instanceof ol.layer.Tile) {
          if (!flag && layer.getVisible()) {
            layer.setVisible(false)
            flag = true
          } else if (flag && !updated) {
            layer.setVisible(true)
            updated = true
          }
        }
      })
      // 2st-loop
    var flag2 = false
    Object.keys(this.layers).forEach((key, index) => {
      var layer = this.layers[key]
      if (layer instanceof ol.layer.Tile && !updated) {
        layer.setVisible(true)
        updated = true
      }
    })
  }

}
