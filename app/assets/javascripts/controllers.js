angular.module('app.controllers', [])
  
.controller('timewarpCtrl', ['$scope','$stateParams','$timeout','Flights', '$ionicModal', '$state', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope,$stateParams,$timeout,Flights, $ionicModal, $state) {
    $scope.dataLoaded = true
    $scope.flightDetails = {}
    $scope.tiers = [{'type':'morning','title':'One Stop Flights Leaving in the Morning','description':'You will be booked on a flight departing between 5:00am and 12:00pm. One stop or less. No red eyes.'},
      {'type':'afternoon','title':'One Stop Flights Leaving in the Afternoon or Evening','description':'You will be booked on a flight Departing between 12:00pm and 10:00pm. One stop or less. No red eyes.'},
      {'type':'anytime','title':'One Stop Flights Leaving Anytime','description':'You will be booked on a flight departing anytime during the day. One stop or less. No red eyes.'},
      {'type':'anytype','title':'Anything on Your Dates','description':'You will be booked on a flight Departing anytime. Two stops or less, with the possibility of red-eyes.'},
      {'type':'whatever','title':'Anything Goes','description':'You will be booked on a flight Departing +/- 3 days of your dates. Includes direct flights, flights with stops, and some red-eyes and overnight flights.'}
    ]

    $scope.bunnyIndex = 1
    $scope.bunnyUrl = ''

    var runBunny = function() {
      if ($scope.bunnyIndex == 13){
        $scope.bunnyIndex = 1;
      } else {
        $scope.bunnyIndex+=1;        
      }
      string = "image-" + $scope.bunnyIndex
      $scope.bunnyUrl = document.getElementById('image-data').dataset[string];
      $timeout(runBunny,10);
    }

    $timeout(runBunny, 10);

    $scope.arrayToString = function(string){
        if (string) {
          return string.join(", ");  
        } else {
          return 'American Airlines, Delta, Jet Blue';
        }
    };

    $scope.getParameterByName = function(name) {
      url = window.location.href;
      name = name.replace(/[\[\]]/g, "\\$&");
      var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
          results = regex.exec(url);
      if (!results) return null;
      if (!results[2]) return '';
      return decodeURIComponent(results[2].replace(/\+/g, " "));
    };
    
    $ionicModal.fromTemplateUrl('howItWorks.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal;
      });
      $scope.openModal = function() {
        $scope.modal.show();
      };
      $scope.closeModal = function() {
        $scope.modal.hide();
      };
      // Cleanup the modal when we're done with it!
      $scope.$on('$destroy', function() {
        $scope.modal.remove();
      });
      // Execute action on hide modal
      $scope.$on('modal.hidden', function() {
        // Execute action
      });
      // Execute action on remove modal
      $scope.$on('modal.removed', function() {
        // Execute action
      });
      
    $scope.flightBreakdown = function(type) {
        $state.go('flightDetails',{'type':type})
    }
    
    $scope.slideChanged = function(index) {
      $scope.slideIndex = index;
    };

    Flights.tripDetails = {'origin': $scope.getParameterByName('origin'),'destination': $scope.getParameterByName('destination'), 'departureDate': $scope.getParameterByName('departure'), 'returnDate': $scope.getParameterByName('return')}
    $scope.tripDetails = Flights.tripDetails;

    promise = Flights.getFlights($scope.tripDetails.origin,$scope.tripDetails.destination,$scope.tripDetails.departureDate,$scope.tripDetails.returnDate);
    promise.then( function(response){
      Flights.flightDetails = response.data;
      $scope.flightDetails = Flights.flightDetails;
      $scope.dataLoaded = false
      document.getElementsByTagName('ion-nav-bar')[0].classList.remove('hide')
    }, function(error_response) {
      console.log(error_response);
    });
}])
   
