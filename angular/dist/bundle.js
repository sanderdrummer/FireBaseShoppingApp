angular.module('Fireshopping', [
    'CompiledTemplates',
    'firebase']);
(function(module) {
try {
  module = angular.module('CompiledTemplates');
} catch (e) {
  module = angular.module('CompiledTemplates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('lists/lists.html',
    '<h1>Listen wuhuhu</h1><ul><li></li></ul>');
}]);
})();

angular.module('Fireshopping')
.directive('lists',
    [function() {

    'use strict';
    var link = function(scope, elem) {
        console.log( 'this' );
    };

    return {
        link: link,
        templateUrl: 'lists/lists.html'
    };
}]);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImxpc3RzL2xpc3RzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQ0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQVhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiYW5ndWxhci5tb2R1bGUoJ0ZpcmVzaG9wcGluZycsIFtcbiAgICAnQ29tcGlsZWRUZW1wbGF0ZXMnLFxuICAgICdmaXJlYmFzZSddKTsiLCJhbmd1bGFyLm1vZHVsZSgnRmlyZXNob3BwaW5nJylcbi5kaXJlY3RpdmUoJ2xpc3RzJyxcbiAgICBbZnVuY3Rpb24oKSB7XG5cbiAgICAndXNlIHN0cmljdCc7XG4gICAgdmFyIGxpbmsgPSBmdW5jdGlvbihzY29wZSwgZWxlbSkge1xuICAgICAgICBjb25zb2xlLmxvZyggJ3RoaXMnICk7XG4gICAgfTtcblxuICAgIHJldHVybiB7XG4gICAgICAgIGxpbms6IGxpbmssXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnbGlzdHMvbGlzdHMuaHRtbCdcbiAgICB9O1xufV0pOyJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
