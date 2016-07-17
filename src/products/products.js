angular.module('Fireshopping')
.directive('products',
    [function() {
    'use strict';
    return {
        controller: 'productsController',
        controllerAs: 'productsController',
        bindToController: true,
        templateUrl: 'products/products.html'
    };
}]);