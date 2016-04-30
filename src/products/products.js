angular.module('Fireshopping')
.directive('products',
    ['$firebaseArray', 'listService', 'domService',
    function($firebaseArray, listService, domService) {

    'use strict';
    var link = function($scope, elem) {
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

        $scope.selectProduct = function(product) {
            $scope.addProductToList(product, 1);
        };

        $scope.addProduct = function() {
            if (!$scope.filteredProducts.length) {
                $scope.products.$add({
                    name: $scope.newProductName
                }).then(function(ref){
                    var index = $scope.products.$indexFor(ref.key());
                    $scope.selectedProduct = $scope.products[index];
                    afterProductSelection();

                });
            } else {
                $scope.selectedProduct = $scope.filteredProducts[0];
                 afterProductSelection();
            }

        };

        function afterProductSelection() {
            $scope.showAmount = true;
            $scope.newProductName = null;
            domService.focus('productAmount');
            $scope.filteredProducts = $scope.products;
        }


        $scope.addProductToList = function(product, amount) {
            listService.addProductToList(product, amount);
            $scope.showAmount = false;
            $scope.selectedProduct = null;
            $scope.newProductName = null;
            $scope.filteredProducts = $scope.products;
            domService.focus('productName');

        };


        $scope.hideProducts = function(){
            $scope.$parent.showProducts = false;
        };

        $scope.filterProducts();

    };

    return {
        link: link,
        templateUrl: 'products/products.html'
    };
}]);