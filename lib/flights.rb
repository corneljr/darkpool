module Flights

	def parse_flights(origin,destination,departure_date,return_date)
		uri = URI("https://mobile-api.hopper.com/api/v1/cards?origin=#{origin}&destination=#{destination}&departure=#{departure_date}&return=#{return_date}&trip_filter=NoLCC")
		response = Net::HTTP.get(uri)
		parsed_response = JSON.parse(response)
		flights = parsed_response['cards'][0]['trips']
		forecast = parsed_response['cards'][1]['forecast']
		data = parsed_response['data']

		#########################################
		# nonstop forecast

		nonstop_uri = URI("https://mobile-api.hopper.com/api/v1/cards?origin=#{origin}&destination=#{destination}&departure=#{departure_date}&return=#{return_date}&trip_filter=And%28NonStop%2CNoLCC%29")
		nonstop_response = Net::HTTP.get(nonstop_uri)
		nonstop_parsed_response = JSON.parse(nonstop_response)

		if nonstop_parsed_response['cards'].empty?
			nonstopCurrentPrice = 0
			nonstopTargetPrice = 0
			nonstopAvailableDiscount = 0
		else
			nonstop_forecast = nonstop_parsed_response['cards'][1]['forecast']

			nonstopCurrentPrice = nonstop_forecast['bestRecentPrice']
			nonstopTargetPrice = nonstop_forecast['targetPrice']
			nonstopAvailableDiscount = nonstopCurrentPrice - nonstopTargetPrice
		end

		#########################################

		currentPrice = forecast['bestRecentPrice']
		targetPrice = forecast['targetPrice']
		availableDiscount = currentPrice - targetPrice

		origin_airport_code = origin.split('/').last
		origin_type = origin.split('/').first
		destination_airport_code = destination.split('/').last
		destination_type = destination.split('/').first

		if origin_type == 'airport'
			origin_city = data['airports'][data['airports'].find_index {|x| x['iata_code'] == origin_airport_code}]['served_entity']['name']
		else
			origin_city = data['airports'][data['airports'].find_index {|x| x['mac_iata_code'] == origin_airport_code}]['served_entity']['name']
		end

		if destination_type == 'airport'
			destination_city = data['airports'][data['airports'].find_index {|x| x['iata_code'] == destination_airport_code}]['served_entity']['name']
		else
			destination_city = data['airports'][data['airports'].find_index {|x| x['mac_iata_code'] == destination_airport_code}]['served_entity']['name']
		end

		flight_list = {'currentPrice' => currentPrice,
					   'targetPrice' => targetPrice,
					   'origin' => origin_city,
					   'destination' => destination_city, 
					   'departureDate' => departure_date,
					   'returnDate' => return_date,
					   'flexNonstop' => {'currentPrice' => nonstopCurrentPrice, 'tierPrice' => nonstopCurrentPrice - (nonstopAvailableDiscount * 0.8).to_i,'savings' => (nonstopAvailableDiscount * 0.8).to_i,'airlines' => [], 'outbound' => [], 'return' => []},
					   'nonstop' => {'currentPrice' => nonstopCurrentPrice, 'tierPrice' => nonstopCurrentPrice - (nonstopAvailableDiscount * 0.5).to_i,'savings' => (nonstopAvailableDiscount * 0.5).to_i,'airlines' => [], 'outbound' => [], 'return' => []},
					   'onestop' => {'currentPrice' => currentPrice, 'tierPrice' => currentPrice - (availableDiscount * 0.5).to_i,'airlines' => [],'savings' => (availableDiscount * 0.5).to_i,'outbound' => [], 'return' => []},
					   'flex' => {'currentPrice' => currentPrice, 'tierPrice' => currentPrice - (availableDiscount * 0.8).to_i,'airlines' => [],'savings' => (availableDiscount * 0.8).to_i,'outbound' => [], 'return' => []}
					}

		flight_nums = []

		flights.each do |flight|

			['outbound','return'].each do |leg|

				flight_info = {}

				segment_flight_numbers = []

				flight['segments'].each do |segment|
					if segment['outgoing'] && leg == 'outbound'
						segment_flight_numbers << segment['flight_number']
					elsif !segment['outgoing'] && leg == 'return'
						segment_flight_numbers << segment['flight_number']
					end
				end

				if (flight_nums & segment_flight_numbers).empty?
					flight_nums.push(*segment_flight_numbers)
				else
					next
				end

				flight_info['stops'] = flight["#{leg}_stops"]
				departure_epoch_seconds = ((flight["#{leg}_departure_time"].to_i + flight["#{leg == 'outbound' ? 'return' : 'outbound'}_arrival_tz_offset"].to_i) / 1000)
				arrival_epoch_seconds = ((flight["#{leg}_arrival_time"].to_i + flight["#{leg == 'outbound' ? 'outbound' : 'return'}_arrival_tz_offset"].to_i) / 1000)

				duration = flight["#{leg}_duration"].to_i

				flight_info['airline'] = data['carriers'][data['carriers'].find_index {|x| x['code'] == flight['primary_carrier']}]['name']
				next if flight_info['airline'] == 'Frontier' || flight_info['airline'] == 'Spirit'

				flight_info['duration'] = "#{duration / 60}h #{duration % 60}m"
				flight_info['duration_minutes'] = duration
				flight_info['departureDay'] = DateTime.strptime(departure_epoch_seconds.to_s,"%s").strftime("%b %-d")
				flight_info['departureTime'] = DateTime.strptime(departure_epoch_seconds.to_s,"%s").strftime("%-l:%M%P")
				flight_info['arrivalDay'] = DateTime.strptime(arrival_epoch_seconds.to_s,"%s").strftime("%b %-d")
				flight_info['arrivalTime'] = DateTime.strptime(arrival_epoch_seconds.to_s,"%s").strftime("%-l:%M%P")

				airline_logo = ActionController::Base.helpers.image_url("#{flight["primary_carrier"]}_icon.png")

				flight_info['airline_image_url'] = airline_logo

				tester = test_for_warnings(flight)

				next if tester

				if flight_info['stops'] == 0

					flight_list['nonstop']["#{leg}"] << flight_info
					flight_list['nonstop']['airlines'] << flight_info['airline'] unless flight_list['nonstop']['airlines'].include?(flight_info['airline'])

					flight_list['flexNonstop']["#{leg}"] << flight_info
					flight_list['flexNonstop']['airlines'] << flight_info['airline'] unless flight_list['flexNonstop']['airlines'].include?(flight_info['airline'])
				end

				if flight_info['stops'] < 2
					flight_list['onestop']["#{leg}"] << flight_info	
					flight_list['onestop']['airlines'] << flight_info['airline'] unless flight_list['onestop']['airlines'].include?(flight_info['airline'])
				end

				flight_list['flex']["#{leg}"] << flight_info
				flight_list['flex']['airlines'] << flight_info['airline'] unless flight_list['flex']['airlines'].include?(flight_info['airline'])
			end
		end

		flight_list
	end

	def test_for_warnings(flight)
		tester = false
		# flight['trip_warnings']['sliceInfos'].each do |slice|
		# 	slice['warnings'].each do |warning|
		# 		if warning['level'] == 'high'
		# 			tester = true
		# 		end
		# 	end
		# end

		flight['trip_warnings']['sliceInfos'].each do |slice|
			slice['warnings'].each do |warning|
				if warning['warning'] == 'This trip includes a long layover.'
					tester = true
				end
			end
		end

		return tester
	end
end