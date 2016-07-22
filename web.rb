require 'sinatra/base'

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

  end
end
