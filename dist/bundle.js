angular.module('Fireshopping', [
    'CompiledTemplates',
    'firebase'])
.config([
    '$compileProvider',
    '$httpProvider',
    function($compileProvider, $httpProvider) {
        $compileProvider.debugInfoEnabled(false);
        $httpProvider.useApplyAsync(true);
    }
]);
angular.module('Fireshopping')
.factory('domService', ['$timeout', '$window', function($timeout, $window){
    'use strict';

    var domService = {};


    domService.focus = function(id){
        $timeout(function() {
            var element = $window.document.getElementById(id);

            if (element) {
              element.focus();
            }
        });
    };

    return domService;
}]);


angular.module('Fireshopping')
.factory('listService', ['$firebaseObject', '$firebaseArray', function($firebaseObject, $firebaseArray){
    'use strict';

    var listService = {};
    var listWatcher = [];
    var index;
    listService.list = {};

    listService.setList = function(params){
        index = params.index;

        if (params.list) {
            var fireBaseConnection = new Firebase('https://sizzling-torch-925.firebaseio.com/shopping/list/' + params.list);
            listService.list = $firebaseObject(fireBaseConnection);
            update();
        }
    };

    listService.clear = function() {
        this.list = {};
        update();
    };

    listService.register = function(cb) {
        listWatcher.push(cb);
    };

    listService.addProductToList = function(product, amount) {
        listService.list.toAdd = listService.list.toAdd || [];

        listService.list.toAdd.push({
            product: product,
            amount: amount
        });

        listService.list.$save();
    };

    listService.addToBasket = function(item, index) {
        listService.list.alreadyAdded = listService.list.alreadyAdded || [];

        listService.list.toAdd.splice(index, 1);

        listService.list.alreadyAdded.push(item);
        listService.list.$save();

    };
    listService.removeFromBasket = function(item, index) {
        listService.list.toAdd = listService.list.toAdd || [];

        listService.list.alreadyAdded.splice(index, 1);

        listService.list.toAdd.push(item);
        listService.list.$save();
    };

    listService.clearItems = function() {
        listService.list.toAdd = [];
        listService.list.alreadyAdded = [];
        listService.list.$save();
    };
    listService.destroyList = function() {
        listService.list.$remove().then(function(ref) {
            window.location.hash = '#/';
        });
    };

    function update(){
        listWatcher.forEach(function(cb){
            cb(listService.list);
        });
    }

    return listService;
}]);


angular.module('Fireshopping')
.directive('router',
    ['listService', function(listService) {

    'use strict';
    var link = function($scope) {
        var router = new Router();

        router.register('/', function(params){
            listService.clear();
            $scope.hasList = false;
            $scope.$applyAsync();
        });
        router.register('/list/:list/:index', function(params){
            listService.setList(params);
            $scope.hasList = true;
        });

        router.handleHashChange();
    };

    return {
        link: link,
        scope: true,
    };
}]);
(function(module) {
try {
  module = angular.module('CompiledTemplates');
} catch (e) {
  module = angular.module('CompiledTemplates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('list/list.html',
    '<h1>{{list.$id}}</h1><button ng-click="toggleProducts()">Produkte zur Liste</button><h2 class="b-b">noch in den korb</h2><ul><li ng-repeat="item in list.toAdd"><div class="p-s pointer" ng-click="addToBasket(item, $index)">{{item.product.name}} {{item.amount}}</div></li></ul><h2 class="b-b">schon dabei</h2><ul><li ng-repeat="item in list.alreadyAdded"><div class="p-s pointer" ng-click="removeFromBasket(item, $index)">{{item.product.name}} {{item.amount}}</div></li></ul><div class="flex m-b-1"><a href="" class="p b grow" ng-click="clearItems()">Liste Leeren</a></div><div class="flex m-b-1"><a href="" class="p b grow" ng-click="destroyList()">Liste löschen</a></div><div class="products p" ng-if="showProducts"><div class="flex m-b-1"><a href="" class="p b grow" ng-click="toggleProducts()">Fertig</a></div><products></products></div>');
}]);
})();

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
        $scope.destroyList = function() {
            listService.destroyList();
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
(function(module) {
try {
  module = angular.module('CompiledTemplates');
} catch (e) {
  module = angular.module('CompiledTemplates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('lists/lists.html',
    '<form class="flex" name="addList" ng-submit="addList()"><input required="" class="grow" ng-model="newName" placeholder="liste hinzufügen" type="text"> <button type="submit">HINZUFÜGEN</button></form><ul><li class="flex" ng-repeat="list in lists"><a class="b-b p grow" ng-href="#/list/{{::list.name}}/{{::list.$id}}">{{::list.name}}</a> <a class="b-b p" ng-click="lists.$remove(list)" href="">löschen</a></li></ul>');
}]);
})();

