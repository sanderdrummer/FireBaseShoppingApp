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