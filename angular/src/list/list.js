angular.module('Fireshopping')
.directive('list',
    ['listService', function(listService) {

    'use strict';
    var link = function($scope) {

        listService.register(function(newList){
            $scope.list = newList;
        });

        $scope.showListDetails = false;

        $scope.addToBasket = function(item, index) {
            listService.addToBasket(item, index);
        };
        $scope.removeFromBasket = function(item, index) {
            listService.removeFromBasket(item, index);

        };
        $scope.removeFromList = function(item, index) {
            listService.removeFromBasket(item, index);
        };
        $scope.clearItems = function() {
            listService.clearItems();

        };
        $scope.delete = function() {

        };
        $scope.toggleProducts = function() {
            $scope.showProducts = !$scope.showProducts;
        };
    };

    return {
        link: link,
        scope: true,
        templateUrl: 'list/list.html'
    };
}]);