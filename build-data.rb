#!/usr/bin/env ruby

require 'csv'
require 'json'

data = {
  type: 'FeatureCollection',
  features: []
}
CSV.foreach('resources/evacuation-areas.csv', headers: :first_row, encoding:'CP932:UTF-8', converters: :numeric, skip_blanks: true) do |row|
  feature = {
    id: row['ID'],
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [row['経度'], row['緯度']]
    },
    properties: {
      title: row['名称'],
      tel: row['電話'],
      fax: row['ＦＡＸ'],
      address: row['住所'],
      type: row['分類1'],
      area: row['分類2']
    }
  }
  data[:features] << feature
end
File.open('www/evacuation-areas.geojson', 'wb') { |f|
  f.write data.to_json
}
