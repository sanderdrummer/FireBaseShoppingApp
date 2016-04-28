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
    '<div ng-if="list"><h1>Liste {{list.$id}}</h1>{{list}} <button ng-click="toggleProducts()">Produkte zur Liste</button><h2>noch in den korb</h2><ul><li ng-repeat="item in list.toAdd"><div ng-click="addToBasket(item, $index)">{{item.product.name}} {{item.amount}}</div></li></ul><h2>schon dabei</h2><ul><li ng-repeat="item in list.alreadyAdded"><div ng-click="removeFromBasket(item, $index)">{{item.product.name}} {{item.amount}}</div></li></ul><a href="" ng-click="clearItems()">Liste Leeren</a><div ng-if="showProducts"><products></products><a href="" ng-click="toggleProducts()">Fertig</a></div></div>');
}]);
})();

angular.module('Fireshopping')
.directive('lists',
    ['$firebaseArray', function($firebaseArray) {

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
    '<h1>Listen wuhuhu</h1><form name="addList" ng-submit="addList()"><input required="" ng-model="newName" placeholder="liste hinzufügen" type="text"><button type="submit">HINZUFÜGEN</button></form><ul><li ng-repeat="list in lists"><a ng-href="#/list/{{::list.name}}">{{::list.name}}</a></li></ul>');
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

(function(module) {
try {
  module = angular.module('CompiledTemplates');
} catch (e) {
  module = angular.module('CompiledTemplates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('products/product/product.html',
    '<h1>Listen wuhuhu</h1><form name="addList" ng-submit="addList()"><input required="" ng-model="newName" placeholder="liste hinzufügen" type="text"><button type="submit">HINZUFÜGEN</button></form><ul><li ng-repeat="list in lists">{{::list.name}}</li></ul>');
}]);
})();

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImRvbVNlcnZpY2UuanMiLCJsaXN0U2VydmljZS5qcyIsInJvdXRlci5qcyIsImxpc3QvbGlzdC5qcyIsImxpc3RzL2xpc3RzLmpzIiwicHJvZHVjdHMvcHJvZHVjdHMuanMiLCJwcm9kdWN0cy9wcm9kdWN0L3Byb2R1Y3QuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQXhDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQXhCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzlFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FENUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJidW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJhbmd1bGFyLm1vZHVsZSgnRmlyZXNob3BwaW5nJywgW1xuICAgICdDb21waWxlZFRlbXBsYXRlcycsXG4gICAgJ2ZpcmViYXNlJ10pXG4uY29uZmlnKFtcbiAgICAnJGNvbXBpbGVQcm92aWRlcicsXG4gICAgJyRodHRwUHJvdmlkZXInLFxuICAgIGZ1bmN0aW9uKCRjb21waWxlUHJvdmlkZXIsICRodHRwUHJvdmlkZXIpIHtcbiAgICAgICAgJGNvbXBpbGVQcm92aWRlci5kZWJ1Z0luZm9FbmFibGVkKGZhbHNlKTtcbiAgICAgICAgJGh0dHBQcm92aWRlci51c2VBcHBseUFzeW5jKHRydWUpO1xuICAgIH1cbl0pOyIsImFuZ3VsYXIubW9kdWxlKCdGaXJlc2hvcHBpbmcnKVxuLmZhY3RvcnkoJ2RvbVNlcnZpY2UnLCBbJyR0aW1lb3V0JywgJyR3aW5kb3cnLCBmdW5jdGlvbigkdGltZW91dCwgJHdpbmRvdyl7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgdmFyIGRvbVNlcnZpY2UgPSB7fTtcblxuXG4gICAgZG9tU2VydmljZS5mb2N1cyA9IGZ1bmN0aW9uKGlkKXtcbiAgICAgICAgJHRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgZWxlbWVudCA9ICR3aW5kb3cuZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xuXG4gICAgICAgICAgICBpZiAoZWxlbWVudCkge1xuICAgICAgICAgICAgICBlbGVtZW50LmZvY3VzKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICByZXR1cm4gZG9tU2VydmljZTtcbn1dKTtcblxuIiwiYW5ndWxhci5tb2R1bGUoJ0ZpcmVzaG9wcGluZycpXG4uZmFjdG9yeSgnbGlzdFNlcnZpY2UnLCBbJyRmaXJlYmFzZU9iamVjdCcsIGZ1bmN0aW9uKCRmaXJlYmFzZU9iamVjdCl7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgdmFyIGxpc3RTZXJ2aWNlID0ge307XG4gICAgdmFyIGxpc3RXYXRjaGVyID0gW107XG5cbiAgICBsaXN0U2VydmljZS5saXN0ID0ge307XG5cbiAgICBsaXN0U2VydmljZS5zZXRMaXN0ID0gZnVuY3Rpb24ocGFyYW1zKXtcbiAgICAgICAgaWYgKHBhcmFtcy5saXN0KSB7XG4gICAgICAgICAgICB2YXIgZmlyZUJhc2VDb25uZWN0aW9uID0gbmV3IEZpcmViYXNlKCdodHRwczovL3NpenpsaW5nLXRvcmNoLTkyNS5maXJlYmFzZWlvLmNvbS9zaG9wcGluZy9saXN0LycgKyBwYXJhbXMubGlzdCk7XG4gICAgICAgICAgICBsaXN0U2VydmljZS5saXN0ID0gJGZpcmViYXNlT2JqZWN0KGZpcmVCYXNlQ29ubmVjdGlvbik7XG4gICAgICAgICAgICB1cGRhdGUoKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBsaXN0U2VydmljZS5jbGVhciA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLmxpc3QgPSB7fTtcbiAgICAgICAgdXBkYXRlKCk7XG4gICAgfTtcblxuICAgIGxpc3RTZXJ2aWNlLnJlZ2lzdGVyID0gZnVuY3Rpb24oY2IpIHtcbiAgICAgICAgbGlzdFdhdGNoZXIucHVzaChjYik7XG4gICAgfTtcblxuICAgIGxpc3RTZXJ2aWNlLmFkZFByb2R1Y3RUb0xpc3QgPSBmdW5jdGlvbihwcm9kdWN0LCBhbW91bnQpIHtcbiAgICAgICAgbGlzdFNlcnZpY2UubGlzdC50b0FkZCA9IGxpc3RTZXJ2aWNlLmxpc3QudG9BZGQgfHwgW107XG5cbiAgICAgICAgbGlzdFNlcnZpY2UubGlzdC50b0FkZC5wdXNoKHtcbiAgICAgICAgICAgIHByb2R1Y3Q6IHByb2R1Y3QsXG4gICAgICAgICAgICBhbW91bnQ6IGFtb3VudFxuICAgICAgICB9KTtcblxuICAgICAgICBsaXN0U2VydmljZS5saXN0LiRzYXZlKCk7XG4gICAgfTtcblxuICAgIGxpc3RTZXJ2aWNlLmFkZFRvQmFza2V0ID0gZnVuY3Rpb24oaXRlbSwgaW5kZXgpIHtcbiAgICAgICAgbGlzdFNlcnZpY2UubGlzdC5hbHJlYWR5QWRkZWQgPSBsaXN0U2VydmljZS5saXN0LmFscmVhZHlBZGRlZCB8fCBbXTtcblxuICAgICAgICBsaXN0U2VydmljZS5saXN0LnRvQWRkLnNwbGljZShpbmRleCwgMSk7XG5cbiAgICAgICAgbGlzdFNlcnZpY2UubGlzdC5hbHJlYWR5QWRkZWQucHVzaChpdGVtKTtcbiAgICAgICAgbGlzdFNlcnZpY2UubGlzdC4kc2F2ZSgpO1xuXG4gICAgfTtcbiAgICBsaXN0U2VydmljZS5yZW1vdmVGcm9tQmFza2V0ID0gZnVuY3Rpb24oaXRlbSwgaW5kZXgpIHtcbiAgICAgICAgbGlzdFNlcnZpY2UubGlzdC50b0FkZCA9IGxpc3RTZXJ2aWNlLmxpc3QudG9BZGQgfHwgW107XG5cbiAgICAgICAgbGlzdFNlcnZpY2UubGlzdC5hbHJlYWR5QWRkZWQuc3BsaWNlKGluZGV4LCAxKTtcblxuICAgICAgICBsaXN0U2VydmljZS5saXN0LnRvQWRkLnB1c2goaXRlbSk7XG4gICAgICAgIGxpc3RTZXJ2aWNlLmxpc3QuJHNhdmUoKTtcbiAgICB9O1xuXG4gICAgbGlzdFNlcnZpY2UuY2xlYXJJdGVtcyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBsaXN0U2VydmljZS5saXN0LnRvQWRkID0gW107XG4gICAgICAgIGxpc3RTZXJ2aWNlLmxpc3QuYWxyZWFkeUFkZGVkID0gW107XG4gICAgICAgIGxpc3RTZXJ2aWNlLmxpc3QuJHNhdmUoKTtcbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gdXBkYXRlKCl7XG4gICAgICAgIGxpc3RXYXRjaGVyLmZvckVhY2goZnVuY3Rpb24oY2Ipe1xuICAgICAgICAgICAgY2IobGlzdFNlcnZpY2UubGlzdCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiBsaXN0U2VydmljZTtcbn1dKTtcblxuIiwiYW5ndWxhci5tb2R1bGUoJ0ZpcmVzaG9wcGluZycpXG4uZGlyZWN0aXZlKCdyb3V0ZXInLFxuICAgIFsnbGlzdFNlcnZpY2UnLCBmdW5jdGlvbihsaXN0U2VydmljZSkge1xuXG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIHZhciBsaW5rID0gZnVuY3Rpb24oJHNjb3BlKSB7XG4gICAgICAgIHZhciByb3V0ZXIgPSBuZXcgUm91dGVyKCk7XG5cbiAgICAgICAgcm91dGVyLnJlZ2lzdGVyKCcvJywgZnVuY3Rpb24ocGFyYW1zKXtcbiAgICAgICAgICAgIGxpc3RTZXJ2aWNlLmNsZWFyKHBhcmFtcyk7XG4gICAgICAgIH0pO1xuICAgICAgICByb3V0ZXIucmVnaXN0ZXIoJy9saXN0LzpsaXN0JywgZnVuY3Rpb24ocGFyYW1zKXtcbiAgICAgICAgICAgIGxpc3RTZXJ2aWNlLnNldExpc3QocGFyYW1zKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcm91dGVyLmhhbmRsZUhhc2hDaGFuZ2UoKTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgbGluazogbGluayxcbiAgICAgICAgc2NvcGU6IHRydWUsXG4gICAgfTtcbn1dKTsiLCIoZnVuY3Rpb24obW9kdWxlKSB7XG50cnkge1xuICBtb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnQ29tcGlsZWRUZW1wbGF0ZXMnKTtcbn0gY2F0Y2ggKGUpIHtcbiAgbW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ0NvbXBpbGVkVGVtcGxhdGVzJywgW10pO1xufVxubW9kdWxlLnJ1bihbJyR0ZW1wbGF0ZUNhY2hlJywgZnVuY3Rpb24oJHRlbXBsYXRlQ2FjaGUpIHtcbiAgJHRlbXBsYXRlQ2FjaGUucHV0KCdsaXN0L2xpc3QuaHRtbCcsXG4gICAgJzxkaXYgbmctaWY9XCJsaXN0XCI+PGgxPkxpc3RlIHt7bGlzdC4kaWR9fTwvaDE+e3tsaXN0fX0gPGJ1dHRvbiBuZy1jbGljaz1cInRvZ2dsZVByb2R1Y3RzKClcIj5Qcm9kdWt0ZSB6dXIgTGlzdGU8L2J1dHRvbj48aDI+bm9jaCBpbiBkZW4ga29yYjwvaDI+PHVsPjxsaSBuZy1yZXBlYXQ9XCJpdGVtIGluIGxpc3QudG9BZGRcIj48ZGl2IG5nLWNsaWNrPVwiYWRkVG9CYXNrZXQoaXRlbSwgJGluZGV4KVwiPnt7aXRlbS5wcm9kdWN0Lm5hbWV9fSB7e2l0ZW0uYW1vdW50fX08L2Rpdj48L2xpPjwvdWw+PGgyPnNjaG9uIGRhYmVpPC9oMj48dWw+PGxpIG5nLXJlcGVhdD1cIml0ZW0gaW4gbGlzdC5hbHJlYWR5QWRkZWRcIj48ZGl2IG5nLWNsaWNrPVwicmVtb3ZlRnJvbUJhc2tldChpdGVtLCAkaW5kZXgpXCI+e3tpdGVtLnByb2R1Y3QubmFtZX19IHt7aXRlbS5hbW91bnR9fTwvZGl2PjwvbGk+PC91bD48YSBocmVmPVwiXCIgbmctY2xpY2s9XCJjbGVhckl0ZW1zKClcIj5MaXN0ZSBMZWVyZW48L2E+PGRpdiBuZy1pZj1cInNob3dQcm9kdWN0c1wiPjxwcm9kdWN0cz48L3Byb2R1Y3RzPjxhIGhyZWY9XCJcIiBuZy1jbGljaz1cInRvZ2dsZVByb2R1Y3RzKClcIj5GZXJ0aWc8L2E+PC9kaXY+PC9kaXY+Jyk7XG59XSk7XG59KSgpO1xuIiwiKGZ1bmN0aW9uKG1vZHVsZSkge1xudHJ5IHtcbiAgbW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ0NvbXBpbGVkVGVtcGxhdGVzJyk7XG59IGNhdGNoIChlKSB7XG4gIG1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCdDb21waWxlZFRlbXBsYXRlcycsIFtdKTtcbn1cbm1vZHVsZS5ydW4oWyckdGVtcGxhdGVDYWNoZScsIGZ1bmN0aW9uKCR0ZW1wbGF0ZUNhY2hlKSB7XG4gICR0ZW1wbGF0ZUNhY2hlLnB1dCgnbGlzdHMvbGlzdHMuaHRtbCcsXG4gICAgJzxoMT5MaXN0ZW4gd3VodWh1PC9oMT48Zm9ybSBuYW1lPVwiYWRkTGlzdFwiIG5nLXN1Ym1pdD1cImFkZExpc3QoKVwiPjxpbnB1dCByZXF1aXJlZD1cIlwiIG5nLW1vZGVsPVwibmV3TmFtZVwiIHBsYWNlaG9sZGVyPVwibGlzdGUgaGluenVmw7xnZW5cIiB0eXBlPVwidGV4dFwiPjxidXR0b24gdHlwZT1cInN1Ym1pdFwiPkhJTlpVRsOcR0VOPC9idXR0b24+PC9mb3JtPjx1bD48bGkgbmctcmVwZWF0PVwibGlzdCBpbiBsaXN0c1wiPjxhIG5nLWhyZWY9XCIjL2xpc3Qve3s6Omxpc3QubmFtZX19XCI+e3s6Omxpc3QubmFtZX19PC9hPjwvbGk+PC91bD4nKTtcbn1dKTtcbn0pKCk7XG4iLCIoZnVuY3Rpb24obW9kdWxlKSB7XG50cnkge1xuICBtb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnQ29tcGlsZWRUZW1wbGF0ZXMnKTtcbn0gY2F0Y2ggKGUpIHtcbiAgbW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ0NvbXBpbGVkVGVtcGxhdGVzJywgW10pO1xufVxubW9kdWxlLnJ1bihbJyR0ZW1wbGF0ZUNhY2hlJywgZnVuY3Rpb24oJHRlbXBsYXRlQ2FjaGUpIHtcbiAgJHRlbXBsYXRlQ2FjaGUucHV0KCdwcm9kdWN0cy9wcm9kdWN0cy5odG1sJyxcbiAgICAnPGgxPkxpc3RlbiB3dWh1aHU8L2gxPjxmb3JtIG5nLWlmPVwic2hvd0Ftb3VudFwiIG5hbWU9XCJhZGRQcm9kdWN0VG9MaXN0Rm9ybVwiIG5nLXN1Ym1pdD1cImFkZFByb2R1Y3RUb0xpc3Qoc2VsZWN0ZWRQcm9kdWN0LCBzZWxlY3RlZFByb2R1Y3RBbW91bnQpXCI+PGRpdiBuZy1pZj1cInNlbGVjdGVkUHJvZHVjdEFtb3VudFwiPnt7c2VsZWN0ZWRQcm9kdWN0Lm5hbWV9fSAtIHt7c2VsZWN0ZWRQcm9kdWN0QW1vdW50fX0gbWFsIHp1ciBMaXN0ZTwvZGl2PjxpbnB1dCByZXF1aXJlZD1cIlwiIGlkPVwicHJvZHVjdEFtb3VudFwiIHR5cGU9XCJudW1iZXJcIiBuZy1tb2RlbD1cInNlbGVjdGVkUHJvZHVjdEFtb3VudFwiIHBsYWNlaG9sZGVyPVwiQW56YWhsIGhpbnp1ZsO8Z2VuXCI+PGJ1dHRvbiB0eXBlPVwic3VibWl0XCI+SElOWlVGw5xHRU48L2J1dHRvbj48L2Zvcm0+PGZvcm0gbmFtZT1cImFkZFByb2R1Y3RcIiBuZy1zdWJtaXQ9XCJhZGRQcm9kdWN0KClcIj48aW5wdXQgcmVxdWlyZWQ9XCJcIiBpZD1cInByb2R1Y3ROYW1lXCIgbmctbW9kZWw9XCJuZXdQcm9kdWN0TmFtZVwiIG5nLWNoYW5nZT1cImZpbHRlclByb2R1Y3RzKG5ld1Byb2R1Y3ROYW1lKVwiIHBsYWNlaG9sZGVyPVwiUHJvZHVrdCBoaW56dWbDvGdlblwiIHR5cGU9XCJ0ZXh0XCI+IDxidXR0b24gdHlwZT1cInN1Ym1pdFwiPkhJTlpVRsOcR0VOPC9idXR0b24+PC9mb3JtPjx1bD48bGkgbmctY2xpY2s9XCJzZWxlY3RQcm9kdWN0KHByb2R1Y3QpXCIgbmctcmVwZWF0PVwicHJvZHVjdCBpbiBmaWx0ZXJlZFByb2R1Y3RzIHRyYWNrIGJ5IHByb2R1Y3QuJGlkXCI+e3twcm9kdWN0Lm5hbWV9fTwvbGk+PC91bD4nKTtcbn1dKTtcbn0pKCk7XG4iLCIoZnVuY3Rpb24obW9kdWxlKSB7XG50cnkge1xuICBtb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnQ29tcGlsZWRUZW1wbGF0ZXMnKTtcbn0gY2F0Y2ggKGUpIHtcbiAgbW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ0NvbXBpbGVkVGVtcGxhdGVzJywgW10pO1xufVxubW9kdWxlLnJ1bihbJyR0ZW1wbGF0ZUNhY2hlJywgZnVuY3Rpb24oJHRlbXBsYXRlQ2FjaGUpIHtcbiAgJHRlbXBsYXRlQ2FjaGUucHV0KCdwcm9kdWN0cy9wcm9kdWN0L3Byb2R1Y3QuaHRtbCcsXG4gICAgJzxoMT5MaXN0ZW4gd3VodWh1PC9oMT48Zm9ybSBuYW1lPVwiYWRkTGlzdFwiIG5nLXN1Ym1pdD1cImFkZExpc3QoKVwiPjxpbnB1dCByZXF1aXJlZD1cIlwiIG5nLW1vZGVsPVwibmV3TmFtZVwiIHBsYWNlaG9sZGVyPVwibGlzdGUgaGluenVmw7xnZW5cIiB0eXBlPVwidGV4dFwiPjxidXR0b24gdHlwZT1cInN1Ym1pdFwiPkhJTlpVRsOcR0VOPC9idXR0b24+PC9mb3JtPjx1bD48bGkgbmctcmVwZWF0PVwibGlzdCBpbiBsaXN0c1wiPnt7OjpsaXN0Lm5hbWV9fTwvbGk+PC91bD4nKTtcbn1dKTtcbn0pKCk7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
