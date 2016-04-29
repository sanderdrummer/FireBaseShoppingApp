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
(function(module) {
try {
  module = angular.module('CompiledTemplates');
} catch (e) {
  module = angular.module('CompiledTemplates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('list/list.html',
    '<h1>{{list.$id}}</h1><button ng-click="toggleProducts()">Produkte zur Liste</button><h2 class="b-b">noch in den korb</h2><ul><li ng-repeat="item in list.toAdd"><div class="p-s pointer" ng-click="addToBasket(item, $index)">{{item.product.name}} {{item.amount}}</div></li></ul><h2 class="b-b">schon dabei</h2><ul><li ng-repeat="item in list.alreadyAdded"><div class="p-s pointer" ng-click="removeFromBasket(item, $index)">{{item.product.name}} {{item.amount}}</div></li></ul><div class="flex m-b-1"><a href="" class="p b grow" ng-click="clearItems()">Liste Leeren</a></div><div class="flex m-b-1"><a href="" class="p b grow" ng-click="destroyList()">Liste löschen</a></div><div class="products" ng-if="showProducts"><div class="flex m-b-1"><a href="" class="p b grow" ng-click="toggleProducts()">Fertig</a></div><products></products></div>');
}]);
})();

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
            $scope.selectedProduct = product;
            afterProductSelection();
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
  $templateCache.put('lists/lists.html',
    '<form class="flex" name="addList" ng-submit="addList()"><input required="" class="grow" ng-model="newName" placeholder="liste hinzufügen" type="text"> <button type="submit">HINZUFÜGEN</button></form><ul><li class="flex" ng-repeat="list in lists"><a class="b-b p grow" ng-href="#/list/{{::list.name}}/{{::list.$id}}">{{::list.name}}</a> <a class="b-b p" ng-click="lists.$remove(list)" href="">löschen</a></li></ul>');
}]);
})();