angular.module('Fireshopping')
.directive('lists',
    ['$firebaseArray', 'listService', function($firebaseArray, listService) {

    'use strict';
    var link = function($scope) {
        var fireBaseConnection = new Firebase('https://sizzling-torch-925.firebaseio.com/shopping/listNames');

        $scope.lists = $firebaseArray(fireBaseConnection);

        $scope.addList = function(){
            $scope.lists.$add({
                name: $scope.newName,
                toAdd: [],
                alreadyAdded: []
            });
            $scope.newName = '';
        };

        function newListResolved(ref) {
            $scope.showAddList = false;
        }
    };

    return {
        link: link,
        templateUrl: 'lists/lists.html'
    };
}]);
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
(function(module) {
try {
  module = angular.module('CompiledTemplates');
} catch (e) {
  module = angular.module('CompiledTemplates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('products/products.html',
    '<form class="flex" ng-if="showAmount" name="addProductToListForm" ng-submit="addProductToList(selectedProduct, selectedProductAmount)"><div class="m-t-2" ng-if="selectedProductAmount">{{selectedProduct.name}} - {{selectedProductAmount}} mal zur Liste</div><input class="grow" required="" id="productAmount" type="text" ng-model="selectedProductAmount" placeholder="Anzahl hinzufügen"><button type="submit">HINZUFÜGEN</button></form><form class="flex" name="addProduct" ng-submit="addProduct()"><input required="" id="productName" class="grow" ng-model="newProductName" ng-change="filterProducts(newProductName)" placeholder="Produkt hinzufügen" type="text"> <button type="submit">HINZUFÜGEN</button></form><ul><li class="pointer p-s b-b" ng-click="selectProduct(product)" ng-repeat="product in filteredProducts | limitTo:15 track by product.$id">{{product.name}}</li></ul>');
}]);
})();

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImRvbVNlcnZpY2UuanMiLCJsaXN0U2VydmljZS5qcyIsInJvdXRlci5qcyIsImxpc3QvbGlzdC5qcyIsImxpc3RzL2xpc3RzLmpzIiwicHJvZHVjdHMvcHJvZHVjdHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQVhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBN0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJidW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJhbmd1bGFyLm1vZHVsZSgnRmlyZXNob3BwaW5nJywgW1xyXG4gICAgJ0NvbXBpbGVkVGVtcGxhdGVzJyxcclxuICAgICdmaXJlYmFzZSddKVxyXG4uY29uZmlnKFtcclxuICAgICckY29tcGlsZVByb3ZpZGVyJyxcclxuICAgICckaHR0cFByb3ZpZGVyJyxcclxuICAgIGZ1bmN0aW9uKCRjb21waWxlUHJvdmlkZXIsICRodHRwUHJvdmlkZXIpIHtcclxuICAgICAgICAkY29tcGlsZVByb3ZpZGVyLmRlYnVnSW5mb0VuYWJsZWQoZmFsc2UpO1xyXG4gICAgICAgICRodHRwUHJvdmlkZXIudXNlQXBwbHlBc3luYyh0cnVlKTtcclxuICAgIH1cclxuXSk7IiwiYW5ndWxhci5tb2R1bGUoJ0ZpcmVzaG9wcGluZycpXHJcbi5mYWN0b3J5KCdkb21TZXJ2aWNlJywgWyckdGltZW91dCcsICckd2luZG93JywgZnVuY3Rpb24oJHRpbWVvdXQsICR3aW5kb3cpe1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIHZhciBkb21TZXJ2aWNlID0ge307XHJcblxyXG5cclxuICAgIGRvbVNlcnZpY2UuZm9jdXMgPSBmdW5jdGlvbihpZCl7XHJcbiAgICAgICAgJHRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHZhciBlbGVtZW50ID0gJHdpbmRvdy5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk7XHJcblxyXG4gICAgICAgICAgICBpZiAoZWxlbWVudCkge1xyXG4gICAgICAgICAgICAgIGVsZW1lbnQuZm9jdXMoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICByZXR1cm4gZG9tU2VydmljZTtcclxufV0pO1xyXG5cclxuIiwiYW5ndWxhci5tb2R1bGUoJ0ZpcmVzaG9wcGluZycpXHJcbi5mYWN0b3J5KCdsaXN0U2VydmljZScsIFsnJGZpcmViYXNlT2JqZWN0JywgJyRmaXJlYmFzZUFycmF5JywgZnVuY3Rpb24oJGZpcmViYXNlT2JqZWN0LCAkZmlyZWJhc2VBcnJheSl7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgdmFyIGxpc3RTZXJ2aWNlID0ge307XHJcbiAgICB2YXIgbGlzdFdhdGNoZXIgPSBbXTtcclxuICAgIHZhciBpbmRleDtcclxuICAgIGxpc3RTZXJ2aWNlLmxpc3QgPSB7fTtcclxuXHJcbiAgICBsaXN0U2VydmljZS5zZXRMaXN0ID0gZnVuY3Rpb24ocGFyYW1zKXtcclxuICAgICAgICBpbmRleCA9IHBhcmFtcy5pbmRleDtcclxuXHJcbiAgICAgICAgaWYgKHBhcmFtcy5saXN0KSB7XHJcbiAgICAgICAgICAgIHZhciBmaXJlQmFzZUNvbm5lY3Rpb24gPSBuZXcgRmlyZWJhc2UoJ2h0dHBzOi8vc2l6emxpbmctdG9yY2gtOTI1LmZpcmViYXNlaW8uY29tL3Nob3BwaW5nL2xpc3QvJyArIHBhcmFtcy5saXN0KTtcclxuICAgICAgICAgICAgbGlzdFNlcnZpY2UubGlzdCA9ICRmaXJlYmFzZU9iamVjdChmaXJlQmFzZUNvbm5lY3Rpb24pO1xyXG4gICAgICAgICAgICB1cGRhdGUoKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIGxpc3RTZXJ2aWNlLmNsZWFyID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdGhpcy5saXN0ID0ge307XHJcbiAgICAgICAgdXBkYXRlKCk7XHJcbiAgICB9O1xyXG5cclxuICAgIGxpc3RTZXJ2aWNlLnJlZ2lzdGVyID0gZnVuY3Rpb24oY2IpIHtcclxuICAgICAgICBsaXN0V2F0Y2hlci5wdXNoKGNiKTtcclxuICAgIH07XHJcblxyXG4gICAgbGlzdFNlcnZpY2UuYWRkUHJvZHVjdFRvTGlzdCA9IGZ1bmN0aW9uKHByb2R1Y3QsIGFtb3VudCkge1xyXG4gICAgICAgIGxpc3RTZXJ2aWNlLmxpc3QudG9BZGQgPSBsaXN0U2VydmljZS5saXN0LnRvQWRkIHx8IFtdO1xyXG5cclxuICAgICAgICBsaXN0U2VydmljZS5saXN0LnRvQWRkLnB1c2goe1xyXG4gICAgICAgICAgICBwcm9kdWN0OiBwcm9kdWN0LFxyXG4gICAgICAgICAgICBhbW91bnQ6IGFtb3VudFxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBsaXN0U2VydmljZS5saXN0LiRzYXZlKCk7XHJcbiAgICB9O1xyXG5cclxuICAgIGxpc3RTZXJ2aWNlLmFkZFRvQmFza2V0ID0gZnVuY3Rpb24oaXRlbSwgaW5kZXgpIHtcclxuICAgICAgICBsaXN0U2VydmljZS5saXN0LmFscmVhZHlBZGRlZCA9IGxpc3RTZXJ2aWNlLmxpc3QuYWxyZWFkeUFkZGVkIHx8IFtdO1xyXG5cclxuICAgICAgICBsaXN0U2VydmljZS5saXN0LnRvQWRkLnNwbGljZShpbmRleCwgMSk7XHJcblxyXG4gICAgICAgIGxpc3RTZXJ2aWNlLmxpc3QuYWxyZWFkeUFkZGVkLnB1c2goaXRlbSk7XHJcbiAgICAgICAgbGlzdFNlcnZpY2UubGlzdC4kc2F2ZSgpO1xyXG5cclxuICAgIH07XHJcbiAgICBsaXN0U2VydmljZS5yZW1vdmVGcm9tQmFza2V0ID0gZnVuY3Rpb24oaXRlbSwgaW5kZXgpIHtcclxuICAgICAgICBsaXN0U2VydmljZS5saXN0LnRvQWRkID0gbGlzdFNlcnZpY2UubGlzdC50b0FkZCB8fCBbXTtcclxuXHJcbiAgICAgICAgbGlzdFNlcnZpY2UubGlzdC5hbHJlYWR5QWRkZWQuc3BsaWNlKGluZGV4LCAxKTtcclxuXHJcbiAgICAgICAgbGlzdFNlcnZpY2UubGlzdC50b0FkZC5wdXNoKGl0ZW0pO1xyXG4gICAgICAgIGxpc3RTZXJ2aWNlLmxpc3QuJHNhdmUoKTtcclxuICAgIH07XHJcblxyXG4gICAgbGlzdFNlcnZpY2UuY2xlYXJJdGVtcyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGxpc3RTZXJ2aWNlLmxpc3QudG9BZGQgPSBbXTtcclxuICAgICAgICBsaXN0U2VydmljZS5saXN0LmFscmVhZHlBZGRlZCA9IFtdO1xyXG4gICAgICAgIGxpc3RTZXJ2aWNlLmxpc3QuJHNhdmUoKTtcclxuICAgIH07XHJcbiAgICBsaXN0U2VydmljZS5kZXN0cm95TGlzdCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGxpc3RTZXJ2aWNlLmxpc3QuJHJlbW92ZSgpLnRoZW4oZnVuY3Rpb24ocmVmKSB7XHJcbiAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5oYXNoID0gJyMvJztcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcblxyXG4gICAgZnVuY3Rpb24gdXBkYXRlKCl7XHJcbiAgICAgICAgbGlzdFdhdGNoZXIuZm9yRWFjaChmdW5jdGlvbihjYil7XHJcbiAgICAgICAgICAgIGNiKGxpc3RTZXJ2aWNlLmxpc3QpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBsaXN0U2VydmljZTtcclxufV0pO1xyXG5cclxuIiwiYW5ndWxhci5tb2R1bGUoJ0ZpcmVzaG9wcGluZycpXHJcbi5kaXJlY3RpdmUoJ3JvdXRlcicsXHJcbiAgICBbJ2xpc3RTZXJ2aWNlJywgZnVuY3Rpb24obGlzdFNlcnZpY2UpIHtcclxuXHJcbiAgICAndXNlIHN0cmljdCc7XHJcbiAgICB2YXIgbGluayA9IGZ1bmN0aW9uKCRzY29wZSkge1xyXG4gICAgICAgIHZhciByb3V0ZXIgPSBuZXcgUm91dGVyKCk7XHJcblxyXG4gICAgICAgIHJvdXRlci5yZWdpc3RlcignLycsIGZ1bmN0aW9uKHBhcmFtcyl7XHJcbiAgICAgICAgICAgIGxpc3RTZXJ2aWNlLmNsZWFyKCk7XHJcbiAgICAgICAgICAgICRzY29wZS5oYXNMaXN0ID0gZmFsc2U7XHJcbiAgICAgICAgICAgICRzY29wZS4kYXBwbHlBc3luYygpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJvdXRlci5yZWdpc3RlcignL2xpc3QvOmxpc3QvOmluZGV4JywgZnVuY3Rpb24ocGFyYW1zKXtcclxuICAgICAgICAgICAgbGlzdFNlcnZpY2Uuc2V0TGlzdChwYXJhbXMpO1xyXG4gICAgICAgICAgICAkc2NvcGUuaGFzTGlzdCA9IHRydWU7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJvdXRlci5oYW5kbGVIYXNoQ2hhbmdlKCk7XHJcbiAgICB9O1xyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgbGluazogbGluayxcclxuICAgICAgICBzY29wZTogdHJ1ZSxcclxuICAgIH07XHJcbn1dKTsiLCJhbmd1bGFyLm1vZHVsZSgnRmlyZXNob3BwaW5nJylcclxuLmRpcmVjdGl2ZSgnbGlzdCcsXHJcbiAgICBbJ2xpc3RTZXJ2aWNlJywgZnVuY3Rpb24obGlzdFNlcnZpY2UpIHtcclxuXHJcbiAgICAndXNlIHN0cmljdCc7XHJcbiAgICB2YXIgbGluayA9IGZ1bmN0aW9uKCRzY29wZSkge1xyXG5cclxuICAgICAgICBsaXN0U2VydmljZS5yZWdpc3RlcihmdW5jdGlvbihuZXdMaXN0KXtcclxuICAgICAgICAgICAgJHNjb3BlLmxpc3QgPSBuZXdMaXN0O1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAkc2NvcGUuc2hvd0xpc3REZXRhaWxzID0gZmFsc2U7XHJcblxyXG4gICAgICAgICRzY29wZS5hZGRUb0Jhc2tldCA9IGZ1bmN0aW9uKGl0ZW0sIGluZGV4KSB7XHJcbiAgICAgICAgICAgIGxpc3RTZXJ2aWNlLmFkZFRvQmFza2V0KGl0ZW0sIGluZGV4KTtcclxuICAgICAgICB9O1xyXG4gICAgICAgICRzY29wZS5yZW1vdmVGcm9tQmFza2V0ID0gZnVuY3Rpb24oaXRlbSwgaW5kZXgpIHtcclxuICAgICAgICAgICAgbGlzdFNlcnZpY2UucmVtb3ZlRnJvbUJhc2tldChpdGVtLCBpbmRleCk7XHJcblxyXG4gICAgICAgIH07XHJcbiAgICAgICAgJHNjb3BlLnJlbW92ZUZyb21MaXN0ID0gZnVuY3Rpb24oaXRlbSwgaW5kZXgpIHtcclxuICAgICAgICAgICAgbGlzdFNlcnZpY2UucmVtb3ZlRnJvbUJhc2tldChpdGVtLCBpbmRleCk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICAkc2NvcGUuY2xlYXJJdGVtcyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBsaXN0U2VydmljZS5jbGVhckl0ZW1zKCk7XHJcblxyXG4gICAgICAgIH07XHJcbiAgICAgICAgJHNjb3BlLmRlc3Ryb3lMaXN0ID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGxpc3RTZXJ2aWNlLmRlc3Ryb3lMaXN0KCk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICAkc2NvcGUudG9nZ2xlUHJvZHVjdHMgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgJHNjb3BlLnNob3dQcm9kdWN0cyA9ICEkc2NvcGUuc2hvd1Byb2R1Y3RzO1xyXG4gICAgICAgIH07XHJcbiAgICB9O1xyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgbGluazogbGluayxcclxuICAgICAgICBzY29wZTogdHJ1ZSxcclxuICAgICAgICB0ZW1wbGF0ZVVybDogJ2xpc3QvbGlzdC5odG1sJ1xyXG4gICAgfTtcclxufV0pOyIsImFuZ3VsYXIubW9kdWxlKCdGaXJlc2hvcHBpbmcnKVxyXG4uZGlyZWN0aXZlKCdsaXN0cycsXHJcbiAgICBbJyRmaXJlYmFzZUFycmF5JywgJ2xpc3RTZXJ2aWNlJywgZnVuY3Rpb24oJGZpcmViYXNlQXJyYXksIGxpc3RTZXJ2aWNlKSB7XHJcblxyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG4gICAgdmFyIGxpbmsgPSBmdW5jdGlvbigkc2NvcGUpIHtcclxuICAgICAgICB2YXIgZmlyZUJhc2VDb25uZWN0aW9uID0gbmV3IEZpcmViYXNlKCdodHRwczovL3NpenpsaW5nLXRvcmNoLTkyNS5maXJlYmFzZWlvLmNvbS9zaG9wcGluZy9saXN0TmFtZXMnKTtcclxuXHJcbiAgICAgICAgJHNjb3BlLmxpc3RzID0gJGZpcmViYXNlQXJyYXkoZmlyZUJhc2VDb25uZWN0aW9uKTtcclxuXHJcbiAgICAgICAgJHNjb3BlLmFkZExpc3QgPSBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAkc2NvcGUubGlzdHMuJGFkZCh7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiAkc2NvcGUubmV3TmFtZSxcclxuICAgICAgICAgICAgICAgIHRvQWRkOiBbXSxcclxuICAgICAgICAgICAgICAgIGFscmVhZHlBZGRlZDogW11cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICRzY29wZS5uZXdOYW1lID0gJyc7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gbmV3TGlzdFJlc29sdmVkKHJlZikge1xyXG4gICAgICAgICAgICAkc2NvcGUuc2hvd0FkZExpc3QgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgbGluazogbGluayxcclxuICAgICAgICB0ZW1wbGF0ZVVybDogJ2xpc3RzL2xpc3RzLmh0bWwnXHJcbiAgICB9O1xyXG59XSk7IiwiKGZ1bmN0aW9uKG1vZHVsZSkge1xudHJ5IHtcbiAgbW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ0NvbXBpbGVkVGVtcGxhdGVzJyk7XG59IGNhdGNoIChlKSB7XG4gIG1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCdDb21waWxlZFRlbXBsYXRlcycsIFtdKTtcbn1cbm1vZHVsZS5ydW4oWyckdGVtcGxhdGVDYWNoZScsIGZ1bmN0aW9uKCR0ZW1wbGF0ZUNhY2hlKSB7XG4gICR0ZW1wbGF0ZUNhY2hlLnB1dCgncHJvZHVjdHMvcHJvZHVjdHMuaHRtbCcsXG4gICAgJzxmb3JtIGNsYXNzPVwiZmxleFwiIG5nLWlmPVwic2hvd0Ftb3VudFwiIG5hbWU9XCJhZGRQcm9kdWN0VG9MaXN0Rm9ybVwiIG5nLXN1Ym1pdD1cImFkZFByb2R1Y3RUb0xpc3Qoc2VsZWN0ZWRQcm9kdWN0LCBzZWxlY3RlZFByb2R1Y3RBbW91bnQpXCI+PGRpdiBjbGFzcz1cIm0tdC0yXCIgbmctaWY9XCJzZWxlY3RlZFByb2R1Y3RBbW91bnRcIj57e3NlbGVjdGVkUHJvZHVjdC5uYW1lfX0gLSB7e3NlbGVjdGVkUHJvZHVjdEFtb3VudH19IG1hbCB6dXIgTGlzdGU8L2Rpdj48aW5wdXQgY2xhc3M9XCJncm93XCIgcmVxdWlyZWQ9XCJcIiBpZD1cInByb2R1Y3RBbW91bnRcIiB0eXBlPVwidGV4dFwiIG5nLW1vZGVsPVwic2VsZWN0ZWRQcm9kdWN0QW1vdW50XCIgcGxhY2Vob2xkZXI9XCJBbnphaGwgaGluenVmw7xnZW5cIj48YnV0dG9uIHR5cGU9XCJzdWJtaXRcIj5ISU5aVUbDnEdFTjwvYnV0dG9uPjwvZm9ybT48Zm9ybSBjbGFzcz1cImZsZXhcIiBuYW1lPVwiYWRkUHJvZHVjdFwiIG5nLXN1Ym1pdD1cImFkZFByb2R1Y3QoKVwiPjxpbnB1dCByZXF1aXJlZD1cIlwiIGlkPVwicHJvZHVjdE5hbWVcIiBjbGFzcz1cImdyb3dcIiBuZy1tb2RlbD1cIm5ld1Byb2R1Y3ROYW1lXCIgbmctY2hhbmdlPVwiZmlsdGVyUHJvZHVjdHMobmV3UHJvZHVjdE5hbWUpXCIgcGxhY2Vob2xkZXI9XCJQcm9kdWt0IGhpbnp1ZsO8Z2VuXCIgdHlwZT1cInRleHRcIj4gPGJ1dHRvbiB0eXBlPVwic3VibWl0XCI+SElOWlVGw5xHRU48L2J1dHRvbj48L2Zvcm0+PHVsPjxsaSBjbGFzcz1cInBvaW50ZXIgcC1zIGItYlwiIG5nLWNsaWNrPVwic2VsZWN0UHJvZHVjdChwcm9kdWN0KVwiIG5nLXJlcGVhdD1cInByb2R1Y3QgaW4gZmlsdGVyZWRQcm9kdWN0cyB8IGxpbWl0VG86MTUgdHJhY2sgYnkgcHJvZHVjdC4kaWRcIj57e3Byb2R1Y3QubmFtZX19PC9saT48L3VsPicpO1xufV0pO1xufSkoKTtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
