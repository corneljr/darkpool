angular.module('payment', [])

.service('PaymentService',['$http',function($http) {
    this.getToken = function(card) {
    	$http({
    		url: "https://core.spreedly.com/v1/payment_methods.js?environment_key=UFfG4cb3JqejWHVsm5fL3ZCqjIk",
    		method: "GET",
    		params: card,
    		paramSerializer: '$httpParamSerializerJQLike',
    		headers: {
    			'Content-Type': 'jsonp'
    		}
    	}).then(function successCallback(response) {
    		console.log('hmmm');
    		console.log(response);
    	}, function errorCallback(response) {
    		console.log('ouch');
    		console.log(response);
    	});
    }
}]);