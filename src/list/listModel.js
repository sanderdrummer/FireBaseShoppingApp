angular.module('Fireshopping')
.factory('listModel', ['$firebaseObject', '$firebaseArray', '$state',
    function($firebaseObject, $firebaseArray, $state){
    'use strict';

    function List(name) {
        this.name = name;
        this.fireBaseConnection = new Firebase('https://sizzling-torch-925.firebaseio.com/shopping/list/' + name);
        this.items = $firebaseObject(this.fireBaseConnection);
    }

    List.prototype.getList = function() {
        this.items = $firebaseObject(this.fireBaseConnection);
    };

    List.prototype.clear = function() {
        this.items = {};
    };

    List.prototype.addProductToList = function(product, amount) {
        this.items.toAdd = this.items.toAdd || [];

        this.items.toAdd.push({
            product: product,
            amount: amount
        });

        this.items.$save();
    };

    List.prototype.addToBasket = function(item, index) {
        this.items.alreadyAdded = this.items.alreadyAdded || [];

        this.items.toAdd.splice(index, 1);

        this.items.alreadyAdded.push(item);
        this.items.$save();
    };

    List.prototype.removeFromBasket = function(item, index) {
        this.items.toAdd = this.items.toAdd || [];

        this.items.alreadyAdded.splice(index, 1);

        this.items.toAdd.push(item);
        this.items.$save();
    };

    List.prototype.clearSingle = function(index, type) {
        this.items[type].splice(index, 1);
        this.items.$save();
    };

    List.prototype.clearProducts = function() {
        this.items.toAdd = [];
        this.items.alreadyAdded = [];
        this.items.$save();
    };

    List.prototype.destroyList = function() {
        this.items.$remove().then(function(ref) {
           $state.go('home')
        });
    };

    return function(name) {
        return new List(name);
    };
}]);

