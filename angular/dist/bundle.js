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

        router.register('/', function(){
            console.log( 'i m home' );
        });
        router.register('/list/:list', function(params){
            $scope.listData = appEventService.showList(params);
            console.log( params, 'test', $scope.listData );
        });
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
    '<button>Produkte zur Liste</button><h2>noch in den korb</h2><ul><li ng-repeat="list in lists">{{::list.name}}</li></ul><h2>schon dabei</h2><ul><li ng-repeat="list in lists">{{::list.name}}</li></ul>');
}]);
})();

angular.module('Fireshopping')
.directive('list',
    [function() {

    'use strict';
    var link = function($scope) {
            $scope.$watch('listData', function(val){
                console.log( val );
            });

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

        $scope.products = $firebaseArray(fireBaseConnection);


        $scope.filterProducts = function(inputVal){
            console.log( inputVal );
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

        $scope.addList = function(){
            console.log( !$scope.filteredProducts.length );
            if (!$scope.filteredProducts.length) {
                $scope.products.$add({
                    name: $scope.newProduct
                });
            }
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
    '<h1>Listen wuhuhu</h1><form name="addProductToList" ng-submit="addList()"><input required="" type="number" ng-model="newProduct" placeholder="Anzahl hinzufügen"><button type="submit">HINZUFÜGEN</button></form><form name="addProduct" ng-submit="addList()"><input required="" ng-model="newProduct" ng-change="filterProducts(newProduct)" placeholder="Produkt hinzufügen" type="text"> <button type="submit">HINZUFÜGEN</button></form><ul><li ng-repeat="product in filteredProducts">{{product.name}}</li></ul>');
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImFwcEV2ZW50U2VydmljZS5qcyIsInJvdXRlci5qcyIsImxpc3QvbGlzdC5qcyIsImxpc3RzL2xpc3RzLmpzIiwicHJvZHVjdHMvcHJvZHVjdHMuanMiLCJwcm9kdWN0cy9wcm9kdWN0L3Byb2R1Y3QuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQVhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUF6Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQTVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiYW5ndWxhci5tb2R1bGUoJ0ZpcmVzaG9wcGluZycsIFtcbiAgICAnQ29tcGlsZWRUZW1wbGF0ZXMnLFxuICAgICdmaXJlYmFzZSddKVxuLmNvbmZpZyhbXG4gICAgJyRjb21waWxlUHJvdmlkZXInLFxuICAgICckaHR0cFByb3ZpZGVyJyxcbiAgICBmdW5jdGlvbigkY29tcGlsZVByb3ZpZGVyLCAkaHR0cFByb3ZpZGVyKSB7XG4gICAgICAgICRjb21waWxlUHJvdmlkZXIuZGVidWdJbmZvRW5hYmxlZChmYWxzZSk7XG4gICAgICAgICRodHRwUHJvdmlkZXIudXNlQXBwbHlBc3luYyh0cnVlKTtcbiAgICB9XG5dKTsiLCJhbmd1bGFyLm1vZHVsZSgnRmlyZXNob3BwaW5nJylcbi5mYWN0b3J5KCdhcHBFdmVudFNlcnZpY2UnLCBbJyRmaXJlYmFzZUFycmF5JywgZnVuY3Rpb24oJGZpcmViYXNlQXJyYXkpe1xuXG4gICAgdmFyIGFwcEV2ZW50U2VydmljZSA9IHt9O1xuXG4gICAgYXBwRXZlbnRTZXJ2aWNlLnNob3dMaXN0ID0gZnVuY3Rpb24ocGFyYW1zKXtcbiAgICAgICAgaWYgKHBhcmFtcy5saXN0KSB7XG4gICAgICAgICAgICB2YXIgZmlyZUJhc2VDb25uZWN0aW9uID0gbmV3IEZpcmViYXNlKCdodHRwczovL3NpenpsaW5nLXRvcmNoLTkyNS5maXJlYmFzZWlvLmNvbS9zaG9wcGluZy9saXN0LycgKyBwYXJhbXMubGlzdCk7XG4gICAgICAgICAgICByZXR1cm4gJGZpcmViYXNlQXJyYXkoZmlyZUJhc2VDb25uZWN0aW9uKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICByZXR1cm4gYXBwRXZlbnRTZXJ2aWNlO1xufV0pO1xuXG4iLCJhbmd1bGFyLm1vZHVsZSgnRmlyZXNob3BwaW5nJylcbi5kaXJlY3RpdmUoJ3JvdXRlcicsXG4gICAgWydhcHBFdmVudFNlcnZpY2UnLCBmdW5jdGlvbihhcHBFdmVudFNlcnZpY2UpIHtcblxuICAgICd1c2Ugc3RyaWN0JztcbiAgICB2YXIgbGluayA9IGZ1bmN0aW9uKCRzY29wZSkge1xuICAgICAgICB2YXIgcm91dGVyID0gbmV3IFJvdXRlcigpO1xuXG4gICAgICAgIHJvdXRlci5yZWdpc3RlcignLycsIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyggJ2kgbSBob21lJyApO1xuICAgICAgICB9KTtcbiAgICAgICAgcm91dGVyLnJlZ2lzdGVyKCcvbGlzdC86bGlzdCcsIGZ1bmN0aW9uKHBhcmFtcyl7XG4gICAgICAgICAgICAkc2NvcGUubGlzdERhdGEgPSBhcHBFdmVudFNlcnZpY2Uuc2hvd0xpc3QocGFyYW1zKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCBwYXJhbXMsICd0ZXN0JywgJHNjb3BlLmxpc3REYXRhICk7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBsaW5rOiBsaW5rLFxuICAgICAgICBzY29wZToge1xuICAgICAgICAgICAgbGlzdERhdGE6ICc9J1xuICAgICAgICB9XG4gICAgfTtcbn1dKTsiLCJhbmd1bGFyLm1vZHVsZSgnRmlyZXNob3BwaW5nJylcbi5kaXJlY3RpdmUoJ2xpc3QnLFxuICAgIFtmdW5jdGlvbigpIHtcblxuICAgICd1c2Ugc3RyaWN0JztcbiAgICB2YXIgbGluayA9IGZ1bmN0aW9uKCRzY29wZSkge1xuICAgICAgICAgICAgJHNjb3BlLiR3YXRjaCgnbGlzdERhdGEnLCBmdW5jdGlvbih2YWwpe1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCB2YWwgKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgfTtcblxuICAgIHJldHVybiB7XG4gICAgICAgIGxpbms6IGxpbmssXG4gICAgICAgIHNjb3BlOiB7XG4gICAgICAgICAgICAnbGlzdERhdGEnOiAnPSdcbiAgICAgICAgfSxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdsaXN0L2xpc3QuaHRtbCdcbiAgICB9O1xufV0pOyIsImFuZ3VsYXIubW9kdWxlKCdGaXJlc2hvcHBpbmcnKVxuLmRpcmVjdGl2ZSgnbGlzdHMnLFxuICAgIFsnJGZpcmViYXNlQXJyYXknLCBmdW5jdGlvbigkZmlyZWJhc2VBcnJheSkge1xuXG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIHZhciBsaW5rID0gZnVuY3Rpb24oJHNjb3BlKSB7XG4gICAgICAgIHZhciBmaXJlQmFzZUNvbm5lY3Rpb24gPSBuZXcgRmlyZWJhc2UoJ2h0dHBzOi8vc2l6emxpbmctdG9yY2gtOTI1LmZpcmViYXNlaW8uY29tL3Nob3BwaW5nL2xpc3ROYW1lcycpO1xuXG4gICAgICAgICRzY29wZS5saXN0cyA9ICRmaXJlYmFzZUFycmF5KGZpcmVCYXNlQ29ubmVjdGlvbik7XG5cbiAgICAgICAgJHNjb3BlLmFkZExpc3QgPSBmdW5jdGlvbigpe1xuICAgICAgICAgICAgJHNjb3BlLmxpc3RzLiRhZGQoe1xuICAgICAgICAgICAgICAgIG5hbWU6ICRzY29wZS5uZXdOYW1lXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgIH07XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBsaW5rOiBsaW5rLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ2xpc3RzL2xpc3RzLmh0bWwnXG4gICAgfTtcbn1dKTsiLCIoZnVuY3Rpb24obW9kdWxlKSB7XG50cnkge1xuICBtb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnQ29tcGlsZWRUZW1wbGF0ZXMnKTtcbn0gY2F0Y2ggKGUpIHtcbiAgbW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ0NvbXBpbGVkVGVtcGxhdGVzJywgW10pO1xufVxubW9kdWxlLnJ1bihbJyR0ZW1wbGF0ZUNhY2hlJywgZnVuY3Rpb24oJHRlbXBsYXRlQ2FjaGUpIHtcbiAgJHRlbXBsYXRlQ2FjaGUucHV0KCdwcm9kdWN0cy9wcm9kdWN0cy5odG1sJyxcbiAgICAnPGgxPkxpc3RlbiB3dWh1aHU8L2gxPjxmb3JtIG5hbWU9XCJhZGRQcm9kdWN0VG9MaXN0XCIgbmctc3VibWl0PVwiYWRkTGlzdCgpXCI+PGlucHV0IHJlcXVpcmVkPVwiXCIgdHlwZT1cIm51bWJlclwiIG5nLW1vZGVsPVwibmV3UHJvZHVjdFwiIHBsYWNlaG9sZGVyPVwiQW56YWhsIGhpbnp1ZsO8Z2VuXCI+PGJ1dHRvbiB0eXBlPVwic3VibWl0XCI+SElOWlVGw5xHRU48L2J1dHRvbj48L2Zvcm0+PGZvcm0gbmFtZT1cImFkZFByb2R1Y3RcIiBuZy1zdWJtaXQ9XCJhZGRMaXN0KClcIj48aW5wdXQgcmVxdWlyZWQ9XCJcIiBuZy1tb2RlbD1cIm5ld1Byb2R1Y3RcIiBuZy1jaGFuZ2U9XCJmaWx0ZXJQcm9kdWN0cyhuZXdQcm9kdWN0KVwiIHBsYWNlaG9sZGVyPVwiUHJvZHVrdCBoaW56dWbDvGdlblwiIHR5cGU9XCJ0ZXh0XCI+IDxidXR0b24gdHlwZT1cInN1Ym1pdFwiPkhJTlpVRsOcR0VOPC9idXR0b24+PC9mb3JtPjx1bD48bGkgbmctcmVwZWF0PVwicHJvZHVjdCBpbiBmaWx0ZXJlZFByb2R1Y3RzXCI+e3twcm9kdWN0Lm5hbWV9fTwvbGk+PC91bD4nKTtcbn1dKTtcbn0pKCk7XG4iLCIoZnVuY3Rpb24obW9kdWxlKSB7XG50cnkge1xuICBtb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnQ29tcGlsZWRUZW1wbGF0ZXMnKTtcbn0gY2F0Y2ggKGUpIHtcbiAgbW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ0NvbXBpbGVkVGVtcGxhdGVzJywgW10pO1xufVxubW9kdWxlLnJ1bihbJyR0ZW1wbGF0ZUNhY2hlJywgZnVuY3Rpb24oJHRlbXBsYXRlQ2FjaGUpIHtcbiAgJHRlbXBsYXRlQ2FjaGUucHV0KCdwcm9kdWN0cy9wcm9kdWN0L3Byb2R1Y3QuaHRtbCcsXG4gICAgJzxoMT5MaXN0ZW4gd3VodWh1PC9oMT48Zm9ybSBuYW1lPVwiYWRkTGlzdFwiIG5nLXN1Ym1pdD1cImFkZExpc3QoKVwiPjxpbnB1dCByZXF1aXJlZD1cIlwiIG5nLW1vZGVsPVwibmV3TmFtZVwiIHBsYWNlaG9sZGVyPVwibGlzdGUgaGluenVmw7xnZW5cIiB0eXBlPVwidGV4dFwiPjxidXR0b24gdHlwZT1cInN1Ym1pdFwiPkhJTlpVRsOcR0VOPC9idXR0b24+PC9mb3JtPjx1bD48bGkgbmctcmVwZWF0PVwibGlzdCBpbiBsaXN0c1wiPnt7OjpsaXN0Lm5hbWV9fTwvbGk+PC91bD4nKTtcbn1dKTtcbn0pKCk7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
