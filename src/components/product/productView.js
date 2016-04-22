"use strict";
var ProductView = (function () {
    function ProductView() {
        this.view = document.getElementById('products');
    }
    ProductView.prototype.render = function (products, list) {
        this.updateList(products, list);
        this.view.innerHTML = "\n        <div id=\"selectAmount\" class=\"hidden\">\n        \t<div class=\"container\">\n\t\t\t\t<input class=\"grow\"type=\"text\" placeholder=\"Anzahl\" />\n\t\t\t</div>\n        \t<div class=\"container\">\n        \t\t<a class=\"button grow\" href=\"#/\" id=\"addProductButton\">Produkt zur Liste</a>\n\t\t\t</div>\n        </div>\n\t\t<input id=\"searchInput\" value=\"\" placeholder=\"search\" type=\"text\">\n        <button id=\"addButton\">+ Produkt</button>\n        <div id=\"productsList\"></div>\n        <div class=\"container\">\n\t\t\t<a class=\"button grow\" href=\"#/lists/" + list + "\"> Fertig </a>\n\t\t</div>\n\t\t";
    };
    ProductView.prototype.updateList = function (products, list) {
        var product;
        var productsElement = document.getElementById('productsList');
        var template = Object.keys(products).map(function (id) {
            product = products[id];
            return "<li class=\"product\">\n\t\t\t\t<a href=\"#/lists/" + list + "/addProducts/" + product.name + "\">\n\t\t\t\t\t" + product.name + "\n\t\t\t\t</a>\n\t\t\t</li>";
        }).join('');
        productsElement.innerHTML = template;
    };
    ProductView.prototype.showAmount = function (params) {
        var _this = this;
        var selectAmount = document.getElementById('selectAmount');
        var addProductButton = document.getElementById('addProductButton');
        selectAmount.classList.remove('hidden');
        selectAmount.addEventListener('keyup', function (event) { return _this.updateLinkText(addProductButton, params, event); });
    };
    ProductView.prototype.updateLinkText = function (elem, params, event) {
        event.target.value = event.target.value || 1;
        elem.href = "#/lists/" + params.list + "/addProductToList/" + params.product + "/" + event.target.value;
    };
    return ProductView;
}());
module.exports = ProductView;
