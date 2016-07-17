angular.module('Fireshopping')
.directive('list',
    [function() {
    return {
        scope: true,
        controller: 'listController',
        controllerAs: 'listController',
        bindToController: true,
        templateUrl: 'list/list.html'
    };
}]);