angular.module('Fireshopping')
.directive('products',
    ['$firebaseArray', function($firebaseArray) {

    'use strict';
    var link = function($scope) {
        var fireBaseConnection = new Firebase('https://sizzling-torch-925.firebaseio.com/shopping/products');

        $scope.products = $firebaseArray(fireBaseConnection);


        $scope.filterProducts = function(inputVal){
            console.log( inputVal );
            if (inputVal) {
                $scope.filteredProducts = $scope.products.filter(function(val){
                    console.log( val );
                    return val && val.name &&
                        val.name.indexOf(inputVal) > -1;
                });
            } else {
                $scope.filteredProducts = $scope.products;
            }
        };

        $scope.addList = function(){
            console.log( !$scope.filteredProducts.length );
            if (!$scope.filteredProducts.length) {
                $scope.products.$add({
                    name: $scope.newProduct
                });
            }
        };

        $scope.filterProducts();

    };

    return {
        link: link,
        templateUrl: 'products/products.html'
    };
}]);