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