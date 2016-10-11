class ApiController < ApplicationController
	def charge_card
		token = params["token"]
		amount = params["amount"].to_i * 10

		
		uri = URI.parse("https://core.spreedly.com/v1/gateways/#{ENV['spreedly_gateway_token']}/purchase.json")
		request = Net::HTTP::Post.new(uri)
		request.basic_auth(ENV['spreedly_key'], ENV['spreedly_secret'])
		request.content_type = "application/json"
		request.body = JSON.dump({
		  "transaction" => {
		    "payment_method_token" => token,
		    "amount" => amount,
		    "currency_code" => "USD",
		    "retain_on_success" => true
		  }
		})

		response = Net::HTTP.start(uri.hostname, uri.port, use_ssl: uri.scheme == "https") do |http|
			http.request(request)
		end
	
	  parsed_response = JSON.parse(response.body)

	  if parsed_response["transaction"]["succeeded"]
	  	render json: {success: true}
	  else
	  	render json: {success: false}
	  end
	end
end
