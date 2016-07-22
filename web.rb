require 'sinatra/base'
require 'csv'
require 'digest/md5'

module CoCoMaps
  class Web < Sinatra::Base

    set :public_folder, File.dirname(__FILE__) + '/www'

    configure :production do
      require 'rack/tracker'
      use Rack::Tracker do
        handler :google_analytics, tracker: ENV['GOOGLE_TRACKING_ID']
      end
      require 'rack/ssl-enforcer'
      use Rack::SslEnforcer
    end

    configure :development do
      set :bind, '0.0.0.0'
      require 'sinatra/reloader'
      register Sinatra::Reloader
    end

    get '/' do
      send_file File.join(settings.public_folder, 'index.html')
    end

    get '/data/evacuation-areas.geojson' do
      data = {
        type: 'FeatureCollection',
        features: []
      }
      CSV.foreach('www/data/evacuation-areas.csv', headers: :first_row, encoding:'CP932:UTF-8', converters: :numeric, skip_blanks: true) do |row|
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
      geojson = data.to_json
      cache_control :public
      etag Digest::MD5.hexdigest(geojson)
      content_type 'application/json'
      geojson
    end
  end

end
