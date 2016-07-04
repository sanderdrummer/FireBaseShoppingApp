angular.module('Fireshopping')
.directive('list',
    ['$stateParams', '$rootScope', 'listService', function($stateParams, $rootScope, listService) {

    'use strict';
    var link = function($scope) {


        $scope.showListDetails = false;

        $scope.list = listService.getList($stateParams.list);

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
        $scope.destroyList = function() {
            listService.destroyList();
        };
        $scope.toggleProducts = function() {
            window.location.hash = '#/list/' + $stateParams.list + '/products';
        };
        $scope.home = function() {
            window.location.hash = '#/home';
        };
    };

    return {
        link: link,
        scope: true,
        templateUrl: 'list/list.html'
    };
}]);