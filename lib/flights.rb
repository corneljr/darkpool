module Flights

	def parse_flights(origin,destination,departure_date,return_date)
		uri = URI("https://mobile-api.hopper.com/api/v1/cards?origin=#{origin}&destination=#{destination}&departure=#{departure_date}&return=#{return_date}")
		response = Net::HTTP.get(uri)
		parsed_response = JSON.parse(response)

		flights = parsed_response['cards'][0]['trips']
		forecast = parsed_response['cards'][1]['forecast']
		data = parsed_response['data']

		#########################################

		flight_list = {'currentPrice' => forecast['bestRecentPrice'],
					   'targetPrice' => forecast['targetPrice'], 
					   'morning' => {'airlines' => [], 'outbound' => [], 'return' => []},
					   'afternoon' => {'airlines' => [], 'outbound' => [], 'return' => []},
					   'anytime' => {'airlines' => [], 'outbound' => [], 'return' => []},
					   'anytype' => {'airlines' => [], 'outbound' => [], 'return' => []},
					   'whatever' => {'airlines' => [], 'outbound' => [], 'return' => []}
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

				flight_info['duration'] = "#{duration / 60}h #{duration % 60}m"
				flight_info['departureDay'] = DateTime.strptime(departure_epoch_seconds.to_s,"%s").strftime("%b %-d")
				flight_info['departureTime'] = DateTime.strptime(departure_epoch_seconds.to_s,"%s").strftime("%-l:%M%P")
				flight_info['arrivalDay'] = DateTime.strptime(arrival_epoch_seconds.to_s,"%s").strftime("%b %-d")
				flight_info['arrivalTime'] = DateTime.strptime(arrival_epoch_seconds.to_s,"%s").strftime("%-l:%M%P")
				flight_info['airline'] = data['carriers'][data['carriers'].find_index {|x| x['code'] == flight['primary_carrier']}]['name']

				# check if there are long layovers/overnights
				warning = false
				flight['trip_warnings']['sliceInfos'].each do |slice|
					slice['warnings'].each do |warning|
						if warning['level'] == 'high'
							warning = true
						end
					end
				end
				flight_list['anytype']["#{leg}"] << flight_info
				next if warning

				flight_list['anytime']["#{leg}"] << flight_info
				flight_list['morning']["#{leg}"] << flight_info if flight_info['departureTime'].include?('am')
				flight_list['afternoon']["#{leg}"] << flight_info if flight_info['departureTime'].include?('pm')

				# leave this here for now and figure out how to handle 
				flight_list['whatever']["#{leg}"] << flight_info
			end
		end

		flight_list
	end
end