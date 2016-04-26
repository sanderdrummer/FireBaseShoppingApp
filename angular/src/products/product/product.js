angular.module('Fireshopping')
.directive('product',
    ['$firebaseArray', function($firebaseArray) {

    'use strict';
    var link = function($scope) {
        var fireBaseConnection = new Firebase('https://sizzling-torch-925.firebaseio.com/shopping/listNames');

        $scope.products = $firebaseArray(fireBaseConnection);
        $scope.filteredProducts = $scope.lis
        $scope.filterProducts = function(){
            $scope.list.filter(function(val){

            });
        }

        $scope.addList = function(){
            $scope.lists.$add({
                name: $scope.newName
            });
        };

    };

    return {
        link: link,
        // templateUrl: 'lists/lists.html'
    };
}]);