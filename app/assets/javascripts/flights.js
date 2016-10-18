angular.module('flights', [])

.service('Flights',['$http',function($http) {
    
    this.flightDetails;
    this.tripDetails;

    this.getFlights = function(origin,destination,departure_date,return_date) {
    	url = '/api/get_flights?origin=' + origin + '&destination=' + destination + '&departure_date=' + departure_date + '&return_date=' + return_date;
        return $http({
          url: url,
          method: "GET",
          data: {origin: origin, destination: destination, departure_date: departure_date, return_date: return_date}
        })
    };

    this.tiers = [{'type':'morning','title':'One Stop Flights Leaving in the Morning','description':'You will be booked on a flight departing between 5:00am and 12:00pm. One stop or less. No red eyes.'},
      {'type':'afternoon','title':'One Stop Flights Leaving in the Afternoon or Evening','description':'You will be booked on a flight Departing between 12:00pm and 10:00pm. One stop or less. No red eyes.'},
      {'type':'anytime','title':'One Stop Flights Leaving Anytime','description':'You will be booked on a flight departing anytime during the day. One stop or less. No red eyes.'},
      {'type':'anytype','title':'Anything on Your Dates','description':'You will be booked on a flight Departing anytime. Two stops or less, with the possibility of red-eyes.'},
      {'type':'whatever','title':'Anything Goes','description':'You will be booked on a flight Departing +/- 3 days of your dates. Includes direct flights, flights with stops, and some red-eyes and overnight flights.'}
    ]

    this.tierMessage = function(tier) {
      array = this.tiers
      for(var i = 0; i < array.length; i+=1) {
        if (array[i]['type'] === tier) {
          return array[i]['title'];
        }
      }

      return "flights";
    }
}]);