.controller('addTravellersCtrl', ['$scope', '$stateParams', '$state', '$window','TravellerService', 'Flights', '$ionicModal', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $state, $window,TravellerService, Flights, $ionicModal) {

    if (!Flights.flightDetails) {
      $window.location = $window.location.origin + $window.location.search
    }

    $scope.savedTravellers = TravellerService.travellers;
    $scope.travellersCount = 0
    $scope.flightType = $stateParams.type;
    $scope.flightList = Flights.flightDetails[$scope.flightType];
    $scope.tripDetails = Flights.tripDetails;

    $scope.totalCost = function() {
      if ($scope.savedTravellers) {
        return $scope.flightList.tierPrice * $scope.savedTravellers.length  
      } else {
        return 0
      }
    }
    
    $scope.genders = [
        {
            'id':'male',
            'label':'Male'
        },
        {
            'id':'female',
            'label':'Female'
        }
    ]
    
    $scope.new_traveller = {
        
        'firstName':'',
        'middleName':'',
        'lastName':'',
        'birthday':'',
        'gender': $scope.genders[0].id,
        'email':''
    }
    
    $scope.addTraveller = function(){
        if (TravellerService.travellers) {
            TravellerService.travellers.push($scope.new_traveller);    
        } else {
            TravellerService.travellers = [$scope.new_traveller];
        }
        
        $scope.savedTravellers = TravellerService.travellers;
        $scope.travellersCount = $scope.savedTravellers.length;
        $scope.closeModal();
        $scope.clearTravellerInfo();
    }
    
    $scope.openTravellerModal = function() {
        
        $scope.openModal();
        
    }
    
    $scope.clearTravellerInfo = function() {
        
        $scope.new_traveller = {
            
            'firstName':'',
            'middleName':'',
            'lastName':'',
            'birthday':'',
            'gender': $scope.genders[0].id,
            'email':''
        }
    }
    
    $scope.payment = function() {
        $state.go('payment', {'type':$scope.flightType});
    }
    
    $ionicModal.fromTemplateUrl('addTraveller.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal;
      });
      $scope.openModal = function() {
        $scope.modal.show();
      };
      $scope.closeModal = function() {
        $scope.modal.hide();
      };
      // Cleanup the modal when we're done with it!
      $scope.$on('$destroy', function() {
        $scope.modal.remove();
      });
      // Execute action on hide modal
      $scope.$on('modal.hidden', function() {
        // Execute action
      });
      // Execute action on remove modal
      $scope.$on('modal.removed', function() {
        // Execute action
      });

}])
   
.controller('paymentCtrl', ['$scope', '$stateParams','$location','TravellerService', 'Flights', '$state','$window', 'PaymentService', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $location, TravellerService, Flights, $state, $window, PaymentService) {
    
    if (!Flights.flightDetails) {
      $window.location = $window.location.origin + $window.location.search
    }

    $scope.travellers = TravellerService.travellers;
    $scope.flightType = $stateParams.type;
    $scope.flightDetails = Flights.flightDetails
    $scope.flightList = Flights.flightDetails[$scope.flightType];
    $scope.tripDetails = Flights.tripDetails;
    $scope.formErrors = []

    $scope.totalCost = $scope.flightList.tierPrice * $scope.travellers.length
    $scope.cardError = PaymentService.cardError;

    $scope.submitPaymentForm = function() {
      firstName = $scope.cardData.name.split(' ')[0];
      lastName = $scope.cardData.name.split(' ')[1];
      month = $scope.cardData.expiry.split('/')[0];
      year = $scope.cardData.expiry.split('/')[1]

      var card = {
        "payment_method":{
          "credit_card":{
            "first_name": firstName,
            "last_name": lastName,
            "number":$scope.cardData.cardNumber,
            "verification_value": $scope.cardData.cvc,
            "month":month,
            "year":year,
            "email": $scope.travellers[0].email
          },
          "data": {
            "my_payment_method_identifier": "448",
            "extra_stuff": {
              "some_other_things": "Can be anything really"
            }
          }
        }
      } 

      promise = PaymentService.getToken(card);
      promise.then( function(response){
        token = response['data']['transaction']['payment_method']['token']
        PaymentService.payment_token = token;
        PaymentService.card_number = response['data']['transaction']['payment_method']['number'];
        $state.go('reviewFarePurchase', {'type':$scope.flightType});
      }, function(error_response) {
        $scope.formErrors = error_response['data']['errors']
      });
    };
    
    $scope.countries = [
        {
            'id':'canada',
            'label':'Canada'
        },
        {
            'id':'unitedstates',
            'label':'United States'
        }
    ]
    
    $scope.cardData = {
        'cardNumber': '',
        'expiry': '',
        'cvc': '',
        'country': $scope.countries[0].id,
        'zipCode': '',
        'name': ''
    }
}])
   
