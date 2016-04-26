angular.module('Fireshopping', [
    'CompiledTemplates',
    'firebase']);
angular.module('Fireshopping')
.directive('lists',
    ['$firebaseArray', function($firebaseArray) {

    'use strict';
    var link = function($scope) {
        var fireBaseConnection = new Firebase('https://sizzling-torch-925.firebaseio.com/shopping/listNames');

        $scope.lists = $firebaseArray(fireBaseConnection);

        $scope.addList = function(){
            $scope.lists.$add({
                name: $scope.newName
            });
        };

    };

    return {
        link: link,
        templateUrl: 'lists/lists.html'
    };
}]);
(function(module) {
try {
  module = angular.module('CompiledTemplates');
} catch (e) {
  module = angular.module('CompiledTemplates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('lists/lists.html',
    '<h1>Listen wuhuhu</h1><form name="addList" ng-submit="addList()"><input required="" ng-model="newName" placeholder="liste hinzufügen" type="text"><button type="submit">HINZUFÜGEN</button></form><ul><li ng-repeat="list in lists">{{::list.name}}</li></ul>');
}]);
})();

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImxpc3RzL2xpc3RzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQ0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUF0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImFuZ3VsYXIubW9kdWxlKCdGaXJlc2hvcHBpbmcnLCBbXG4gICAgJ0NvbXBpbGVkVGVtcGxhdGVzJyxcbiAgICAnZmlyZWJhc2UnXSk7IiwiKGZ1bmN0aW9uKG1vZHVsZSkge1xudHJ5IHtcbiAgbW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ0NvbXBpbGVkVGVtcGxhdGVzJyk7XG59IGNhdGNoIChlKSB7XG4gIG1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCdDb21waWxlZFRlbXBsYXRlcycsIFtdKTtcbn1cbm1vZHVsZS5ydW4oWyckdGVtcGxhdGVDYWNoZScsIGZ1bmN0aW9uKCR0ZW1wbGF0ZUNhY2hlKSB7XG4gICR0ZW1wbGF0ZUNhY2hlLnB1dCgnbGlzdHMvbGlzdHMuaHRtbCcsXG4gICAgJzxoMT5MaXN0ZW4gd3VodWh1PC9oMT48Zm9ybSBuYW1lPVwiYWRkTGlzdFwiIG5nLXN1Ym1pdD1cImFkZExpc3QoKVwiPjxpbnB1dCByZXF1aXJlZD1cIlwiIG5nLW1vZGVsPVwibmV3TmFtZVwiIHBsYWNlaG9sZGVyPVwibGlzdGUgaGluenVmw7xnZW5cIiB0eXBlPVwidGV4dFwiPjxidXR0b24gdHlwZT1cInN1Ym1pdFwiPkhJTlpVRsOcR0VOPC9idXR0b24+PC9mb3JtPjx1bD48bGkgbmctcmVwZWF0PVwibGlzdCBpbiBsaXN0c1wiPnt7OjpsaXN0Lm5hbWV9fTwvbGk+PC91bD4nKTtcbn1dKTtcbn0pKCk7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
