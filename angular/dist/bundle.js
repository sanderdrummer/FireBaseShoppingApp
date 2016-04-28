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
.factory('listService', ['$firebaseObject', function($firebaseObject){
    'use strict';

    var listService = {};
    var listWatcher = [];

    listService.list = {};

    listService.setList = function(params){
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
        router.register('/list/:list', function(params){
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
        $scope.delete = function() {

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
  $templateCache.put('list/list.html',
    '<h1>Liste {{list.$id}}</h1><button ng-click="toggleProducts()">Produkte zur Liste</button><h2 class="b-b">noch in den korb</h2><ul><li ng-repeat="item in list.toAdd"><div class="p-s pointer" ng-click="addToBasket(item, $index)">{{item.product.name}} {{item.amount}}</div></li></ul><h2 class="b-b">schon dabei</h2><ul><li ng-repeat="item in list.alreadyAdded"><div class="p-s pointer" ng-click="removeFromBasket(item, $index)">{{item.product.name}} {{item.amount}}</div></li></ul><a href="" class="m-t-5 grow" ng-click="clearItems()">Liste Leeren</a><div class="products" ng-if="showProducts"><products></products><div class="flex m-t-2"><a href="" class="p b grow" ng-click="toggleProducts()">Fertig</a></div></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('CompiledTemplates');
} catch (e) {
  module = angular.module('CompiledTemplates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('lists/lists.html',
    '<form class="flex" name="addList" ng-submit="addList()"><input required="" class="grow" ng-model="newName" placeholder="liste hinzufügen" type="text"> <button type="submit">HINZUFÜGEN</button></form><ul><li class="flex" ng-repeat="list in lists"><a class="b-b p grow" ng-href="#/list/{{::list.name}}">{{::list.name}}</a></li></ul>');
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
  $templateCache.put('products/products.html',
    '<h1>Listen wuhuhu</h1><form class="flex" ng-if="showAmount" name="addProductToListForm" ng-submit="addProductToList(selectedProduct, selectedProductAmount)"><div class="m-t-2" ng-if="selectedProductAmount">{{selectedProduct.name}} - {{selectedProductAmount}} mal zur Liste</div><input class="grow" required="" id="productAmount" type="number" ng-model="selectedProductAmount" placeholder="Anzahl hinzufügen"><button type="submit">HINZUFÜGEN</button></form><form class="flex" name="addProduct" ng-submit="addProduct()"><input required="" id="productName" class="grow" ng-model="newProductName" ng-change="filterProducts(newProductName)" placeholder="Produkt hinzufügen" type="text"> <button type="submit">HINZUFÜGEN</button></form><ul><li class="pointer p-s b-b" ng-click="selectProduct(product)" ng-repeat="product in filteredProducts track by product.$id">{{product.name}}</li></ul>');
}]);
})();

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImRvbVNlcnZpY2UuanMiLCJsaXN0U2VydmljZS5qcyIsInJvdXRlci5qcyIsImxpc3QvbGlzdC5qcyIsImxpc3RzL2xpc3RzLmpzIiwicHJvZHVjdHMvcHJvZHVjdHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQXhDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQTlFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiYW5ndWxhci5tb2R1bGUoJ0ZpcmVzaG9wcGluZycsIFtcbiAgICAnQ29tcGlsZWRUZW1wbGF0ZXMnLFxuICAgICdmaXJlYmFzZSddKVxuLmNvbmZpZyhbXG4gICAgJyRjb21waWxlUHJvdmlkZXInLFxuICAgICckaHR0cFByb3ZpZGVyJyxcbiAgICBmdW5jdGlvbigkY29tcGlsZVByb3ZpZGVyLCAkaHR0cFByb3ZpZGVyKSB7XG4gICAgICAgICRjb21waWxlUHJvdmlkZXIuZGVidWdJbmZvRW5hYmxlZChmYWxzZSk7XG4gICAgICAgICRodHRwUHJvdmlkZXIudXNlQXBwbHlBc3luYyh0cnVlKTtcbiAgICB9XG5dKTsiLCJhbmd1bGFyLm1vZHVsZSgnRmlyZXNob3BwaW5nJylcbi5mYWN0b3J5KCdkb21TZXJ2aWNlJywgWyckdGltZW91dCcsICckd2luZG93JywgZnVuY3Rpb24oJHRpbWVvdXQsICR3aW5kb3cpe1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIHZhciBkb21TZXJ2aWNlID0ge307XG5cblxuICAgIGRvbVNlcnZpY2UuZm9jdXMgPSBmdW5jdGlvbihpZCl7XG4gICAgICAgICR0aW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGVsZW1lbnQgPSAkd2luZG93LmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKTtcblxuICAgICAgICAgICAgaWYgKGVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgZWxlbWVudC5mb2N1cygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIGRvbVNlcnZpY2U7XG59XSk7XG5cbiIsImFuZ3VsYXIubW9kdWxlKCdGaXJlc2hvcHBpbmcnKVxuLmZhY3RvcnkoJ2xpc3RTZXJ2aWNlJywgWyckZmlyZWJhc2VPYmplY3QnLCBmdW5jdGlvbigkZmlyZWJhc2VPYmplY3Qpe1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIHZhciBsaXN0U2VydmljZSA9IHt9O1xuICAgIHZhciBsaXN0V2F0Y2hlciA9IFtdO1xuXG4gICAgbGlzdFNlcnZpY2UubGlzdCA9IHt9O1xuXG4gICAgbGlzdFNlcnZpY2Uuc2V0TGlzdCA9IGZ1bmN0aW9uKHBhcmFtcyl7XG4gICAgICAgIGlmIChwYXJhbXMubGlzdCkge1xuICAgICAgICAgICAgdmFyIGZpcmVCYXNlQ29ubmVjdGlvbiA9IG5ldyBGaXJlYmFzZSgnaHR0cHM6Ly9zaXp6bGluZy10b3JjaC05MjUuZmlyZWJhc2Vpby5jb20vc2hvcHBpbmcvbGlzdC8nICsgcGFyYW1zLmxpc3QpO1xuICAgICAgICAgICAgbGlzdFNlcnZpY2UubGlzdCA9ICRmaXJlYmFzZU9iamVjdChmaXJlQmFzZUNvbm5lY3Rpb24pO1xuICAgICAgICAgICAgdXBkYXRlKCk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgbGlzdFNlcnZpY2UuY2xlYXIgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5saXN0ID0ge307XG4gICAgICAgIHVwZGF0ZSgpO1xuICAgIH07XG5cbiAgICBsaXN0U2VydmljZS5yZWdpc3RlciA9IGZ1bmN0aW9uKGNiKSB7XG4gICAgICAgIGxpc3RXYXRjaGVyLnB1c2goY2IpO1xuICAgIH07XG5cbiAgICBsaXN0U2VydmljZS5hZGRQcm9kdWN0VG9MaXN0ID0gZnVuY3Rpb24ocHJvZHVjdCwgYW1vdW50KSB7XG4gICAgICAgIGxpc3RTZXJ2aWNlLmxpc3QudG9BZGQgPSBsaXN0U2VydmljZS5saXN0LnRvQWRkIHx8IFtdO1xuXG4gICAgICAgIGxpc3RTZXJ2aWNlLmxpc3QudG9BZGQucHVzaCh7XG4gICAgICAgICAgICBwcm9kdWN0OiBwcm9kdWN0LFxuICAgICAgICAgICAgYW1vdW50OiBhbW91bnRcbiAgICAgICAgfSk7XG5cbiAgICAgICAgbGlzdFNlcnZpY2UubGlzdC4kc2F2ZSgpO1xuICAgIH07XG5cbiAgICBsaXN0U2VydmljZS5hZGRUb0Jhc2tldCA9IGZ1bmN0aW9uKGl0ZW0sIGluZGV4KSB7XG4gICAgICAgIGxpc3RTZXJ2aWNlLmxpc3QuYWxyZWFkeUFkZGVkID0gbGlzdFNlcnZpY2UubGlzdC5hbHJlYWR5QWRkZWQgfHwgW107XG5cbiAgICAgICAgbGlzdFNlcnZpY2UubGlzdC50b0FkZC5zcGxpY2UoaW5kZXgsIDEpO1xuXG4gICAgICAgIGxpc3RTZXJ2aWNlLmxpc3QuYWxyZWFkeUFkZGVkLnB1c2goaXRlbSk7XG4gICAgICAgIGxpc3RTZXJ2aWNlLmxpc3QuJHNhdmUoKTtcblxuICAgIH07XG4gICAgbGlzdFNlcnZpY2UucmVtb3ZlRnJvbUJhc2tldCA9IGZ1bmN0aW9uKGl0ZW0sIGluZGV4KSB7XG4gICAgICAgIGxpc3RTZXJ2aWNlLmxpc3QudG9BZGQgPSBsaXN0U2VydmljZS5saXN0LnRvQWRkIHx8IFtdO1xuXG4gICAgICAgIGxpc3RTZXJ2aWNlLmxpc3QuYWxyZWFkeUFkZGVkLnNwbGljZShpbmRleCwgMSk7XG5cbiAgICAgICAgbGlzdFNlcnZpY2UubGlzdC50b0FkZC5wdXNoKGl0ZW0pO1xuICAgICAgICBsaXN0U2VydmljZS5saXN0LiRzYXZlKCk7XG4gICAgfTtcblxuICAgIGxpc3RTZXJ2aWNlLmNsZWFySXRlbXMgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgbGlzdFNlcnZpY2UubGlzdC50b0FkZCA9IFtdO1xuICAgICAgICBsaXN0U2VydmljZS5saXN0LmFscmVhZHlBZGRlZCA9IFtdO1xuICAgICAgICBsaXN0U2VydmljZS5saXN0LiRzYXZlKCk7XG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIHVwZGF0ZSgpe1xuICAgICAgICBsaXN0V2F0Y2hlci5mb3JFYWNoKGZ1bmN0aW9uKGNiKXtcbiAgICAgICAgICAgIGNiKGxpc3RTZXJ2aWNlLmxpc3QpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gbGlzdFNlcnZpY2U7XG59XSk7XG5cbiIsImFuZ3VsYXIubW9kdWxlKCdGaXJlc2hvcHBpbmcnKVxuLmRpcmVjdGl2ZSgncm91dGVyJyxcbiAgICBbJ2xpc3RTZXJ2aWNlJywgZnVuY3Rpb24obGlzdFNlcnZpY2UpIHtcblxuICAgICd1c2Ugc3RyaWN0JztcbiAgICB2YXIgbGluayA9IGZ1bmN0aW9uKCRzY29wZSkge1xuICAgICAgICB2YXIgcm91dGVyID0gbmV3IFJvdXRlcigpO1xuXG4gICAgICAgIHJvdXRlci5yZWdpc3RlcignLycsIGZ1bmN0aW9uKHBhcmFtcyl7XG4gICAgICAgICAgICBsaXN0U2VydmljZS5jbGVhcigpO1xuICAgICAgICAgICAgJHNjb3BlLmhhc0xpc3QgPSBmYWxzZTtcbiAgICAgICAgICAgICRzY29wZS4kYXBwbHlBc3luYygpO1xuICAgICAgICB9KTtcbiAgICAgICAgcm91dGVyLnJlZ2lzdGVyKCcvbGlzdC86bGlzdCcsIGZ1bmN0aW9uKHBhcmFtcyl7XG4gICAgICAgICAgICBsaXN0U2VydmljZS5zZXRMaXN0KHBhcmFtcyk7XG4gICAgICAgICAgICAkc2NvcGUuaGFzTGlzdCA9IHRydWU7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJvdXRlci5oYW5kbGVIYXNoQ2hhbmdlKCk7XG4gICAgfTtcblxuICAgIHJldHVybiB7XG4gICAgICAgIGxpbms6IGxpbmssXG4gICAgICAgIHNjb3BlOiB0cnVlLFxuICAgIH07XG59XSk7IiwiKGZ1bmN0aW9uKG1vZHVsZSkge1xudHJ5IHtcbiAgbW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ0NvbXBpbGVkVGVtcGxhdGVzJyk7XG59IGNhdGNoIChlKSB7XG4gIG1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCdDb21waWxlZFRlbXBsYXRlcycsIFtdKTtcbn1cbm1vZHVsZS5ydW4oWyckdGVtcGxhdGVDYWNoZScsIGZ1bmN0aW9uKCR0ZW1wbGF0ZUNhY2hlKSB7XG4gICR0ZW1wbGF0ZUNhY2hlLnB1dCgnbGlzdC9saXN0Lmh0bWwnLFxuICAgICc8aDE+TGlzdGUge3tsaXN0LiRpZH19PC9oMT48YnV0dG9uIG5nLWNsaWNrPVwidG9nZ2xlUHJvZHVjdHMoKVwiPlByb2R1a3RlIHp1ciBMaXN0ZTwvYnV0dG9uPjxoMiBjbGFzcz1cImItYlwiPm5vY2ggaW4gZGVuIGtvcmI8L2gyPjx1bD48bGkgbmctcmVwZWF0PVwiaXRlbSBpbiBsaXN0LnRvQWRkXCI+PGRpdiBjbGFzcz1cInAtcyBwb2ludGVyXCIgbmctY2xpY2s9XCJhZGRUb0Jhc2tldChpdGVtLCAkaW5kZXgpXCI+e3tpdGVtLnByb2R1Y3QubmFtZX19IHt7aXRlbS5hbW91bnR9fTwvZGl2PjwvbGk+PC91bD48aDIgY2xhc3M9XCJiLWJcIj5zY2hvbiBkYWJlaTwvaDI+PHVsPjxsaSBuZy1yZXBlYXQ9XCJpdGVtIGluIGxpc3QuYWxyZWFkeUFkZGVkXCI+PGRpdiBjbGFzcz1cInAtcyBwb2ludGVyXCIgbmctY2xpY2s9XCJyZW1vdmVGcm9tQmFza2V0KGl0ZW0sICRpbmRleClcIj57e2l0ZW0ucHJvZHVjdC5uYW1lfX0ge3tpdGVtLmFtb3VudH19PC9kaXY+PC9saT48L3VsPjxhIGhyZWY9XCJcIiBjbGFzcz1cIm0tdC01IGdyb3dcIiBuZy1jbGljaz1cImNsZWFySXRlbXMoKVwiPkxpc3RlIExlZXJlbjwvYT48ZGl2IGNsYXNzPVwicHJvZHVjdHNcIiBuZy1pZj1cInNob3dQcm9kdWN0c1wiPjxwcm9kdWN0cz48L3Byb2R1Y3RzPjxkaXYgY2xhc3M9XCJmbGV4IG0tdC0yXCI+PGEgaHJlZj1cIlwiIGNsYXNzPVwicCBiIGdyb3dcIiBuZy1jbGljaz1cInRvZ2dsZVByb2R1Y3RzKClcIj5GZXJ0aWc8L2E+PC9kaXY+PC9kaXY+Jyk7XG59XSk7XG59KSgpO1xuIiwiYW5ndWxhci5tb2R1bGUoJ0ZpcmVzaG9wcGluZycpXG4uZGlyZWN0aXZlKCdsaXN0cycsXG4gICAgWyckZmlyZWJhc2VBcnJheScsICdsaXN0U2VydmljZScsIGZ1bmN0aW9uKCRmaXJlYmFzZUFycmF5LCBsaXN0U2VydmljZSkge1xuXG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIHZhciBsaW5rID0gZnVuY3Rpb24oJHNjb3BlKSB7XG4gICAgICAgIHZhciBmaXJlQmFzZUNvbm5lY3Rpb24gPSBuZXcgRmlyZWJhc2UoJ2h0dHBzOi8vc2l6emxpbmctdG9yY2gtOTI1LmZpcmViYXNlaW8uY29tL3Nob3BwaW5nL2xpc3ROYW1lcycpO1xuXG4gICAgICAgICRzY29wZS5saXN0cyA9ICRmaXJlYmFzZUFycmF5KGZpcmVCYXNlQ29ubmVjdGlvbik7XG5cbiAgICAgICAgJHNjb3BlLmFkZExpc3QgPSBmdW5jdGlvbigpe1xuICAgICAgICAgICAgJHNjb3BlLmxpc3RzLiRhZGQoe1xuICAgICAgICAgICAgICAgIG5hbWU6ICRzY29wZS5uZXdOYW1lLFxuICAgICAgICAgICAgICAgIHRvQWRkOiBbXSxcbiAgICAgICAgICAgICAgICBhbHJlYWR5QWRkZWQ6IFtdXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICBmdW5jdGlvbiBuZXdMaXN0UmVzb2x2ZWQocmVmKSB7XG4gICAgICAgICAgICAkc2NvcGUuc2hvd0FkZExpc3QgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBsaW5rOiBsaW5rLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ2xpc3RzL2xpc3RzLmh0bWwnXG4gICAgfTtcbn1dKTsiLCIoZnVuY3Rpb24obW9kdWxlKSB7XG50cnkge1xuICBtb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnQ29tcGlsZWRUZW1wbGF0ZXMnKTtcbn0gY2F0Y2ggKGUpIHtcbiAgbW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ0NvbXBpbGVkVGVtcGxhdGVzJywgW10pO1xufVxubW9kdWxlLnJ1bihbJyR0ZW1wbGF0ZUNhY2hlJywgZnVuY3Rpb24oJHRlbXBsYXRlQ2FjaGUpIHtcbiAgJHRlbXBsYXRlQ2FjaGUucHV0KCdwcm9kdWN0cy9wcm9kdWN0cy5odG1sJyxcbiAgICAnPGgxPkxpc3RlbiB3dWh1aHU8L2gxPjxmb3JtIGNsYXNzPVwiZmxleFwiIG5nLWlmPVwic2hvd0Ftb3VudFwiIG5hbWU9XCJhZGRQcm9kdWN0VG9MaXN0Rm9ybVwiIG5nLXN1Ym1pdD1cImFkZFByb2R1Y3RUb0xpc3Qoc2VsZWN0ZWRQcm9kdWN0LCBzZWxlY3RlZFByb2R1Y3RBbW91bnQpXCI+PGRpdiBjbGFzcz1cIm0tdC0yXCIgbmctaWY9XCJzZWxlY3RlZFByb2R1Y3RBbW91bnRcIj57e3NlbGVjdGVkUHJvZHVjdC5uYW1lfX0gLSB7e3NlbGVjdGVkUHJvZHVjdEFtb3VudH19IG1hbCB6dXIgTGlzdGU8L2Rpdj48aW5wdXQgY2xhc3M9XCJncm93XCIgcmVxdWlyZWQ9XCJcIiBpZD1cInByb2R1Y3RBbW91bnRcIiB0eXBlPVwibnVtYmVyXCIgbmctbW9kZWw9XCJzZWxlY3RlZFByb2R1Y3RBbW91bnRcIiBwbGFjZWhvbGRlcj1cIkFuemFobCBoaW56dWbDvGdlblwiPjxidXR0b24gdHlwZT1cInN1Ym1pdFwiPkhJTlpVRsOcR0VOPC9idXR0b24+PC9mb3JtPjxmb3JtIGNsYXNzPVwiZmxleFwiIG5hbWU9XCJhZGRQcm9kdWN0XCIgbmctc3VibWl0PVwiYWRkUHJvZHVjdCgpXCI+PGlucHV0IHJlcXVpcmVkPVwiXCIgaWQ9XCJwcm9kdWN0TmFtZVwiIGNsYXNzPVwiZ3Jvd1wiIG5nLW1vZGVsPVwibmV3UHJvZHVjdE5hbWVcIiBuZy1jaGFuZ2U9XCJmaWx0ZXJQcm9kdWN0cyhuZXdQcm9kdWN0TmFtZSlcIiBwbGFjZWhvbGRlcj1cIlByb2R1a3QgaGluenVmw7xnZW5cIiB0eXBlPVwidGV4dFwiPiA8YnV0dG9uIHR5cGU9XCJzdWJtaXRcIj5ISU5aVUbDnEdFTjwvYnV0dG9uPjwvZm9ybT48dWw+PGxpIGNsYXNzPVwicG9pbnRlciBwLXMgYi1iXCIgbmctY2xpY2s9XCJzZWxlY3RQcm9kdWN0KHByb2R1Y3QpXCIgbmctcmVwZWF0PVwicHJvZHVjdCBpbiBmaWx0ZXJlZFByb2R1Y3RzIHRyYWNrIGJ5IHByb2R1Y3QuJGlkXCI+e3twcm9kdWN0Lm5hbWV9fTwvbGk+PC91bD4nKTtcbn1dKTtcbn0pKCk7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
