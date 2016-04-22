///<reference path="../../../definitions/firebase.d.ts" />
"use strict";
var Product = (function () {
    function Product(config) {
        this.name = config.name || '';
        this.amount = config.amount || 1;
        this.rating = config.rating || 0;
        this.fireBase = new Firebase('https://sizzling-torch-925.firebaseio.com/shopping/products/' + config.name);
    }
    Product.prototype.update = function () {
        this.fireBase.set(this.getData());
    };
    Product.prototype.getData = function () {
        return {
            name: this.name,
            amount: this.amount || 1,
            rating: this.rating || 0
        };
    };
    Product.prototype.remove = function () {
        this.fireBase.remove();
    };
    return Product;
}());
module.exports = Product;
