source 'https://rubygems.org'
ruby '2.3.1'

gem 'sinatra'
gem 'puma'

group :production do
  gem 'rack-tracker'
  gem 'rack-ssl-enforcer'
end

group :development do
  gem 'foreman'
  gem 'sinatra-contrib' # for sinatra/reloader
end
