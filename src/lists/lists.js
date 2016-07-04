angular.module('Fireshopping')
.directive('lists',
    ['$firebaseArray', 'listService', function($firebaseArray, listService) {

    'use strict';
    var link = function($scope) {
        var fireBaseConnection = new Firebase('https://sizzling-torch-925.firebaseio.com/shopping/listNames');

        $scope.loading = true;
        $scope.lists = $firebaseArray(fireBaseConnection);
        $scope.lists.$loaded(function(data){
            $scope.loading = false;
        });

        $scope.addList = function(){
            $scope.lists.$add({
                name: $scope.newName,
                toAdd: [],
                alreadyAdded: []
            });
            $scope.newName = '';
        };

        function newListResolved(ref) {
            $scope.showAddList = false;
        }
    };

    return {
        link: link,
        templateUrl: 'lists/lists.html'
    };
}]);