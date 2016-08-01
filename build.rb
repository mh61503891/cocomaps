#!/usr/bin/env ruby

require 'csv'
require 'json'
require 'fileutils'
require 'awesome_print'
require 'systemu'


# TODO migrate to node.js
# TODO dry-run
class AppGenerator

  def initialize(src_dir_path, dst_dir_path)
    @src_dir_path = src_dir_path
    @dst_dir_path = dst_dir_path
    @src_config_file_path = File.join(@src_dir_path, 'config.json')
    @dst_config_file_path = File.join(@dst_dir_path, 'config.json')
  end

  def generate
    FileUtils.mkdir_p(@dst_dir_path)
    FileUtils.cp(@src_config_file_path, @dst_config_file_path)
    config = JSON.parse(open(@src_config_file_path){ |f| f.read }, symbolize_names:true)
    config[:tiles].each do |tile|
      case tile[:name]
      when 'osm', 'cyberjapandata'
        # noop
      else
        on_xyz(tile[:name])
      end
    end
    config[:markers].each do |marker|
      on_geojson(marker[:name])
    end
  end


  def on_xyz(name)
    output_dir_path = File.join(@dst_dir_path, name)
    FileUtils.mkdir_p(output_dir_path)
    gcps_file_path = File.join(@src_dir_path, name, 'data.points')
    # TODO jpg
    image_file_path = File.join(@src_dir_path, name, 'data.jpg')
    # TODO path
    gdal2tiles_path = '/opt/local/share/doc/py27-gdal/examples/scripts/gdal2tiles.py'
    puts systemu("gcps2tiles generate --gcps-file-path=#{gcps_file_path} --image-file-path=#{image_file_path} --gdal2tiles-path=#{gdal2tiles_path} --output-dir-path=#{output_dir_path}")
  end

  def on_geojson(name)
    FileUtils.mkdir_p(File.join(@dst_dir_path, name))
    csv_file_path = File.join(@src_dir_path, name, 'data.csv')
    geojson_file_path = File.join(@dst_dir_path, name, 'data.geojson')
    Converter.csv_to_geojson(csv_file_path, geojson_file_path)
  end

end

class Converter

  def self.csv_to_geojson(csv_file_path, geojson_file_path)
    CSV.open(csv_file_path, headers: :first_row, encoding:'CP932:UTF-8', converters: :numeric, skip_blanks: true) do |csv|
      data = {
        type: 'FeatureCollection',
        features: []
      }
      csv.each do |row|
        feature = {
          id: row['id'],
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [row['longitude'], row['latitude']],
          },
          properties: row.to_h.merge(headers:csv.headers)
        }
        data[:features] << feature
      end
      File.open(geojson_file_path, 'wb') { |f|
        f.write data.to_json
      }
    end
  end
end

AppGenerator.new('resources', 'www/data').generate()
