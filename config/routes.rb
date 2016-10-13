Rails.application.routes.draw do
  root to: 'darkpool#index'

  post '/api/charge_card', to: 'api#charge_card'
  get '/api/get_flights', to: 'api#get_flights'
  get '/api/get_forcast', to: 'api#get_forcast'
end
