///<reference path="../../../definitions/firebase.d.ts" />
"use strict";
var List = require('./list');
var ListView = require('./listView');
var ListController = (function () {
    function ListController() {
        this.listView = new ListView();
    }
    ListController.prototype.setProductController = function (productController) {
        this.productController = productController;
    };
    ListController.prototype.addAndShowNewList = function (name) {
        var list = new List({ name: name });
        list.update();
    };
    ListController.prototype.show = function (params) {
        var _this = this;
        this.fireBase = new Firebase('https://sizzling-torch-925.firebaseio.com/shopping/lists/' + params.list);
        this.fireBase.on("value", function (snapshot) {
            if (snapshot.val()) {
                _this.updateList(snapshot.val());
                _this.listView.render(_this.list);
            }
        }, function (errorObject) {
            console.log("The read failed: " + errorObject.code);
        });
    };
    ListController.prototype.updateList = function (res) {
        this.list = new List(res);
    };
    ListController.prototype.addProductToList = function (params) {
        var product = this.productController.getProduct(params.product);
        product.amount = params.amount;
        product.rating += 1;
        this.list.toAdd[product.name] = product.getData();
        this.list.update();
        this.listView.render(this.list);
        this.productController.updateView();
        console.log(window.location.hash);
        window.location.hash = "#/lists/" + params.list + "/addProductToList";
    };
    ListController.prototype.addProductToBasket = function (params) {
        this.list.alreadyAdded[params.product] = this.list.toAdd[params.product];
        this.list.toAdd[params.product] = {};
        this.list.update();
        this.listView.render(this.list);
    };
    ListController.prototype.revertProductFromBasket = function (params) {
        this.list.toAdd[params.product] = this.list.alreadyAdded[params.product];
        this.list.alreadyAdded[params.product] = {};
        this.list.update();
        this.listView.render(this.list);
    };
    ListController.prototype.reset = function (params) {
        this.list.toAdd = {};
        this.list.alreadyAdded = {};
        this.list.update();
        this.listView.render(this.list);
    };
    ListController.prototype.destroy = function (params) {
        this.list.fireBase.remove();
        window.location.hash = '#/';
        delete this.list;
        delete this;
    };
    return ListController;
}());
module.exports = ListController;
