angular.module('Fireshopping')
.directive('products',
    ['$firebaseArray', function($firebaseArray) {

    'use strict';
    var link = function($scope) {
        var fireBaseConnection = new Firebase('https://sizzling-torch-925.firebaseio.com/shopping/products');

        $scope.selectedProduct = {};
        $scope.products = $firebaseArray(fireBaseConnection);
        $scope.showAmount = false;

        $scope.filterProducts = function(inputVal){
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

        $scope.addList = function() {
            if (!$scope.filteredProducts.length) {
                $scope.products.$add({
                    name: $scope.newProductName
                }).then(function(ref){
                    var index = $scope.products.$indexFor(ref.key());
                    $scope.selectedProduct = $scope.products[index];                });
            } else {
                $scope.selectedProduct = $scope.filteredProducts[0];
            }
            $scope.showAmount = true;
            $scope.newProductName = null;
        };

        $scope.addProductToList = function() {

        };

        $scope.filterProducts();

    };

    return {
        link: link,
        scope: {
            'listData': '='
        },
        templateUrl: 'products/products.html'
    };
}]);