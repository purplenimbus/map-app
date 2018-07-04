'use strict';

/**
 * @ngdoc service
 * @name mapApp.locationService
 * @description
 * # locationService
 * Service in the mapApp.
 */
angular.module('mapApp')
	.service('locationService', function($window,$q){
		this.getLocation	=	function(){
		  var self = this,
			  deferred = $q.defer();
		  
		  $window.navigator.geolocation.getCurrentPosition(function(pos){
			self.geoCoder({lat:pos.coords.latitude,lng:pos.coords.longitude}).then(function(result){
			  deferred.resolve(result);
			});
		  });
		  
		  return deferred.promise;
		};

		this.geoCoder = function(latLng){
		  var geo = new $window.google.maps.Geocoder(),
			  deferred = $q.defer();

		  geo.geocode({'location': latLng}, function(result) {
			if(result.length >= 1){
			  deferred.resolve(result);
			}else{
			  deferred.reject({message:'couldnt get location'});
			}
		  });
		  
		  return deferred.promise;
		};
	});