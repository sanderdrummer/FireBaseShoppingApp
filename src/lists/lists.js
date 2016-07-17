angular.module('Fireshopping')
.directive('lists',
    [function() {
    'use strict';
    return {
        controller: 'listsController',
        controllerAs: 'listsController',
        bindToController: true,
        templateUrl: 'lists/lists.html'
    };
}]);