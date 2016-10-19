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

    this.tiers = [{'type':'morning','title':'Nonstop flights leaving in the morning','description':'You will be booked on a nonstop flight departing on your dates between 5:00am and 12:00pm (noon). No budget airlines.'},
      {'type':'afternoon','title':'Nonstop flights leaving in the afternoon or evening','description':'You will be booked on a nonstop flight Departing between 12:00pm (noon) and 10:00pm. No budget airlines or red-eye flights.'},
      {'type':'anytime','title':'One stop or less flights leaving anytime','description':'You will be booked on a nonstop or one-stop flight departing anytime on your dates between 5:00am and 10:00pm. No budget airlines, long layovers or red-eye flights.'},
      {'type':'anytype','title':'Any flights on your dates','description':'You will be booked on a flight with up to two stops departing anytime on your dates. No long layovers but with the possibility of low-cost carriers or red-eye flights.'},
      {'type':'whatever','title':'Any flights within +/- 3 days of your dates','description':'You will be booked on a flight departing within +/- 3 days of your dates. This includes direct flights, flights with stops, low-cost carriers and possible red-eye flights, but no long layovers.'}
    ]

    this.tierMessage = function(tier) {
      array = this.tiers
      for(var i = 0; i < array.length; i+=1) {
        if (array[i]['type'] === tier) {
          return array[i]['description'];
        }
      }

      return "flights";
    }
}]);