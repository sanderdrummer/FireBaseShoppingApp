"use strict";
var Route = (function () {
    function Route(url, callback) {
        this.url = url;
        this.callback = callback;
    }
    return Route;
}());
module.exports = Route;
