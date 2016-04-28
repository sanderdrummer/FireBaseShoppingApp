angular.module('Fireshopping')
.factory('listService', ['$firebaseObject', function($firebaseObject){
    'use strict';

    var listService = {};
    var listWatcher = [];

    listService.list = {};

    listService.setList = function(params){
        if (params.list) {
            var fireBaseConnection = new Firebase('https://sizzling-torch-925.firebaseio.com/shopping/list/' + params.list);
            listService.list = $firebaseObject(fireBaseConnection);
            update();
        }
    };

    listService.clear = function() {
        this.list = {};
        update();
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

    function update(){
        listWatcher.forEach(function(cb){
            cb(listService.list);
        });
    }

    return listService;
}]);

