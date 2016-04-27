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
.factory('appEventService', ['$firebaseArray', function($firebaseArray){

    var appEventService = {};

    appEventService.showList = function(params){
        if (params.list) {
            var fireBaseConnection = new Firebase('https://sizzling-torch-925.firebaseio.com/shopping/list/' + params.list);
            return $firebaseArray(fireBaseConnection);
        }
    };

    return appEventService;
}]);


angular.module('Fireshopping')
.directive('router',
    ['appEventService', function(appEventService) {

    'use strict';
    var link = function($scope) {
        var router = new Router();

        router.register('/list/:list', function(params){
            $scope.listData = appEventService.showList(params);
        });

        router.handleHashChange();
    };

    return {
        link: link,
        scope: {
            listData: '='
        }
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
    '<h1>Liste {{listData.name}}</h1>{{listData}} <button>Produkte zur Liste</button><h2>noch in den korb</h2><ul><li ng-repeat="product in list.toAdd">{{::list.name}}</li></ul><h2>schon dabei</h2><ul><li ng-repeat="product in list.alreadyAdded">{{::list.name}}</li></ul><products list-data="listData"></products>');
}]);
})();

angular.module('Fireshopping')
.directive('list',
    [function() {

    'use strict';
    var link = function($scope) {

        $scope.showListDetails = false;

        $scope.addToBasket = function() {

        };
        $scope.removeFromBasket = function() {

        };
        $scope.removeFromList = function() {

        };
        $scope.clear = function() {

        };
        $scope.delete = function() {

        };
    };

    return {
        link: link,
        scope: {
            'listData': '='
        },
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
    '<h1>Listen wuhuhu</h1><form name="addList" ng-submit="addList()"><input required="" ng-model="newName" placeholder="liste hinzufügen" type="text"><button type="submit">HINZUFÜGEN</button></form><ul><li ng-repeat="list in lists"><a ng-href="#/list/{{::list.name}}">{{::list.name}}</a></li></ul>');
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
                name: $scope.newName
            });
        };

    };

    return {
        link: link,
        templateUrl: 'lists/lists.html'
    };
}]);
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
(function(module) {
try {
  module = angular.module('CompiledTemplates');
} catch (e) {
  module = angular.module('CompiledTemplates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('products/products.html',
    '<h1>Listen wuhuhu</h1>{{selectedProduct}}<form ng-if="showAmount" name="addProductToList" ng-submit="addList()"><input required="" type="number" ng-model="selectedProductAmount" placeholder="Anzahl hinzufügen"><button type="submit">HINZUFÜGEN</button></form><form name="addProduct" ng-submit="addList()"><input required="" ng-model="newProductName" ng-change="filterProducts(newProductName)" placeholder="Produkt hinzufügen" type="text"> <button type="submit">HINZUFÜGEN</button></form><ul><li ng-repeat="product in filteredProducts track by product.$id">{{product.name}}</li></ul>');
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImFwcEV2ZW50U2VydmljZS5qcyIsInJvdXRlci5qcyIsImxpc3QvbGlzdC5qcyIsImxpc3RzL2xpc3RzLmpzIiwicHJvZHVjdHMvcHJvZHVjdHMuanMiLCJwcm9kdWN0cy9wcm9kdWN0L3Byb2R1Y3QuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFyREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJidW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJhbmd1bGFyLm1vZHVsZSgnRmlyZXNob3BwaW5nJywgW1xuICAgICdDb21waWxlZFRlbXBsYXRlcycsXG4gICAgJ2ZpcmViYXNlJ10pXG4uY29uZmlnKFtcbiAgICAnJGNvbXBpbGVQcm92aWRlcicsXG4gICAgJyRodHRwUHJvdmlkZXInLFxuICAgIGZ1bmN0aW9uKCRjb21waWxlUHJvdmlkZXIsICRodHRwUHJvdmlkZXIpIHtcbiAgICAgICAgJGNvbXBpbGVQcm92aWRlci5kZWJ1Z0luZm9FbmFibGVkKGZhbHNlKTtcbiAgICAgICAgJGh0dHBQcm92aWRlci51c2VBcHBseUFzeW5jKHRydWUpO1xuICAgIH1cbl0pOyIsImFuZ3VsYXIubW9kdWxlKCdGaXJlc2hvcHBpbmcnKVxuLmZhY3RvcnkoJ2FwcEV2ZW50U2VydmljZScsIFsnJGZpcmViYXNlQXJyYXknLCBmdW5jdGlvbigkZmlyZWJhc2VBcnJheSl7XG5cbiAgICB2YXIgYXBwRXZlbnRTZXJ2aWNlID0ge307XG5cbiAgICBhcHBFdmVudFNlcnZpY2Uuc2hvd0xpc3QgPSBmdW5jdGlvbihwYXJhbXMpe1xuICAgICAgICBpZiAocGFyYW1zLmxpc3QpIHtcbiAgICAgICAgICAgIHZhciBmaXJlQmFzZUNvbm5lY3Rpb24gPSBuZXcgRmlyZWJhc2UoJ2h0dHBzOi8vc2l6emxpbmctdG9yY2gtOTI1LmZpcmViYXNlaW8uY29tL3Nob3BwaW5nL2xpc3QvJyArIHBhcmFtcy5saXN0KTtcbiAgICAgICAgICAgIHJldHVybiAkZmlyZWJhc2VBcnJheShmaXJlQmFzZUNvbm5lY3Rpb24pO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIHJldHVybiBhcHBFdmVudFNlcnZpY2U7XG59XSk7XG5cbiIsImFuZ3VsYXIubW9kdWxlKCdGaXJlc2hvcHBpbmcnKVxuLmRpcmVjdGl2ZSgncm91dGVyJyxcbiAgICBbJ2FwcEV2ZW50U2VydmljZScsIGZ1bmN0aW9uKGFwcEV2ZW50U2VydmljZSkge1xuXG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIHZhciBsaW5rID0gZnVuY3Rpb24oJHNjb3BlKSB7XG4gICAgICAgIHZhciByb3V0ZXIgPSBuZXcgUm91dGVyKCk7XG5cbiAgICAgICAgcm91dGVyLnJlZ2lzdGVyKCcvbGlzdC86bGlzdCcsIGZ1bmN0aW9uKHBhcmFtcyl7XG4gICAgICAgICAgICAkc2NvcGUubGlzdERhdGEgPSBhcHBFdmVudFNlcnZpY2Uuc2hvd0xpc3QocGFyYW1zKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcm91dGVyLmhhbmRsZUhhc2hDaGFuZ2UoKTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgbGluazogbGluayxcbiAgICAgICAgc2NvcGU6IHtcbiAgICAgICAgICAgIGxpc3REYXRhOiAnPSdcbiAgICAgICAgfVxuICAgIH07XG59XSk7IiwiYW5ndWxhci5tb2R1bGUoJ0ZpcmVzaG9wcGluZycpXG4uZGlyZWN0aXZlKCdsaXN0JyxcbiAgICBbZnVuY3Rpb24oKSB7XG5cbiAgICAndXNlIHN0cmljdCc7XG4gICAgdmFyIGxpbmsgPSBmdW5jdGlvbigkc2NvcGUpIHtcblxuICAgICAgICAkc2NvcGUuc2hvd0xpc3REZXRhaWxzID0gZmFsc2U7XG5cbiAgICAgICAgJHNjb3BlLmFkZFRvQmFza2V0ID0gZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgfTtcbiAgICAgICAgJHNjb3BlLnJlbW92ZUZyb21CYXNrZXQgPSBmdW5jdGlvbigpIHtcblxuICAgICAgICB9O1xuICAgICAgICAkc2NvcGUucmVtb3ZlRnJvbUxpc3QgPSBmdW5jdGlvbigpIHtcblxuICAgICAgICB9O1xuICAgICAgICAkc2NvcGUuY2xlYXIgPSBmdW5jdGlvbigpIHtcblxuICAgICAgICB9O1xuICAgICAgICAkc2NvcGUuZGVsZXRlID0gZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgfTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgbGluazogbGluayxcbiAgICAgICAgc2NvcGU6IHtcbiAgICAgICAgICAgICdsaXN0RGF0YSc6ICc9J1xuICAgICAgICB9LFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ2xpc3QvbGlzdC5odG1sJ1xuICAgIH07XG59XSk7IiwiYW5ndWxhci5tb2R1bGUoJ0ZpcmVzaG9wcGluZycpXG4uZGlyZWN0aXZlKCdsaXN0cycsXG4gICAgWyckZmlyZWJhc2VBcnJheScsIGZ1bmN0aW9uKCRmaXJlYmFzZUFycmF5KSB7XG5cbiAgICAndXNlIHN0cmljdCc7XG4gICAgdmFyIGxpbmsgPSBmdW5jdGlvbigkc2NvcGUpIHtcbiAgICAgICAgdmFyIGZpcmVCYXNlQ29ubmVjdGlvbiA9IG5ldyBGaXJlYmFzZSgnaHR0cHM6Ly9zaXp6bGluZy10b3JjaC05MjUuZmlyZWJhc2Vpby5jb20vc2hvcHBpbmcvbGlzdE5hbWVzJyk7XG5cbiAgICAgICAgJHNjb3BlLmxpc3RzID0gJGZpcmViYXNlQXJyYXkoZmlyZUJhc2VDb25uZWN0aW9uKTtcblxuICAgICAgICAkc2NvcGUuYWRkTGlzdCA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAkc2NvcGUubGlzdHMuJGFkZCh7XG4gICAgICAgICAgICAgICAgbmFtZTogJHNjb3BlLm5ld05hbWVcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgfTtcblxuICAgIHJldHVybiB7XG4gICAgICAgIGxpbms6IGxpbmssXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnbGlzdHMvbGlzdHMuaHRtbCdcbiAgICB9O1xufV0pOyIsIihmdW5jdGlvbihtb2R1bGUpIHtcbnRyeSB7XG4gIG1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCdDb21waWxlZFRlbXBsYXRlcycpO1xufSBjYXRjaCAoZSkge1xuICBtb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnQ29tcGlsZWRUZW1wbGF0ZXMnLCBbXSk7XG59XG5tb2R1bGUucnVuKFsnJHRlbXBsYXRlQ2FjaGUnLCBmdW5jdGlvbigkdGVtcGxhdGVDYWNoZSkge1xuICAkdGVtcGxhdGVDYWNoZS5wdXQoJ3Byb2R1Y3RzL3Byb2R1Y3RzLmh0bWwnLFxuICAgICc8aDE+TGlzdGVuIHd1aHVodTwvaDE+e3tzZWxlY3RlZFByb2R1Y3R9fTxmb3JtIG5nLWlmPVwic2hvd0Ftb3VudFwiIG5hbWU9XCJhZGRQcm9kdWN0VG9MaXN0XCIgbmctc3VibWl0PVwiYWRkTGlzdCgpXCI+PGlucHV0IHJlcXVpcmVkPVwiXCIgdHlwZT1cIm51bWJlclwiIG5nLW1vZGVsPVwic2VsZWN0ZWRQcm9kdWN0QW1vdW50XCIgcGxhY2Vob2xkZXI9XCJBbnphaGwgaGluenVmw7xnZW5cIj48YnV0dG9uIHR5cGU9XCJzdWJtaXRcIj5ISU5aVUbDnEdFTjwvYnV0dG9uPjwvZm9ybT48Zm9ybSBuYW1lPVwiYWRkUHJvZHVjdFwiIG5nLXN1Ym1pdD1cImFkZExpc3QoKVwiPjxpbnB1dCByZXF1aXJlZD1cIlwiIG5nLW1vZGVsPVwibmV3UHJvZHVjdE5hbWVcIiBuZy1jaGFuZ2U9XCJmaWx0ZXJQcm9kdWN0cyhuZXdQcm9kdWN0TmFtZSlcIiBwbGFjZWhvbGRlcj1cIlByb2R1a3QgaGluenVmw7xnZW5cIiB0eXBlPVwidGV4dFwiPiA8YnV0dG9uIHR5cGU9XCJzdWJtaXRcIj5ISU5aVUbDnEdFTjwvYnV0dG9uPjwvZm9ybT48dWw+PGxpIG5nLXJlcGVhdD1cInByb2R1Y3QgaW4gZmlsdGVyZWRQcm9kdWN0cyB0cmFjayBieSBwcm9kdWN0LiRpZFwiPnt7cHJvZHVjdC5uYW1lfX08L2xpPjwvdWw+Jyk7XG59XSk7XG59KSgpO1xuIiwiYW5ndWxhci5tb2R1bGUoJ0ZpcmVzaG9wcGluZycpXG4uZGlyZWN0aXZlKCdwcm9kdWN0JyxcbiAgICBbJyRmaXJlYmFzZUFycmF5JywgZnVuY3Rpb24oJGZpcmViYXNlQXJyYXkpIHtcblxuICAgICd1c2Ugc3RyaWN0JztcbiAgICB2YXIgbGluayA9IGZ1bmN0aW9uKCRzY29wZSkge1xuICAgICAgICB2YXIgZmlyZUJhc2VDb25uZWN0aW9uID0gbmV3IEZpcmViYXNlKCdodHRwczovL3NpenpsaW5nLXRvcmNoLTkyNS5maXJlYmFzZWlvLmNvbS9zaG9wcGluZy9saXN0TmFtZXMnKTtcblxuICAgICAgICAkc2NvcGUucHJvZHVjdHMgPSAkZmlyZWJhc2VBcnJheShmaXJlQmFzZUNvbm5lY3Rpb24pO1xuICAgICAgICAkc2NvcGUuZmlsdGVyZWRQcm9kdWN0cyA9ICRzY29wZS5saXNcbiAgICAgICAgJHNjb3BlLmZpbHRlclByb2R1Y3RzID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICRzY29wZS5saXN0LmZpbHRlcihmdW5jdGlvbih2YWwpe1xuXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgICRzY29wZS5hZGRMaXN0ID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICRzY29wZS5saXN0cy4kYWRkKHtcbiAgICAgICAgICAgICAgICBuYW1lOiAkc2NvcGUubmV3TmFtZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICB9O1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgbGluazogbGluayxcbiAgICAgICAgLy8gdGVtcGxhdGVVcmw6ICdsaXN0cy9saXN0cy5odG1sJ1xuICAgIH07XG59XSk7Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