(function(module) {
try {
  module = angular.module('CompiledTemplates');
} catch (e) {
  module = angular.module('CompiledTemplates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('products/products.html',
    '<form class="flex" ng-if="showAmount" name="addProductToListForm" ng-submit="addProductToList(selectedProduct, selectedProductAmount)"><div class="m-t-2" ng-if="selectedProductAmount">{{selectedProduct.name}} - {{selectedProductAmount}} mal zur Liste</div><input class="grow" required="" id="productAmount" type="text" ng-model="selectedProductAmount" placeholder="Anzahl hinzufügen"><button type="submit">HINZUFÜGEN</button></form><form class="flex" name="addProduct" ng-submit="addProduct()"><input required="" id="productName" class="grow" ng-model="newProductName" ng-change="filterProducts(newProductName)" placeholder="Produkt hinzufügen" type="text"> <button type="submit">HINZUFÜGEN</button></form><ul><li class="pointer p-s b-b" ng-click="selectProduct(product)" ng-repeat="product in filteredProducts track by product.$id">{{product.name}}</li></ul>');
}]);
})();

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImRvbVNlcnZpY2UuanMiLCJsaXN0U2VydmljZS5qcyIsInJvdXRlci5qcyIsImxpc3QvbGlzdC5qcyIsImxpc3RzL2xpc3RzLmpzIiwicHJvZHVjdHMvcHJvZHVjdHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUQ1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FFWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUQ5RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImFuZ3VsYXIubW9kdWxlKCdGaXJlc2hvcHBpbmcnLCBbXG4gICAgJ0NvbXBpbGVkVGVtcGxhdGVzJyxcbiAgICAnZmlyZWJhc2UnXSlcbi5jb25maWcoW1xuICAgICckY29tcGlsZVByb3ZpZGVyJyxcbiAgICAnJGh0dHBQcm92aWRlcicsXG4gICAgZnVuY3Rpb24oJGNvbXBpbGVQcm92aWRlciwgJGh0dHBQcm92aWRlcikge1xuICAgICAgICAkY29tcGlsZVByb3ZpZGVyLmRlYnVnSW5mb0VuYWJsZWQoZmFsc2UpO1xuICAgICAgICAkaHR0cFByb3ZpZGVyLnVzZUFwcGx5QXN5bmModHJ1ZSk7XG4gICAgfVxuXSk7IiwiYW5ndWxhci5tb2R1bGUoJ0ZpcmVzaG9wcGluZycpXG4uZmFjdG9yeSgnZG9tU2VydmljZScsIFsnJHRpbWVvdXQnLCAnJHdpbmRvdycsIGZ1bmN0aW9uKCR0aW1lb3V0LCAkd2luZG93KXtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICB2YXIgZG9tU2VydmljZSA9IHt9O1xuXG5cbiAgICBkb21TZXJ2aWNlLmZvY3VzID0gZnVuY3Rpb24oaWQpe1xuICAgICAgICAkdGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBlbGVtZW50ID0gJHdpbmRvdy5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk7XG5cbiAgICAgICAgICAgIGlmIChlbGVtZW50KSB7XG4gICAgICAgICAgICAgIGVsZW1lbnQuZm9jdXMoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIHJldHVybiBkb21TZXJ2aWNlO1xufV0pO1xuXG4iLCJhbmd1bGFyLm1vZHVsZSgnRmlyZXNob3BwaW5nJylcbi5mYWN0b3J5KCdsaXN0U2VydmljZScsIFsnJGZpcmViYXNlT2JqZWN0JywgJyRmaXJlYmFzZUFycmF5JywgZnVuY3Rpb24oJGZpcmViYXNlT2JqZWN0LCAkZmlyZWJhc2VBcnJheSl7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgdmFyIGxpc3RTZXJ2aWNlID0ge307XG4gICAgdmFyIGxpc3RXYXRjaGVyID0gW107XG4gICAgdmFyIGluZGV4O1xuICAgIGxpc3RTZXJ2aWNlLmxpc3QgPSB7fTtcblxuICAgIGxpc3RTZXJ2aWNlLnNldExpc3QgPSBmdW5jdGlvbihwYXJhbXMpe1xuICAgICAgICBpbmRleCA9IHBhcmFtcy5pbmRleDtcblxuICAgICAgICBpZiAocGFyYW1zLmxpc3QpIHtcbiAgICAgICAgICAgIHZhciBmaXJlQmFzZUNvbm5lY3Rpb24gPSBuZXcgRmlyZWJhc2UoJ2h0dHBzOi8vc2l6emxpbmctdG9yY2gtOTI1LmZpcmViYXNlaW8uY29tL3Nob3BwaW5nL2xpc3QvJyArIHBhcmFtcy5saXN0KTtcbiAgICAgICAgICAgIGxpc3RTZXJ2aWNlLmxpc3QgPSAkZmlyZWJhc2VPYmplY3QoZmlyZUJhc2VDb25uZWN0aW9uKTtcbiAgICAgICAgICAgIHVwZGF0ZSgpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIGxpc3RTZXJ2aWNlLmNsZWFyID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMubGlzdCA9IHt9O1xuICAgICAgICB1cGRhdGUoKTtcbiAgICB9O1xuXG4gICAgbGlzdFNlcnZpY2UucmVnaXN0ZXIgPSBmdW5jdGlvbihjYikge1xuICAgICAgICBsaXN0V2F0Y2hlci5wdXNoKGNiKTtcbiAgICB9O1xuXG4gICAgbGlzdFNlcnZpY2UuYWRkUHJvZHVjdFRvTGlzdCA9IGZ1bmN0aW9uKHByb2R1Y3QsIGFtb3VudCkge1xuICAgICAgICBsaXN0U2VydmljZS5saXN0LnRvQWRkID0gbGlzdFNlcnZpY2UubGlzdC50b0FkZCB8fCBbXTtcblxuICAgICAgICBsaXN0U2VydmljZS5saXN0LnRvQWRkLnB1c2goe1xuICAgICAgICAgICAgcHJvZHVjdDogcHJvZHVjdCxcbiAgICAgICAgICAgIGFtb3VudDogYW1vdW50XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGxpc3RTZXJ2aWNlLmxpc3QuJHNhdmUoKTtcbiAgICB9O1xuXG4gICAgbGlzdFNlcnZpY2UuYWRkVG9CYXNrZXQgPSBmdW5jdGlvbihpdGVtLCBpbmRleCkge1xuICAgICAgICBsaXN0U2VydmljZS5saXN0LmFscmVhZHlBZGRlZCA9IGxpc3RTZXJ2aWNlLmxpc3QuYWxyZWFkeUFkZGVkIHx8IFtdO1xuXG4gICAgICAgIGxpc3RTZXJ2aWNlLmxpc3QudG9BZGQuc3BsaWNlKGluZGV4LCAxKTtcblxuICAgICAgICBsaXN0U2VydmljZS5saXN0LmFscmVhZHlBZGRlZC5wdXNoKGl0ZW0pO1xuICAgICAgICBsaXN0U2VydmljZS5saXN0LiRzYXZlKCk7XG5cbiAgICB9O1xuICAgIGxpc3RTZXJ2aWNlLnJlbW92ZUZyb21CYXNrZXQgPSBmdW5jdGlvbihpdGVtLCBpbmRleCkge1xuICAgICAgICBsaXN0U2VydmljZS5saXN0LnRvQWRkID0gbGlzdFNlcnZpY2UubGlzdC50b0FkZCB8fCBbXTtcblxuICAgICAgICBsaXN0U2VydmljZS5saXN0LmFscmVhZHlBZGRlZC5zcGxpY2UoaW5kZXgsIDEpO1xuXG4gICAgICAgIGxpc3RTZXJ2aWNlLmxpc3QudG9BZGQucHVzaChpdGVtKTtcbiAgICAgICAgbGlzdFNlcnZpY2UubGlzdC4kc2F2ZSgpO1xuICAgIH07XG5cbiAgICBsaXN0U2VydmljZS5jbGVhckl0ZW1zID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGxpc3RTZXJ2aWNlLmxpc3QudG9BZGQgPSBbXTtcbiAgICAgICAgbGlzdFNlcnZpY2UubGlzdC5hbHJlYWR5QWRkZWQgPSBbXTtcbiAgICAgICAgbGlzdFNlcnZpY2UubGlzdC4kc2F2ZSgpO1xuICAgIH07XG4gICAgbGlzdFNlcnZpY2UuZGVzdHJveUxpc3QgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgbGlzdFNlcnZpY2UubGlzdC4kcmVtb3ZlKCkudGhlbihmdW5jdGlvbihyZWYpIHtcbiAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5oYXNoID0gJyMvJztcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIHVwZGF0ZSgpe1xuICAgICAgICBsaXN0V2F0Y2hlci5mb3JFYWNoKGZ1bmN0aW9uKGNiKXtcbiAgICAgICAgICAgIGNiKGxpc3RTZXJ2aWNlLmxpc3QpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gbGlzdFNlcnZpY2U7XG59XSk7XG5cbiIsImFuZ3VsYXIubW9kdWxlKCdGaXJlc2hvcHBpbmcnKVxuLmRpcmVjdGl2ZSgncm91dGVyJyxcbiAgICBbJ2xpc3RTZXJ2aWNlJywgZnVuY3Rpb24obGlzdFNlcnZpY2UpIHtcblxuICAgICd1c2Ugc3RyaWN0JztcbiAgICB2YXIgbGluayA9IGZ1bmN0aW9uKCRzY29wZSkge1xuICAgICAgICB2YXIgcm91dGVyID0gbmV3IFJvdXRlcigpO1xuXG4gICAgICAgIHJvdXRlci5yZWdpc3RlcignLycsIGZ1bmN0aW9uKHBhcmFtcyl7XG4gICAgICAgICAgICBsaXN0U2VydmljZS5jbGVhcigpO1xuICAgICAgICAgICAgJHNjb3BlLmhhc0xpc3QgPSBmYWxzZTtcbiAgICAgICAgICAgICRzY29wZS4kYXBwbHlBc3luYygpO1xuICAgICAgICB9KTtcbiAgICAgICAgcm91dGVyLnJlZ2lzdGVyKCcvbGlzdC86bGlzdC86aW5kZXgnLCBmdW5jdGlvbihwYXJhbXMpe1xuICAgICAgICAgICAgbGlzdFNlcnZpY2Uuc2V0TGlzdChwYXJhbXMpO1xuICAgICAgICAgICAgJHNjb3BlLmhhc0xpc3QgPSB0cnVlO1xuICAgICAgICB9KTtcblxuICAgICAgICByb3V0ZXIuaGFuZGxlSGFzaENoYW5nZSgpO1xuICAgIH07XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBsaW5rOiBsaW5rLFxuICAgICAgICBzY29wZTogdHJ1ZSxcbiAgICB9O1xufV0pOyIsIihmdW5jdGlvbihtb2R1bGUpIHtcbnRyeSB7XG4gIG1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCdDb21waWxlZFRlbXBsYXRlcycpO1xufSBjYXRjaCAoZSkge1xuICBtb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnQ29tcGlsZWRUZW1wbGF0ZXMnLCBbXSk7XG59XG5tb2R1bGUucnVuKFsnJHRlbXBsYXRlQ2FjaGUnLCBmdW5jdGlvbigkdGVtcGxhdGVDYWNoZSkge1xuICAkdGVtcGxhdGVDYWNoZS5wdXQoJ2xpc3QvbGlzdC5odG1sJyxcbiAgICAnPGgxPnt7bGlzdC4kaWR9fTwvaDE+PGJ1dHRvbiBuZy1jbGljaz1cInRvZ2dsZVByb2R1Y3RzKClcIj5Qcm9kdWt0ZSB6dXIgTGlzdGU8L2J1dHRvbj48aDIgY2xhc3M9XCJiLWJcIj5ub2NoIGluIGRlbiBrb3JiPC9oMj48dWw+PGxpIG5nLXJlcGVhdD1cIml0ZW0gaW4gbGlzdC50b0FkZFwiPjxkaXYgY2xhc3M9XCJwLXMgcG9pbnRlclwiIG5nLWNsaWNrPVwiYWRkVG9CYXNrZXQoaXRlbSwgJGluZGV4KVwiPnt7aXRlbS5wcm9kdWN0Lm5hbWV9fSB7e2l0ZW0uYW1vdW50fX08L2Rpdj48L2xpPjwvdWw+PGgyIGNsYXNzPVwiYi1iXCI+c2Nob24gZGFiZWk8L2gyPjx1bD48bGkgbmctcmVwZWF0PVwiaXRlbSBpbiBsaXN0LmFscmVhZHlBZGRlZFwiPjxkaXYgY2xhc3M9XCJwLXMgcG9pbnRlclwiIG5nLWNsaWNrPVwicmVtb3ZlRnJvbUJhc2tldChpdGVtLCAkaW5kZXgpXCI+e3tpdGVtLnByb2R1Y3QubmFtZX19IHt7aXRlbS5hbW91bnR9fTwvZGl2PjwvbGk+PC91bD48ZGl2IGNsYXNzPVwiZmxleCBtLWItMVwiPjxhIGhyZWY9XCJcIiBjbGFzcz1cInAgYiBncm93XCIgbmctY2xpY2s9XCJjbGVhckl0ZW1zKClcIj5MaXN0ZSBMZWVyZW48L2E+PC9kaXY+PGRpdiBjbGFzcz1cImZsZXggbS1iLTFcIj48YSBocmVmPVwiXCIgY2xhc3M9XCJwIGIgZ3Jvd1wiIG5nLWNsaWNrPVwiZGVzdHJveUxpc3QoKVwiPkxpc3RlIGzDtnNjaGVuPC9hPjwvZGl2PjxkaXYgY2xhc3M9XCJwcm9kdWN0c1wiIG5nLWlmPVwic2hvd1Byb2R1Y3RzXCI+PGRpdiBjbGFzcz1cImZsZXggbS1iLTFcIj48YSBocmVmPVwiXCIgY2xhc3M9XCJwIGIgZ3Jvd1wiIG5nLWNsaWNrPVwidG9nZ2xlUHJvZHVjdHMoKVwiPkZlcnRpZzwvYT48L2Rpdj48cHJvZHVjdHM+PC9wcm9kdWN0cz48L2Rpdj4nKTtcbn1dKTtcbn0pKCk7XG4iLCIoZnVuY3Rpb24obW9kdWxlKSB7XG50cnkge1xuICBtb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnQ29tcGlsZWRUZW1wbGF0ZXMnKTtcbn0gY2F0Y2ggKGUpIHtcbiAgbW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ0NvbXBpbGVkVGVtcGxhdGVzJywgW10pO1xufVxubW9kdWxlLnJ1bihbJyR0ZW1wbGF0ZUNhY2hlJywgZnVuY3Rpb24oJHRlbXBsYXRlQ2FjaGUpIHtcbiAgJHRlbXBsYXRlQ2FjaGUucHV0KCdsaXN0cy9saXN0cy5odG1sJyxcbiAgICAnPGZvcm0gY2xhc3M9XCJmbGV4XCIgbmFtZT1cImFkZExpc3RcIiBuZy1zdWJtaXQ9XCJhZGRMaXN0KClcIj48aW5wdXQgcmVxdWlyZWQ9XCJcIiBjbGFzcz1cImdyb3dcIiBuZy1tb2RlbD1cIm5ld05hbWVcIiBwbGFjZWhvbGRlcj1cImxpc3RlIGhpbnp1ZsO8Z2VuXCIgdHlwZT1cInRleHRcIj4gPGJ1dHRvbiB0eXBlPVwic3VibWl0XCI+SElOWlVGw5xHRU48L2J1dHRvbj48L2Zvcm0+PHVsPjxsaSBjbGFzcz1cImZsZXhcIiBuZy1yZXBlYXQ9XCJsaXN0IGluIGxpc3RzXCI+PGEgY2xhc3M9XCJiLWIgcCBncm93XCIgbmctaHJlZj1cIiMvbGlzdC97ezo6bGlzdC5uYW1lfX0ve3s6Omxpc3QuJGlkfX1cIj57ezo6bGlzdC5uYW1lfX08L2E+IDxhIGNsYXNzPVwiYi1iIHBcIiBuZy1jbGljaz1cImxpc3RzLiRyZW1vdmUobGlzdClcIiBocmVmPVwiXCI+bMO2c2NoZW48L2E+PC9saT48L3VsPicpO1xufV0pO1xufSkoKTtcbiIsIihmdW5jdGlvbihtb2R1bGUpIHtcbnRyeSB7XG4gIG1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCdDb21waWxlZFRlbXBsYXRlcycpO1xufSBjYXRjaCAoZSkge1xuICBtb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnQ29tcGlsZWRUZW1wbGF0ZXMnLCBbXSk7XG59XG5tb2R1bGUucnVuKFsnJHRlbXBsYXRlQ2FjaGUnLCBmdW5jdGlvbigkdGVtcGxhdGVDYWNoZSkge1xuICAkdGVtcGxhdGVDYWNoZS5wdXQoJ3Byb2R1Y3RzL3Byb2R1Y3RzLmh0bWwnLFxuICAgICc8Zm9ybSBjbGFzcz1cImZsZXhcIiBuZy1pZj1cInNob3dBbW91bnRcIiBuYW1lPVwiYWRkUHJvZHVjdFRvTGlzdEZvcm1cIiBuZy1zdWJtaXQ9XCJhZGRQcm9kdWN0VG9MaXN0KHNlbGVjdGVkUHJvZHVjdCwgc2VsZWN0ZWRQcm9kdWN0QW1vdW50KVwiPjxkaXYgY2xhc3M9XCJtLXQtMlwiIG5nLWlmPVwic2VsZWN0ZWRQcm9kdWN0QW1vdW50XCI+e3tzZWxlY3RlZFByb2R1Y3QubmFtZX19IC0ge3tzZWxlY3RlZFByb2R1Y3RBbW91bnR9fSBtYWwgenVyIExpc3RlPC9kaXY+PGlucHV0IGNsYXNzPVwiZ3Jvd1wiIHJlcXVpcmVkPVwiXCIgaWQ9XCJwcm9kdWN0QW1vdW50XCIgdHlwZT1cInRleHRcIiBuZy1tb2RlbD1cInNlbGVjdGVkUHJvZHVjdEFtb3VudFwiIHBsYWNlaG9sZGVyPVwiQW56YWhsIGhpbnp1ZsO8Z2VuXCI+PGJ1dHRvbiB0eXBlPVwic3VibWl0XCI+SElOWlVGw5xHRU48L2J1dHRvbj48L2Zvcm0+PGZvcm0gY2xhc3M9XCJmbGV4XCIgbmFtZT1cImFkZFByb2R1Y3RcIiBuZy1zdWJtaXQ9XCJhZGRQcm9kdWN0KClcIj48aW5wdXQgcmVxdWlyZWQ9XCJcIiBpZD1cInByb2R1Y3ROYW1lXCIgY2xhc3M9XCJncm93XCIgbmctbW9kZWw9XCJuZXdQcm9kdWN0TmFtZVwiIG5nLWNoYW5nZT1cImZpbHRlclByb2R1Y3RzKG5ld1Byb2R1Y3ROYW1lKVwiIHBsYWNlaG9sZGVyPVwiUHJvZHVrdCBoaW56dWbDvGdlblwiIHR5cGU9XCJ0ZXh0XCI+IDxidXR0b24gdHlwZT1cInN1Ym1pdFwiPkhJTlpVRsOcR0VOPC9idXR0b24+PC9mb3JtPjx1bD48bGkgY2xhc3M9XCJwb2ludGVyIHAtcyBiLWJcIiBuZy1jbGljaz1cInNlbGVjdFByb2R1Y3QocHJvZHVjdClcIiBuZy1yZXBlYXQ9XCJwcm9kdWN0IGluIGZpbHRlcmVkUHJvZHVjdHMgdHJhY2sgYnkgcHJvZHVjdC4kaWRcIj57e3Byb2R1Y3QubmFtZX19PC9saT48L3VsPicpO1xufV0pO1xufSkoKTtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
