angular.module('Fireshopping', [
    'CompiledTemplates',
    'firebase',
    'ionic',
    'ui.router'
])
.config([
    '$compileProvider',
    '$httpProvider',
    function($compileProvider, $httpProvider) {
        $compileProvider.debugInfoEnabled(false);
        $httpProvider.useApplyAsync(true);
    }
]);