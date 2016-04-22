///<reference path="../../../definitions/firebase.d.ts" />
"use strict";
var List = (function () {
    function List(config) {
        this.toAdd = config.toAdd || {};
        this.alreadyAdded = config.alreadyAdded || {};
        this.name = config.name.trim();
        this.onLoad = config.onLoad || function () { };
        this.fireBase = new Firebase('https://sizzling-torch-925.firebaseio.com/shopping/lists/' + config.name.trim());
    }
    List.prototype.update = function () {
        this.fireBase.set({
            toAdd: this.toAdd,
            alreadyAdded: this.alreadyAdded,
            name: this.name
        });
    };
    return List;
}());
module.exports = List;
