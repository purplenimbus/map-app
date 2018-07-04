'use strict';

/**
 * @ngdoc service
 * @name mapApp.mapService
 * @description
 * # mapService
 * Service in the mapApp.
 */
angular.module('mapApp')
	.service('mapService', function($window,locationService,$q,$exceptionHandler){
	  var self = this;
	  self.selected = false;
	  self.markers = [];
	  self.mapCenter = false;
	  self.map = false;
	  //this.center = locationService.getLocation();
	  this.init = function(){
		
		locationService.getLocation().then(function(result){
		  self.mapCenter = result[0].geometry.location;
		  self.map = new $window.google.maps.Map(document.getElementById('map'), {
			center: self.mapCenter,
			zoom: 15,
		  }); 
		  self.service = new $window.google.maps.places.PlacesService(self.map);
		});

	  };
	  
	  this.search = function(req){
		var deferred = $q.defer();
		var request = {
		  query: req,
		  location: self.mapCenter,
		  radius: '50',
		  fields: [ 
					'photos', 
					'formatted_address', 
					'address_component',
					'name', 
					'rating', 
					'opening_hours', 
					'geometry',
				  ]
		};

		self.service.textSearch(request, function(results, status){
		  //console.log('query result',request,results,status);
		  if (status === $window.google.maps.places.PlacesServiceStatus.OK) {
			//this.data = results;
			deferred.resolve(results);
		  }else{
			deferred.reject({message:status});
		  }
		});

		return deferred.promise;
	  };

	  this.setMarkers = function(data,map,$scope){
	  
		try{
		  //clear markers
		  self.clearMarkers(null);
	  
		  angular.forEach(data,function(v){
			  self.markers.push(self.setMarker(v,map,$scope));
		  });
	  
		  return self.markers;
		}catch(except){
		   $exceptionHandler(except.message);
		}
	  };
	  
	  this.setMarker = function(data,map,$scope){
		var latLng = {
		  lat:data.geometry.location.lat(),
		  lng:data.geometry.location.lng()
		};
		
		if(self.markers.length){
		  self.clearMarkers(null);
		}
		  
		var marker = new $window.google.maps.Marker({
		  position: latLng,
		  title: data.name
		});
		
		var contentString = '<div class="uk-card uk-card-default uk-card-body uk-padding-remove">'+
			'<h3 class="uk-card-title">'+data.name+'</h3>'+
			'<div id="bodyContent">'+
			'<p>'+data.formatted_address+'</p>'+ // jscs:ignore requireCamelCaseOrUpperCaseIdentifiers
			'</div>'+
			'</div>';
		
		var infoWindow = new $window.google.maps.InfoWindow({
		  content: contentString
		});
		
		marker.setMap(map);
		marker.addListener('click', function() {
		  if($scope){
			$scope.selected = data;
			$scope.$apply();
		  }
		  infoWindow.open(map, marker);
		});
		
		map.setCenter(new $window.google.maps.LatLng(latLng));
		
		self.markers.push(marker);
		
		//console.log('setMarker markers',self.markers);
		
		return marker;
	  };
	    
	  this.clearMarkers = function(map){
		//console.log('markers about to be cleared',self.markers);
		try{
		  angular.forEach(self.markers,function(value){
			//console.log('clearMarker value',value);
			value.setMap(map);
		  });
		  self.markers = [];
		}catch(except){
		   $exceptionHandler(except.message);
		}
		
		//console.log('markers cleared',self.markers);
	  };
	  
	  this.placeDetails = function(data){
		//console.log('placeId',data.place_id);
		try{
		  var request = {
			placeId: data.place_id,// jscs:ignore requireCamelCaseOrUpperCaseIdentifiers
			fields: ['formatted_phone_number','website','address_component']// jscs:ignore requireCamelCaseOrUpperCaseIdentifiers
		  },
		  deferred = $q.defer();
		  self.service.getDetails(request, function(place, status) {
			if (status === $window.google.maps.places.PlacesServiceStatus.OK) {
			  deferred.resolve(place);
			}else{
			  deferred.reject({message:status});
			}
		  });
		  
		  return deferred.promise;
		  
		}catch(except){
		   $exceptionHandler(except.message);
		}
	  };
	});
