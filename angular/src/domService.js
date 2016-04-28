angular.module('Fireshopping')
.factory('domService', ['$timeout', '$window', function($timeout, $window){
    'use strict';

    var domService = {};


    domService.focus = function(id){
        $timeout(function() {
            var element = $window.document.getElementById(id);

            if (element) {
              element.focus();
            }
        });
    };

    return domService;
}]);

