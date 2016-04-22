"use strict";
var ProductView = (function () {
    function ProductView() {
        this.view = document.getElementById('products');
    }
    ProductView.prototype.render = function (products, list) {
        this.view.innerHTML = "\n        <div id=\"selectAmount\" class=\"hidden\">\n        \t<div class=\"container\">\n\t\t\t\t<input id=\"amountInput\" class=\"grow\"type=\"text\" placeholder=\"Anzahl\" />\n\t\t\t</div>\n        \t<div class=\"container\">\n        \t\t<a class=\"button grow\" href=\"#/\" id=\"addProductButton\">Produkt zur Liste</a>\n\t\t\t</div>\n        </div>\n    \t<div class=\"container\">\n\t\t\t<input class=\"grow\" id=\"searchInput\" value=\"\" placeholder=\"search\" type=\"text\">\n        </div>\n    \t<div class=\"container\">\n        \t<a class=\"grow button\" id=\"addButton\">+ Produkt</a>\n        </div>\n\n        <div id=\"productsList\"></div>\n        \n        <div class=\"container\">\n\t\t\t<a class=\"button grow\" href=\"#/lists/" + list + "\"> Fertig </a>\n\t\t</div>\n\t\t";
        this.updateList(products, list);
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
        var addProductButton = document.getElementById('addProductButton');
        var selectAmount = document.getElementById('selectAmount');
        var amountInput = document.getElementById('amountInput');
        selectAmount.classList.remove('hidden');
        selectAmount.addEventListener('keyup', function (event) { return _this.updateLinkText(addProductButton, params, event); });
        amountInput.focus();
    };
    ProductView.prototype.updateLinkText = function (elem, params, event) {
        var url;
        event.target.value = event.target.value;
        if (event.target.value) {
            url = "#/lists/" + params.list + "/addProductToList/" + params.product + "/" + event.target.value;
            elem.href = url;
            if (event.keyCode === 13) {
                window.location.hash = url;
            }
        }
    };
    return ProductView;
}());
module.exports = ProductView;
