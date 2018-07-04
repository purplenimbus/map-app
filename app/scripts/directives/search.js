'use strict';

/**
 * @ngdoc directive
 * @name mapApp.directive:search
 * @description
 * # search
 */
angular.module('mapApp')
	.directive('search',function(){
		return {
			restrict : 'E',
			templateUrl : 'views/templates/search.html',
			controller : function($scope,mapService){
			  $scope.search = function(q){
				//console.log('search $scope',$scope,map);
				$scope.loading = true;
				$scope.results = false;
				$scope.selected = false;
				$scope.error = false;
				mapService.clearMarkers(null);
				mapService.search(q).then(function(res){
				  $scope.loading = false;
				  $scope.results = res;
				  //map.setMarkers(res,map.map,$scope);
				}).catch(function(error){
				  $scope.loading = false;
				  $scope.error = error.message === 'ZERO_RESULTS' ? {message:'No results found for '+q} : error;
				  //console.log('search error',$scope);
				});
			  };
			}
		};
	});
