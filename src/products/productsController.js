angular.module('Fireshopping')
.controller('productsController', ['$firebaseArray', '$state','$stateParams', 'listService', 'domService',
    function($firebaseArray, $state, $stateParams, listService, domService) {
    var fireBaseConnection = new Firebase('https://sizzling-torch-925.firebaseio.com/shopping/products');
    var ctrl = this;

    ctrl.selectedProduct = {};
    ctrl.products = $firebaseArray(fireBaseConnection);
    ctrl.showAmount = false;
    ctrl.filterProducts = function(inputVal){
        if (inputVal) {
            ctrl.filteredProducts = ctrl.products.filter(function(val){
                return val && val.name &&
                    val.name.indexOf(inputVal) > -1;
            });
        } else {
            ctrl.filteredProducts = ctrl.products;
        }
    };

    ctrl.selectProduct = function(product) {
        ctrl.addProductToList(product, 1);
    };

    ctrl.addProduct = function() {
        if (!ctrl.filteredProducts.length) {
            ctrl.products.$add({
                name: ctrl.newProductName
            }).then(function(ref){
                var index = ctrl.products.$indexFor(ref.key());
                ctrl.selectedProduct = ctrl.products[index];
                afterProductSelection();
            });
        } else {
            ctrl.selectedProduct = ctrl.filteredProducts[0];
            afterProductSelection();
        }

    };

    function afterProductSelection() {
        ctrl.showAmount = true;
        ctrl.newProductName = null;
        domService.focus('productAmount');
        ctrl.filteredProducts = ctrl.products;
    }


    ctrl.addProductToList = function(product, amount) {
        listService.addProductToList(product, amount);
        ctrl.showAmount = false;
        ctrl.selectedProduct = null;
        ctrl.newProductName = null;
        ctrl.filteredProducts = ctrl.products;
        domService.focus('productName');

    };

    ctrl.filterProducts();

    ctrl.back = function(){
        $state.go('list', {
            list: $stateParams.list
        });
    }
}]);