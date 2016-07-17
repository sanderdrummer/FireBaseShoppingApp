angular.module('Fireshopping')
.controller('listController', ['$state', '$stateParams', 'listModel', 'listService',
    function($state, $stateParams, listModel, listService) {
    'use strict';

    var ctrl = this;

    ctrl.showListDetails = false;

    ctrl.list = listModel($stateParams.list);
    
    ctrl.toggleProducts = function() {
        listService.setList(ctrl.list.name);
        $state.go('produces', {
            list: ctrl.list.name
        });
    };

    ctrl.home = function() {
        $state.go('lists');
    };
}]);