angular.module('flights', [])

.service('Flights',[function() {
    
    this.morning = function() {
        return {
            'price':816,
            'originalPrice':1023,
            'origin':'Montreal',
            'destination':'Honolulu',
            'airlines':['United Airlines','American Airlines','Jet Blue'],
            'data': [
              {
                'airline': 'American Airlines',
                'time': '6:25am - 5:12pm',
                'duration': '13h 47m',
                'stops':1
              },
              {
                'airline': 'United Airlines',
                'time': '6:15am - 4:12pm',
                'duration': '11h 47m',
                'stops':1  
              },
              {
                'airline': 'Haiwain Airlines',
                'time': '5:25am - 4:12pm',
                'duration': '12h 47m',
                'stops':1
              },
              {
                'airline': 'Jet Blue',
                'time': '7:25am - 6:12pm',
                'duration': '14h 47m',
                'stops':1
              }
            ]
        }
    };
    
    this.afternoon = function() {
        return {
            'price':816,
            'originalPrice':1023,
            'origin':'Montreal',
            'destination':'Honolulu',
            'airlines':['United Airlines','American Airlines','Jet Blue'],
            'data': [
              {
                'airline': 'American Airlines',
                'time': '1:25pm - 10:12pm',
                'duration': '7h 47m',
                'stops':1
              },
              {
                'airline': 'United Airlines',
                'time': '2:15pm - 8:12pm',
                'duration': '6h 47m',
                'stops':1  
              },
              {
                'airline': 'Haiwain Airlines',
                'time': '3:25am - 11:12pm',
                'duration': '8h 47m',
                'stops':1
              },
              {
                'airline': 'Jet Blue',
                'time': '3:25am - 10:12pm',
                'duration': '7h 47m',
                'stops':1
              }
            ]
        }
    };

    this.anytime = function() {
        return {
            'price':786,
            'originalPrice':1023,
            'origin':'Montreal',
            'destination':'Honolulu',
            'airlines':['United Airlines','American Airlines','Jet Blue'],
            'data': [
              {
                'airline': 'American Airlines',
                'time': '6:25am - 5:12pm',
                'duration': '13h 47m',
                'stops':1
              },
              {
                'airline': 'United Airlines',
                'time': '6:15am - 4:12pm',
                'duration': '11h 47m',
                'stops':1  
              },
              {
                'airline': 'Haiwain Airlines',
                'time': '5:25am - 4:12pm',
                'duration': '12h 47m',
                'stops':1
              },
              {
                'airline': 'Jet Blue',
                'time': '1:25pm - 11:12pm',
                'duration': '10h 47m',
                'stops':1
              }
            ]
        }
    };
    
    this.anytype = function() {
        return {
            'price':746,
            'originalPrice':1023,
            'origin':'Montreal',
            'destination':'Honolulu',
            'airlines':['United Airlines','American Airlines','Jet Blue'],
            'data': [
              {
                'airline': 'American Airlines',
                'time': '6:25am - 5:12pm',
                'duration': '13h 47m',
                'stops':2
              },
              {
                'airline': 'United Airlines',
                'time': '6:15am - 4:12pm',
                'duration': '11h 47m',
                'stops':3  
              },
              {
                'airline': 'Haiwain Airlines',
                'time': '5:25am - 4:12pm',
                'duration': '12h 47m',
                'stops':2
              },
              {
                'airline': 'Jet Blue',
                'time': '7:25am - 6:12pm',
                'duration': '14h 47m',
                'stops':2
              }
            ]
        }
    };

    this.whatever = function() {
        return {
            'price':710,
            'originalPrice':1023,
            'origin':'Montreal',
            'destination':'Honolulu',
            'airlines':['United Airlines','American Airlines','Jet Blue'],
            'data': [
              {
                'airline': 'American Airlines',
                'time': '6:25am - 5:12pm',
                'duration': '13h 47m',
                'stops':1
              },
              {
                'airline': 'United Airlines',
                'time': '6:15am - 4:12pm',
                'duration': '11h 47m',
                'stops':1  
              },
              {
                'airline': 'Haiwain Airlines',
                'time': '5:25am - 4:12pm',
                'duration': '12h 47m',
                'stops':1
              },
              {
                'airline': 'Jet Blue',
                'time': '7:25am - 6:12pm',
                'duration': '14h 47m',
                'stops':1
              },
              {
                'airline': 'Jet Blue',
                'time': '8:25am - 6:12pm',
                'duration': '13h 47m',
                'stops':1
              },
              {
                'airline': 'Jet Blue',
                'time': '10:25am - 6:12pm',
                'duration': '12h 47m',
                'stops':1
              }
            ]
        }
    };
}]);