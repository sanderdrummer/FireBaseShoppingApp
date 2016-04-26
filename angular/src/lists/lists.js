angular.module('Fireshopping')
.directive('lists',
    [function() {

    'use strict';
    var link = function(scope, elem) {
        console.log( 'this' );
    };

    return {
        link: link,
        templateUrl: 'lists/lists.html'
    };
}]);