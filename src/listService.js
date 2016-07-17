angular.module('Fireshopping')
.factory('listService', ['$firebaseObject', '$firebaseArray', '$stateParams', function($firebaseObject, $firebaseArray, $stateParams){
    'use strict';

    var listService = {};
    var listWatcher = [];
    var index;
    listService.list = {};

    listService.setList = function(list){
        if (list) {
            var fireBaseConnection = new Firebase('https://sizzling-torch-925.firebaseio.com/shopping/list/' + list);
            listService.list = $firebaseObject(fireBaseConnection);
            return listService.list;
        }

    };

    listService.addProductToList = function(product, amount) {
        listService.list.toAdd = listService.list.toAdd || [];

        listService.list.toAdd.push({
            product: product,
            amount: amount
        });

        listService.list.$save();
    };

    return listService;
}]);

