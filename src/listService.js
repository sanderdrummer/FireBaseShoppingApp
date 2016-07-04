angular.module('Fireshopping')
.factory('listService', ['$firebaseObject', '$firebaseArray', '$stateParams', function($firebaseObject, $firebaseArray, $stateParams){
    'use strict';

    var listService = {};
    var listWatcher = [];
    var index;
    listService.list = {};
    
    listService.setList = function(list){
        listService.list = list;
    };

    listService.getList = function(list){
        if (list) {
            var fireBaseConnection = new Firebase('https://sizzling-torch-925.firebaseio.com/shopping/list/' + list);
            listService.list = $firebaseObject(fireBaseConnection);
            return listService.list;
        }

    };

    listService.clear = function() {
        listService.list = {};
    };

    listService.register = function(cb) {
        listWatcher.push(cb);
    };

    listService.addProductToList = function(product, amount) {
        listService.list.toAdd = listService.list.toAdd || [];

        listService.list.toAdd.push({
            product: product,
            amount: amount
        });

        listService.list.$save();
    };

    listService.addToBasket = function(item, index) {
        listService.list.alreadyAdded = listService.list.alreadyAdded || [];

        listService.list.toAdd.splice(index, 1);

        listService.list.alreadyAdded.push(item);
        listService.list.$save();

    };
    listService.removeFromBasket = function(item, index) {
        listService.list.toAdd = listService.list.toAdd || [];

        listService.list.alreadyAdded.splice(index, 1);

        listService.list.toAdd.push(item);
        listService.list.$save();
    };

    listService.clearItems = function() {
        listService.list.toAdd = [];
        listService.list.alreadyAdded = [];
        listService.list.$save();
    };
    listService.destroyList = function() {
        listService.list.$remove().then(function(ref) {
            window.location.hash = '#/';
        });
    };

    return listService;
}]);

