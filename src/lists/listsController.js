angular.module('Fireshopping')
.controller('listsController', ['$firebaseArray', '$state', function($firebaseArray, $state) {
    'use strict';
    var fireBaseConnection = new Firebase('https://sizzling-torch-925.firebaseio.com/shopping/listNames');
    var ctrl = this;

    ctrl.loading = true;
    ctrl.lists = $firebaseArray(fireBaseConnection);
    ctrl.lists.$loaded(function(data){
        ctrl.loading = false;
    });

    ctrl.addList = function(){
        ctrl.lists.$add({
            name: ctrl.newName,
            toAdd: [],
            alreadyAdded: []
        });
        ctrl.newName = '';
    };

    ctrl.gotoList = function(list) {
        $state.go('list', {
            list: list
        });
    };

    function newListResolved(ref) {
        ctrl.showAddList = false;
    }
}]);