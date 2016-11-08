class ConfirmationMailer < BaseMandrillMailer

	def send_confirmation(email,travellers,origin,destination,departure_date,return_date,amount,booking_id,tier_details)
		subject = "Your Hopper Receipt"

		merge_vars = {
			"booking_number" => booking_id,
			"destination" => destination.split('/').last,
			"departure_date" => departure_date,
			"origin" => origin.split('/').last,
			"return_date" => return_date,
			"travellers" => travellers,
			"total_cost" => amount,
			"tier_details" => tier_details
		}

		body = mandrill_template(merge_vars)
		send_mail(email, subject, body)
	end
end
