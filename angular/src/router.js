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