angular.module('app.controllers', [])
  
.controller('timewarpCtrl', ['$scope', '$stateParams', 'Flights', '$ionicModal', '$state', 'TripService', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, Flights, $ionicModal, $state, TripService) {
    
    $scope.arrayToString = function(string){
        return string.join(", ");
    };
    
    $scope.tripDetails = TripService.tripDetails();

    $scope.morningFlights = Flights.morning();
    $scope.afternoonFlights = Flights.afternoon();
    $scope.anytimeFlights = Flights.anytime();
    $scope.anytypeFlights = Flights.anytype();
    $scope.whateverFlights = Flights.whatever();
    
    
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
      
    $scope.flightDetails = function(type) {
        $state.go('flightDetails',{'type':type})
    }
    
    $scope.slideChanged = function(index) {
      $scope.slideIndex = index;
    };
}])
   
.controller('addTravellersCtrl', ['$scope', '$stateParams', '$state', 'TravellerService', 'Flights', '$ionicModal', 'TripService', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $state, TravellerService, Flights, $ionicModal, TripService) {
    
    $scope.savedTravellers = TravellerService.travellers;
    $scope.travellersCount = 0
    $scope.flightType = $stateParams.type;
    $scope.flights = Flights[$scope.flightType]();
    $scope.tripDetails = TripService.tripDetails();

    $scope.totalCost = function() {
      if ($scope.savedTravellers) {
        return $scope.flights.price * $scope.savedTravellers.length  
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
   
.controller('paymentCtrl', ['$scope', '$stateParams','TravellerService', 'Flights', '$state', 'TripService','$window', 'PaymentService', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, TravellerService, Flights, $state, TripService, $window, PaymentService) {
    
    $scope.travellers = TravellerService.travellers;
    $scope.flightType = $stateParams.type;
    $scope.flights = Flights[$scope.flightType]();
    $scope.tripDetails = TripService.tripDetails();
    $scope.totalCost = $scope.flights.price * $scope.travellers.length

    $scope.submitPaymentForm = function() {
      firstName = $scope.cardData.name.split(' ')[0];
      lastName = $scope.cardData.name.split(' ')[1];
      month = $scope.cardData.expiry.split('/')[0];
      year = $scope.cardData.expiry.split('/')[1]

      var card = {
        "kind": "credit_card",
        "first_name": firstName,
        "last_name": lastName,
        "number": $scope.cardData.cardNumber,
        "verification_value": $scope.cardData.cvc,
        "month": month,
        "year": year,
        "email": $scope.travellers[0].email
      }

      PaymentService.getToken(card);

    };

    $scope.review = function() {
        $state.go('reviewFarePurchase', {'type':$scope.flightType})  
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
   
.controller('reviewFarePurchaseCtrl', ['$scope', '$stateParams', 'TravellerService', '$ionicModal', 'Flights', 'TripService', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, TravellerService, $ionicModal, Flights, TripService) {

    $scope.savedTravellers = TravellerService.travellers;
    $scope.flightType = $stateParams.type;
    $scope.flights = Flights[$scope.flightType]();
    // $scope.totalCost = $scope.flights.price * $scope.savedTravellers.length
    $scope.tripDetails = TripService.tripDetails();
    
    $scope.confirmation = function() {
        $scope.openModal();
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
   
.controller('flightDetailsCtrl', ['$scope', '$stateParams', 'Flights', '$ionicModal', '$state', 'TripService', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, Flights, $ionicModal, $state, TripService) {
    
    $scope.flightType = $stateParams.type;
    $scope.flights = Flights[$scope.flightType]();
    $scope.tripDetails = TripService.tripDetails();
    
    $scope.bookNow = function() {
        $state.go('addTravellers',{'type':$scope.flightType})
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
 