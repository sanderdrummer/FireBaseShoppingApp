angular.module('Fireshopping')
    .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('lists', {
            url: '/home',
            template: '<lists></lists>'
        })
        .state('list', {
            url: '/list/:list',
            template: '<list></list>'
        })
        .state('produces', {
            url: '/list/:list/products',
            template: '<products></products>'
        });
        $urlRouterProvider.otherwise('/home');
}]);