.controller('reviewFarePurchaseCtrl', ['$scope', '$state', '$window','$stateParams', 'TravellerService', '$ionicModal', '$ionicHistory','Flights','PaymentService', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $state, $window, $stateParams, TravellerService, $ionicModal, $ionicHistory,Flights,PaymentService) {

    if (!Flights.flightDetails) {
      $window.location = $window.location.origin + $window.location.search
    }

    $scope.savedTravellers = TravellerService.travellers;
    $scope.flightType = $stateParams.type;
    $scope.flightList = Flights.flightDetails[$scope.flightType];
    $scope.totalCost = $scope.flightList.tierPrice * $scope.savedTravellers.length
    $scope.tripDetails = Flights.tripDetails;
    $scope.token = PaymentService.payment_token;
    $scope.card = PaymentService.card_number;
    
    $scope.confirmation = function() {
        promise = PaymentService.chargeCard(PaymentService.payment_token,$scope.totalCost)
        promise.then( function(response){
          if (response['data']['success']) {
            $scope.openModal();
            //do something to confirm purchase
          } else {
            PaymentService.cardError = true
            $ionicHistory.goBack();
          }
        }, function(error_response) {
          console.log('nopeee');
          console.log(error_response);
        });
    };
    
    $ionicModal.fromTemplateUrl('confirmation.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal;
      });
      $scope.openModal = function() {
        $scope.modal.show();
      };
      $scope.closeModal = function() {
        $scope.modal.hide();
      };
      // Cleanup the modal when we're done with it!
      $scope.$on('$destroy', function() {
        $scope.modal.remove();
      });
      // Execute action on hide modal
      $scope.$on('modal.hidden', function() {
        // Execute action
      });
      // Execute action on remove modal
      $scope.$on('modal.removed', function() {
        // Execute action
      });
 
}])
   
.controller('flightDetailsCtrl', ['$scope', '$stateParams', '$window','Flights', '$ionicModal', '$state', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $window, Flights, $ionicModal, $state) {

    if (!Flights.flightDetails) {
      $window.location = $window.location.origin + $window.location.search
    }
    
    $scope.flightType = $stateParams.type;
    $scope.flightDetails = Flights.flightDetails
    $scope.flightList = Flights.flightDetails[$scope.flightType];
    $scope.tripDetails = Flights.tripDetails;
    
    $scope.bookNow = function() {
        $state.go('addTravellers',{'type':$scope.flightType});
    }
    
    $ionicModal.fromTemplateUrl('howItWorks.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal;
      });
      $scope.openModal = function() {
        $scope.modal.show();
      };
      $scope.closeModal = function() {
        $scope.modal.hide();
      };
      // Cleanup the modal when we're done with it!
      $scope.$on('$destroy', function() {
        $scope.modal.remove();
      });
      // Execute action on hide modal
      $scope.$on('modal.hidden', function() {
        // Execute action
      });
      // Execute action on remove modal
      $scope.$on('modal.removed', function() {
        // Execute action
      });
      
    $scope.slideChanged = function(index) {
      $scope.slideIndex = index;
    };
}])
 