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

    this.tiers = [{'type':'anytype','title':'Any flights on your dates','description':'You will be booked on a flight with up to two stops departing anytime on your dates.'},
      {'type':'anytime','title':'One stop or less flights leaving anytime','description':'Nonstop or one-stop flights departing anytime during the day.'},
      {'type':'morning','title':'Early Bird Special','description':'Nonstop flights leaving before noon.'},
      {'type':'afternoon','title':'Nonstop flights leaving in the afternoon or evening','description':'Nonstop flights leaving in the afternoon or evening.'},
      {'type':'whatever','title':'Any flights within +/- 3 days of your dates','description':"If you're really flexible and want a great deal."}
    ]

    this.tierDetails = function(tier) {
      array = this.tiers
      for(var i = 0; i < array.length; i+=1) {
        if (array[i]['type'] === tier) {
          return array[i];
        }
      }

      return "flights";
    }
}]);