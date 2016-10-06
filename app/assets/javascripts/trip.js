angular.module('trip', [])

.service('TripService',[function() {
    this.tripDetails = function() {
        return {
            'origin':'Montreal',
            'destination':'Honolulu',
            'departureDate':'Thurs, Oct 31',
            'returnDate':'Wed, Nov 8'
        }
    }
}]);