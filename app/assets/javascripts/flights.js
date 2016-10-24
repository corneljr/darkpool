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

    this.tiers = [{'type':'anytype','title':'Any flights on your dates','description':'You will be booked on a flight with up to two stops departing anytime on your dates.','stops':'One stop or direct','timeframe':'Anytime on your dates'},
      {'type':'anytime','title':'Flexible Traveller','description':'One stop flights departing anytime during the day.','stops':'One stop or direct','timeframe':'Anytime on your dates'},
      {'type':'morning','title':'Early Bird','description':'Nonstop flights leaving before noon.','stops':'Nonstop','timeframe':'Between 6:00a and 11:55a'},
      {'type':'afternoon','title':'Matinee','description':'Nonstop flights leaving in the afternoon or evening.','stops':'Nonstop','timeframe':'Between 12:00p and 10:00p'},
      {'type':'whatever','title':'Super Saver','description':"Anything +/- 3 days of your dates. Same trip length.", 'stops':'One stop or direct.', 'timeframe':'Anytime during the day, +/- 3 days.'}
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