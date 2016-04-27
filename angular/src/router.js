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