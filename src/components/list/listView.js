"use strict";
var ListView = (function () {
    function ListView() {
        this.view = document.getElementById('view');
        this.products = document.getElementById('products');
    }
    ListView.prototype.render = function (list) {
        this.products.innerHTML = '';
        this.template = "\n\t\t<h1>" + list.name + "</h1>\n\t\t<div class=\"container\">\n\t\t\t<a class=\"button grow\" href=\"#/lists/" + list.name + "/addProducts\">+ Produkt</a>\n\t\t</div>\n\t\t<h2>noch in den Korb</h2>\n\t\t<div id=\"toAdd\"></div>\n\t\t<h2>schon dabei</h2>\n\t\t<div id=\"alreadyAdded\"></div>\n\t\t<div class=\"container\">\n\t\t\t<a class=\"button grow\" href=\"#/lists/" + list.name + "/reset\">Leeren</a>\n\t\t</div>\n\t\t<div class=\"container\">\n\t\t\t<a class=\"button grow\" href=\"#/lists/" + list.name + "/destroy\">l\u00F6schen</a>\n\t\t</div>\n\t\t<a \n\t\t<a class=\"list-item\" \n\t\t";
        this.view.innerHTML = this.template;
        this.updateList(list, 'toAdd');
        this.updateList(list, 'alreadyAdded');
    };
    ListView.prototype.updateList = function (list, type) {
        var listElement = document.getElementById(type);
        var template;
        var url;
        template = Object.keys(list[type]).map(function (product) {
            var selected = list[type][product];
            console.log(selected);
            url = type === 'toAdd' ? "#/lists/" + list.name + "/addProductToBasket/" + product : "#/lists/" + list.name + "/revertProductFromBasket/" + product;
            return "\n\t\t\t\t<li class=\"product\"><a href=\"" + url + "\">" + product + "</a><input type=\"text\" value=\"" + selected.amount + "\"></li>\n\t\t\t";
        }).join('');
        listElement.innerHTML = template;
    };
    return ListView;
}());
module.exports = ListView;
