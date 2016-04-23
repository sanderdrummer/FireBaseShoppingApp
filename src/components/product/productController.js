"use strict";
var ProductView = require('./productView');
var Product = require('./product');
var ProductViewController = (function () {
    function ProductViewController() {
        this.productView = new ProductView();
        this.filteredProducts = {};
        this.products = {};
        this.fireBase = new Firebase('https://sizzling-torch-925.firebaseio.com/shopping/products');
    }
    ProductViewController.prototype.init = function (params) {
        this.getProducts();
        this.list = params.list;
    };
    ProductViewController.prototype.updateHandlers = function () {
        var _this = this;
        this.addButton = document.getElementById('addButton');
        this.searchInput = document.getElementById('searchInput');
        this.addButton.addEventListener('click', function () { return _this.addProduct(); });
        this.searchInput.addEventListener('keyup', function (event) { return _this.addOnEnter(event); });
        this.searchInput.addEventListener('keyup', function (event) { return _this.filterProducts(event); });
    };
    ProductViewController.prototype.getProducts = function () {
        var _this = this;
        this.fireBase.on("value", function (snapshot) {
            if (snapshot.val()) {
                _this.updateProducts(snapshot.val());
            }
            _this.updateView();
            document.getElementById('searchInput').focus();
        }, function (errorObject) {
            console.log("The read failed: " + errorObject.code);
        });
    };
    ProductViewController.prototype.getProduct = function (name) {
        if (this.products[name]) {
            return this.products[name];
        }
    };
    ProductViewController.prototype.updateProducts = function (res) {
        var _this = this;
        var config;
        Object.keys(res).map(function (id) {
            config = res[id];
            _this.products[id] = new Product(config);
        });
    };
    ProductViewController.prototype.updateView = function () {
        this.productView.render(this.products, this.list);
        this.updateHandlers();
    };
    ProductViewController.prototype.filterProducts = function (event) {
        var _this = this;
        var name = this.searchInput.value;
        var product;
        this.filteredProducts = {};
        Object.keys(this.products).map(function (id) {
            product = _this.products[id];
            if (product.name.indexOf(name) > -1) {
                _this.filteredProducts[id] = product;
            }
        });
        this.productView.updateList(this.filteredProducts, this.list);
    };
    ProductViewController.prototype.addOnEnter = function (event) {
        if (event.keyCode == 13) {
            this.addProduct();
            return false;
        }
    };
    ProductViewController.prototype.addProduct = function () {
        var name = this.searchInput.value;
        var notInFilteredList = Object.keys(this.filteredProducts).length === 0;
        var product;
        if (name && notInFilteredList) {
            product = new Product({ name: name });
            product.update();
        }
        else {
            product = this.filteredProducts[Object.keys(this.filteredProducts)[0]];
        }
        this.searchInput.value = '';
        window.location.hash += '/' + product.name;
    };
    ProductViewController.prototype.selectProductAmount = function (param) {
        this.productView.showAmount(param);
    };
    ProductViewController.prototype.destroy = function (params) {
        var product = this.products[params.product];
        if (product) {
            product.destroy();
            window.location.hash = '#/';
        }
    };
    return ProductViewController;
}());
module.exports = ProductViewController;
