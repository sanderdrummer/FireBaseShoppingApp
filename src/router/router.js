"use strict";
var Route = require('./route');
var Param = require('./param');
var Router = (function () {
    function Router() {
        var _this = this;
        this.routes = [];
        this.findParam = new RegExp(':[a-zA-Z]*');
        // Adds global eventlistener for routing on hashchange
        window.addEventListener('hashchange', function () {
            _this.handleHashChange();
        });
        // Special case load handle Hashchange on startup
        document.addEventListener("DOMContentLoaded", function () {
            _this.handleHashChange();
        });
    }
    /**
     * Parse hash and url and check for matching
     *
     * @param  {string}   hash
     * @param  {Route}   route
     *
     * @return {void}
     */
    Router.prototype.parseRouteUrl = function (hash, route) {
        var result = this.getMatchAndParamsOf(hash, route.url);
        if (result.doesMatch) {
            route.callback(new Param(result.params));
        }
    };
    /**
     * Checks if route matches hash
     * and parses params from hash
     *
     * @param  {string}   hash
     * @param  {string}   url
     * @return {Object}
     */
    Router.prototype.getMatchAndParamsOf = function (hash, url) {
        var _this = this;
        var urlParts = url.split('/');
        var hashParts = hash.split('/');
        var doesMatch = false;
        var params = {};
        var allMatches = [];
        var key;
        // do both hash and url have the same size ?
        // -> could match  
        if (urlParts.length === hashParts.length) {
            // check all parts of given hash for matching if 
            // a part is indentified to be a param it is ignored 
            // for matching but saved into params Object
            hashParts.map(function (item, index) {
                if (item === urlParts[index]) {
                    allMatches.push(true);
                }
                else if (_this.findParam.test(urlParts[index])) {
                    // replace : indicator of param key
                    key = urlParts[index].replace(':', '');
                    params[key] = item;
                }
                else {
                    allMatches.push(false);
                }
            });
            // reduce all matchings to one boolean
            doesMatch = allMatches.reduce(function (a, b) {
                return a && b;
            });
        }
        // return doesMatch flag and parsed params
        return {
            params: params,
            doesMatch: doesMatch
        };
    };
    /**
     */
    Router.prototype.handleHashChange = function () {
        var _this = this;
        var hash = window.location.hash.replace('#', '');
        this.routes.forEach(function (route) {
            _this.parseRouteUrl(hash, route);
        });
    };
    Router.prototype.register = function (url, callback) {
        this.routes.push(new Route(url, callback));
        return this;
    };
    return Router;
}());
module.exports = Router;
