'use strict';

/**
 * @ngdoc directive
 * @name mapApp.directive:map
 * @description
 * # map
 */
angular.module('mapApp')
  .directive('map', function(){
  return {
    restrict : 'E',
    templateUrl : 'views/templates/map.html',
    controller : function($scope,mapService){
      $scope.init = function(){
        mapService.init();
        $scope.q = '';
        $scope.loading = false;
        $scope.selected = false;
        //console.log('map $scope',$scope,map);
      };

      $scope.init();
      
      $scope.select = function(data){
        $scope.selected = data;
        $scope.selected.imageUrl = data.photos ? data.photos[0].getUrl({'maxWidth': 400}) : 'https://wallpapersite.com/images/pages/pic_w/13791.jpg';
        $scope.loading = true;
        mapService.placeDetails(data).then(function(res){
          $scope.selected.details = res;
          //console.log('selected',$scope.selected);
          $scope.loading = false;
           //show on map
          mapService.setMarker(data,mapService.map);
        }).catch(function(error){
          $scope.loading = false;
          $scope.error = error;
          //console.log('map error',$scope);
        });

      };
      
      $scope.back = function(){
        $scope.selected = false;
        mapService.clearMarkers(null);
      };
    }
  };
});
