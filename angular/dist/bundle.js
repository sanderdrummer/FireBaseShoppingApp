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
            listService.clear(params);
        });
        router.register('/list/:list', function(params){
            listService.setList(params);
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
    '<div ng-if="list"><h1>Liste {{list.$id}}</h1><button ng-click="toggleProducts()">Produkte zur Liste</button><h2 class="b-b">noch in den korb</h2><ul><li ng-repeat="item in list.toAdd"><div class="p-s pointer" ng-click="addToBasket(item, $index)">{{item.product.name}} {{item.amount}}</div></li></ul><h2 class="b-b">schon dabei</h2><ul><li ng-repeat="item in list.alreadyAdded"><div class="p-s pointer" ng-click="removeFromBasket(item, $index)">{{item.product.name}} {{item.amount}}</div></li></ul><a href="" class="m-t-5 grow" ng-click="clearItems()">Liste Leeren</a><div class="products" ng-if="showProducts"><products></products><a href="" ng-click="toggleProducts()">Fertig</a></div></div>');
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
    '<h1>Listen wuhuhu</h1><form ng-if="showAmount" name="addProductToListForm" ng-submit="addProductToList(selectedProduct, selectedProductAmount)"><div ng-if="selectedProductAmount">{{selectedProduct.name}} - {{selectedProductAmount}} mal zur Liste</div><input required="" id="productAmount" type="number" ng-model="selectedProductAmount" placeholder="Anzahl hinzufügen"><button type="submit">HINZUFÜGEN</button></form><form name="addProduct" ng-submit="addProduct()"><input required="" id="productName" ng-model="newProductName" ng-change="filterProducts(newProductName)" placeholder="Produkt hinzufügen" type="text"> <button type="submit">HINZUFÜGEN</button></form><ul><li ng-click="selectProduct(product)" ng-repeat="product in filteredProducts track by product.$id">{{product.name}}</li></ul>');
}]);
})();

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImRvbVNlcnZpY2UuanMiLCJsaXN0U2VydmljZS5qcyIsInJvdXRlci5qcyIsImxpc3QvbGlzdC5qcyIsImxpc3RzL2xpc3RzLmpzIiwicHJvZHVjdHMvcHJvZHVjdHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQXhDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQTNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQTlFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiYW5ndWxhci5tb2R1bGUoJ0ZpcmVzaG9wcGluZycsIFtcbiAgICAnQ29tcGlsZWRUZW1wbGF0ZXMnLFxuICAgICdmaXJlYmFzZSddKVxuLmNvbmZpZyhbXG4gICAgJyRjb21waWxlUHJvdmlkZXInLFxuICAgICckaHR0cFByb3ZpZGVyJyxcbiAgICBmdW5jdGlvbigkY29tcGlsZVByb3ZpZGVyLCAkaHR0cFByb3ZpZGVyKSB7XG4gICAgICAgICRjb21waWxlUHJvdmlkZXIuZGVidWdJbmZvRW5hYmxlZChmYWxzZSk7XG4gICAgICAgICRodHRwUHJvdmlkZXIudXNlQXBwbHlBc3luYyh0cnVlKTtcbiAgICB9XG5dKTsiLCJhbmd1bGFyLm1vZHVsZSgnRmlyZXNob3BwaW5nJylcbi5mYWN0b3J5KCdkb21TZXJ2aWNlJywgWyckdGltZW91dCcsICckd2luZG93JywgZnVuY3Rpb24oJHRpbWVvdXQsICR3aW5kb3cpe1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIHZhciBkb21TZXJ2aWNlID0ge307XG5cblxuICAgIGRvbVNlcnZpY2UuZm9jdXMgPSBmdW5jdGlvbihpZCl7XG4gICAgICAgICR0aW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGVsZW1lbnQgPSAkd2luZG93LmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKTtcblxuICAgICAgICAgICAgaWYgKGVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgZWxlbWVudC5mb2N1cygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIGRvbVNlcnZpY2U7XG59XSk7XG5cbiIsImFuZ3VsYXIubW9kdWxlKCdGaXJlc2hvcHBpbmcnKVxuLmZhY3RvcnkoJ2xpc3RTZXJ2aWNlJywgWyckZmlyZWJhc2VPYmplY3QnLCBmdW5jdGlvbigkZmlyZWJhc2VPYmplY3Qpe1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIHZhciBsaXN0U2VydmljZSA9IHt9O1xuICAgIHZhciBsaXN0V2F0Y2hlciA9IFtdO1xuXG4gICAgbGlzdFNlcnZpY2UubGlzdCA9IHt9O1xuXG4gICAgbGlzdFNlcnZpY2Uuc2V0TGlzdCA9IGZ1bmN0aW9uKHBhcmFtcyl7XG4gICAgICAgIGlmIChwYXJhbXMubGlzdCkge1xuICAgICAgICAgICAgdmFyIGZpcmVCYXNlQ29ubmVjdGlvbiA9IG5ldyBGaXJlYmFzZSgnaHR0cHM6Ly9zaXp6bGluZy10b3JjaC05MjUuZmlyZWJhc2Vpby5jb20vc2hvcHBpbmcvbGlzdC8nICsgcGFyYW1zLmxpc3QpO1xuICAgICAgICAgICAgbGlzdFNlcnZpY2UubGlzdCA9ICRmaXJlYmFzZU9iamVjdChmaXJlQmFzZUNvbm5lY3Rpb24pO1xuICAgICAgICAgICAgdXBkYXRlKCk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgbGlzdFNlcnZpY2UuY2xlYXIgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5saXN0ID0ge307XG4gICAgICAgIHVwZGF0ZSgpO1xuICAgIH07XG5cbiAgICBsaXN0U2VydmljZS5yZWdpc3RlciA9IGZ1bmN0aW9uKGNiKSB7XG4gICAgICAgIGxpc3RXYXRjaGVyLnB1c2goY2IpO1xuICAgIH07XG5cbiAgICBsaXN0U2VydmljZS5hZGRQcm9kdWN0VG9MaXN0ID0gZnVuY3Rpb24ocHJvZHVjdCwgYW1vdW50KSB7XG4gICAgICAgIGxpc3RTZXJ2aWNlLmxpc3QudG9BZGQgPSBsaXN0U2VydmljZS5saXN0LnRvQWRkIHx8IFtdO1xuXG4gICAgICAgIGxpc3RTZXJ2aWNlLmxpc3QudG9BZGQucHVzaCh7XG4gICAgICAgICAgICBwcm9kdWN0OiBwcm9kdWN0LFxuICAgICAgICAgICAgYW1vdW50OiBhbW91bnRcbiAgICAgICAgfSk7XG5cbiAgICAgICAgbGlzdFNlcnZpY2UubGlzdC4kc2F2ZSgpO1xuICAgIH07XG5cbiAgICBsaXN0U2VydmljZS5hZGRUb0Jhc2tldCA9IGZ1bmN0aW9uKGl0ZW0sIGluZGV4KSB7XG4gICAgICAgIGxpc3RTZXJ2aWNlLmxpc3QuYWxyZWFkeUFkZGVkID0gbGlzdFNlcnZpY2UubGlzdC5hbHJlYWR5QWRkZWQgfHwgW107XG5cbiAgICAgICAgbGlzdFNlcnZpY2UubGlzdC50b0FkZC5zcGxpY2UoaW5kZXgsIDEpO1xuXG4gICAgICAgIGxpc3RTZXJ2aWNlLmxpc3QuYWxyZWFkeUFkZGVkLnB1c2goaXRlbSk7XG4gICAgICAgIGxpc3RTZXJ2aWNlLmxpc3QuJHNhdmUoKTtcblxuICAgIH07XG4gICAgbGlzdFNlcnZpY2UucmVtb3ZlRnJvbUJhc2tldCA9IGZ1bmN0aW9uKGl0ZW0sIGluZGV4KSB7XG4gICAgICAgIGxpc3RTZXJ2aWNlLmxpc3QudG9BZGQgPSBsaXN0U2VydmljZS5saXN0LnRvQWRkIHx8IFtdO1xuXG4gICAgICAgIGxpc3RTZXJ2aWNlLmxpc3QuYWxyZWFkeUFkZGVkLnNwbGljZShpbmRleCwgMSk7XG5cbiAgICAgICAgbGlzdFNlcnZpY2UubGlzdC50b0FkZC5wdXNoKGl0ZW0pO1xuICAgICAgICBsaXN0U2VydmljZS5saXN0LiRzYXZlKCk7XG4gICAgfTtcblxuICAgIGxpc3RTZXJ2aWNlLmNsZWFySXRlbXMgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgbGlzdFNlcnZpY2UubGlzdC50b0FkZCA9IFtdO1xuICAgICAgICBsaXN0U2VydmljZS5saXN0LmFscmVhZHlBZGRlZCA9IFtdO1xuICAgICAgICBsaXN0U2VydmljZS5saXN0LiRzYXZlKCk7XG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIHVwZGF0ZSgpe1xuICAgICAgICBsaXN0V2F0Y2hlci5mb3JFYWNoKGZ1bmN0aW9uKGNiKXtcbiAgICAgICAgICAgIGNiKGxpc3RTZXJ2aWNlLmxpc3QpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gbGlzdFNlcnZpY2U7XG59XSk7XG5cbiIsImFuZ3VsYXIubW9kdWxlKCdGaXJlc2hvcHBpbmcnKVxuLmRpcmVjdGl2ZSgncm91dGVyJyxcbiAgICBbJ2xpc3RTZXJ2aWNlJywgZnVuY3Rpb24obGlzdFNlcnZpY2UpIHtcblxuICAgICd1c2Ugc3RyaWN0JztcbiAgICB2YXIgbGluayA9IGZ1bmN0aW9uKCRzY29wZSkge1xuICAgICAgICB2YXIgcm91dGVyID0gbmV3IFJvdXRlcigpO1xuXG4gICAgICAgIHJvdXRlci5yZWdpc3RlcignLycsIGZ1bmN0aW9uKHBhcmFtcyl7XG4gICAgICAgICAgICBsaXN0U2VydmljZS5jbGVhcihwYXJhbXMpO1xuICAgICAgICB9KTtcbiAgICAgICAgcm91dGVyLnJlZ2lzdGVyKCcvbGlzdC86bGlzdCcsIGZ1bmN0aW9uKHBhcmFtcyl7XG4gICAgICAgICAgICBsaXN0U2VydmljZS5zZXRMaXN0KHBhcmFtcyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJvdXRlci5oYW5kbGVIYXNoQ2hhbmdlKCk7XG4gICAgfTtcblxuICAgIHJldHVybiB7XG4gICAgICAgIGxpbms6IGxpbmssXG4gICAgICAgIHNjb3BlOiB0cnVlLFxuICAgIH07XG59XSk7IiwiKGZ1bmN0aW9uKG1vZHVsZSkge1xudHJ5IHtcbiAgbW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ0NvbXBpbGVkVGVtcGxhdGVzJyk7XG59IGNhdGNoIChlKSB7XG4gIG1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCdDb21waWxlZFRlbXBsYXRlcycsIFtdKTtcbn1cbm1vZHVsZS5ydW4oWyckdGVtcGxhdGVDYWNoZScsIGZ1bmN0aW9uKCR0ZW1wbGF0ZUNhY2hlKSB7XG4gICR0ZW1wbGF0ZUNhY2hlLnB1dCgnbGlzdC9saXN0Lmh0bWwnLFxuICAgICc8ZGl2IG5nLWlmPVwibGlzdFwiPjxoMT5MaXN0ZSB7e2xpc3QuJGlkfX08L2gxPjxidXR0b24gbmctY2xpY2s9XCJ0b2dnbGVQcm9kdWN0cygpXCI+UHJvZHVrdGUgenVyIExpc3RlPC9idXR0b24+PGgyIGNsYXNzPVwiYi1iXCI+bm9jaCBpbiBkZW4ga29yYjwvaDI+PHVsPjxsaSBuZy1yZXBlYXQ9XCJpdGVtIGluIGxpc3QudG9BZGRcIj48ZGl2IGNsYXNzPVwicC1zIHBvaW50ZXJcIiBuZy1jbGljaz1cImFkZFRvQmFza2V0KGl0ZW0sICRpbmRleClcIj57e2l0ZW0ucHJvZHVjdC5uYW1lfX0ge3tpdGVtLmFtb3VudH19PC9kaXY+PC9saT48L3VsPjxoMiBjbGFzcz1cImItYlwiPnNjaG9uIGRhYmVpPC9oMj48dWw+PGxpIG5nLXJlcGVhdD1cIml0ZW0gaW4gbGlzdC5hbHJlYWR5QWRkZWRcIj48ZGl2IGNsYXNzPVwicC1zIHBvaW50ZXJcIiBuZy1jbGljaz1cInJlbW92ZUZyb21CYXNrZXQoaXRlbSwgJGluZGV4KVwiPnt7aXRlbS5wcm9kdWN0Lm5hbWV9fSB7e2l0ZW0uYW1vdW50fX08L2Rpdj48L2xpPjwvdWw+PGEgaHJlZj1cIlwiIGNsYXNzPVwibS10LTUgZ3Jvd1wiIG5nLWNsaWNrPVwiY2xlYXJJdGVtcygpXCI+TGlzdGUgTGVlcmVuPC9hPjxkaXYgY2xhc3M9XCJwcm9kdWN0c1wiIG5nLWlmPVwic2hvd1Byb2R1Y3RzXCI+PHByb2R1Y3RzPjwvcHJvZHVjdHM+PGEgaHJlZj1cIlwiIG5nLWNsaWNrPVwidG9nZ2xlUHJvZHVjdHMoKVwiPkZlcnRpZzwvYT48L2Rpdj48L2Rpdj4nKTtcbn1dKTtcbn0pKCk7XG4iLCIoZnVuY3Rpb24obW9kdWxlKSB7XG50cnkge1xuICBtb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnQ29tcGlsZWRUZW1wbGF0ZXMnKTtcbn0gY2F0Y2ggKGUpIHtcbiAgbW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ0NvbXBpbGVkVGVtcGxhdGVzJywgW10pO1xufVxubW9kdWxlLnJ1bihbJyR0ZW1wbGF0ZUNhY2hlJywgZnVuY3Rpb24oJHRlbXBsYXRlQ2FjaGUpIHtcbiAgJHRlbXBsYXRlQ2FjaGUucHV0KCdsaXN0cy9saXN0cy5odG1sJyxcbiAgICAnPGZvcm0gY2xhc3M9XCJmbGV4XCIgbmFtZT1cImFkZExpc3RcIiBuZy1zdWJtaXQ9XCJhZGRMaXN0KClcIj48aW5wdXQgcmVxdWlyZWQ9XCJcIiBjbGFzcz1cImdyb3dcIiBuZy1tb2RlbD1cIm5ld05hbWVcIiBwbGFjZWhvbGRlcj1cImxpc3RlIGhpbnp1ZsO8Z2VuXCIgdHlwZT1cInRleHRcIj4gPGJ1dHRvbiB0eXBlPVwic3VibWl0XCI+SElOWlVGw5xHRU48L2J1dHRvbj48L2Zvcm0+PHVsPjxsaSBjbGFzcz1cImZsZXhcIiBuZy1yZXBlYXQ9XCJsaXN0IGluIGxpc3RzXCI+PGEgY2xhc3M9XCJiLWIgcCBncm93XCIgbmctaHJlZj1cIiMvbGlzdC97ezo6bGlzdC5uYW1lfX1cIj57ezo6bGlzdC5uYW1lfX08L2E+PC9saT48L3VsPicpO1xufV0pO1xufSkoKTtcbiIsIihmdW5jdGlvbihtb2R1bGUpIHtcbnRyeSB7XG4gIG1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCdDb21waWxlZFRlbXBsYXRlcycpO1xufSBjYXRjaCAoZSkge1xuICBtb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnQ29tcGlsZWRUZW1wbGF0ZXMnLCBbXSk7XG59XG5tb2R1bGUucnVuKFsnJHRlbXBsYXRlQ2FjaGUnLCBmdW5jdGlvbigkdGVtcGxhdGVDYWNoZSkge1xuICAkdGVtcGxhdGVDYWNoZS5wdXQoJ3Byb2R1Y3RzL3Byb2R1Y3RzLmh0bWwnLFxuICAgICc8aDE+TGlzdGVuIHd1aHVodTwvaDE+PGZvcm0gbmctaWY9XCJzaG93QW1vdW50XCIgbmFtZT1cImFkZFByb2R1Y3RUb0xpc3RGb3JtXCIgbmctc3VibWl0PVwiYWRkUHJvZHVjdFRvTGlzdChzZWxlY3RlZFByb2R1Y3QsIHNlbGVjdGVkUHJvZHVjdEFtb3VudClcIj48ZGl2IG5nLWlmPVwic2VsZWN0ZWRQcm9kdWN0QW1vdW50XCI+e3tzZWxlY3RlZFByb2R1Y3QubmFtZX19IC0ge3tzZWxlY3RlZFByb2R1Y3RBbW91bnR9fSBtYWwgenVyIExpc3RlPC9kaXY+PGlucHV0IHJlcXVpcmVkPVwiXCIgaWQ9XCJwcm9kdWN0QW1vdW50XCIgdHlwZT1cIm51bWJlclwiIG5nLW1vZGVsPVwic2VsZWN0ZWRQcm9kdWN0QW1vdW50XCIgcGxhY2Vob2xkZXI9XCJBbnphaGwgaGluenVmw7xnZW5cIj48YnV0dG9uIHR5cGU9XCJzdWJtaXRcIj5ISU5aVUbDnEdFTjwvYnV0dG9uPjwvZm9ybT48Zm9ybSBuYW1lPVwiYWRkUHJvZHVjdFwiIG5nLXN1Ym1pdD1cImFkZFByb2R1Y3QoKVwiPjxpbnB1dCByZXF1aXJlZD1cIlwiIGlkPVwicHJvZHVjdE5hbWVcIiBuZy1tb2RlbD1cIm5ld1Byb2R1Y3ROYW1lXCIgbmctY2hhbmdlPVwiZmlsdGVyUHJvZHVjdHMobmV3UHJvZHVjdE5hbWUpXCIgcGxhY2Vob2xkZXI9XCJQcm9kdWt0IGhpbnp1ZsO8Z2VuXCIgdHlwZT1cInRleHRcIj4gPGJ1dHRvbiB0eXBlPVwic3VibWl0XCI+SElOWlVGw5xHRU48L2J1dHRvbj48L2Zvcm0+PHVsPjxsaSBuZy1jbGljaz1cInNlbGVjdFByb2R1Y3QocHJvZHVjdClcIiBuZy1yZXBlYXQ9XCJwcm9kdWN0IGluIGZpbHRlcmVkUHJvZHVjdHMgdHJhY2sgYnkgcHJvZHVjdC4kaWRcIj57e3Byb2R1Y3QubmFtZX19PC9saT48L3VsPicpO1xufV0pO1xufSkoKTtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
