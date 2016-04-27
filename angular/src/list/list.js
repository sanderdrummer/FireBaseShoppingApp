angular.module('Fireshopping')
.directive('list',
    [function() {

    'use strict';
    var link = function($scope) {

        $scope.showListDetails = false;

        $scope.addToBasket = function() {

        };
        $scope.removeFromBasket = function() {

        };
        $scope.removeFromList = function() {

        };
        $scope.clear = function() {

        };
        $scope.delete = function() {

        };
    };

    return {
        link: link,
        scope: {
            'listData': '='
        },
        templateUrl: 'list/list.html'
    };
}]);