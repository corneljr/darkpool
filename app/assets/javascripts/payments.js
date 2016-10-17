angular.module('payment', [])

// .service('PaymentService',['$http',function($http) {
//     this.getToken = function(card) {
//     	$http({
//     		url: "https://core.spreedly.com/v1/payment_methods.json?environment_key=UFfG4cb3JqejWHVsm5fL3ZCqjIk",
//     		method: "POST",
//     		data: card
//     	}).then(function successCallback(response) {
//     		token = response['data']['transaction']['token']
//     		return token
//     	}, function errorCallback(response) {
//     		console.log('ouch');
//     		console.log(response);
//     	});
//     }
// }]);


.service('PaymentService',['$http',function($http) {
    this.getToken = function(card) {
    	return $http({
    		url: "https://core.spreedly.com/v1/payment_methods.json?environment_key=UFfG4cb3JqejWHVsm5fL3ZCqjIk",
    		method: "POST",
    		data: card
    	})
    }

    this.chargeCard = function(token,amount) {
    	return $http({
    		url:'/api/charge_card',
    		method: "POST",
    		data: {'token': token, 'amount':amount}
    	})
    }

    this.payment_token;
    this.card_number;
    this.cardError;
}]);