angular.module('Fireshopping')
.directive('lists',
    ['$firebaseArray', function($firebaseArray) {

    'use strict';
    var link = function($scope) {
        var fireBaseConnection = new Firebase('https://sizzling-torch-925.firebaseio.com/shopping/listNames');

        $scope.lists = $firebaseArray(fireBaseConnection);

        $scope.addList = function(){
            $scope.lists.$add({
                name: $scope.newName,
                toAdd: [],
                alreadyAdded: []
            });
        };

    };

    return {
        link: link,
        templateUrl: 'lists/lists.html'
    };
}]);