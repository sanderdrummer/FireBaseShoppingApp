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

