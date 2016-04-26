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