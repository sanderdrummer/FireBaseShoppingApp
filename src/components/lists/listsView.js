"use strict";
var ListsView = (function () {
    function ListsView() {
        this.view = document.getElementById('view');
        this.products = document.getElementById('products');
    }
    ListsView.prototype.update = function (lists) {
        var list;
        var listsTemplate;
        this.products.innerHTML = '';
        listsTemplate = Object.keys(lists).map(function (name) {
            list = lists[name];
            return "<li class=\"list\">\n\t\t\t\t<a class=\"list-item\" href=\"#/lists/" + list.name + "\">" + list.name + "</a>\n\t\t\t</li>";
        }).join('');
        var template = "\n\t\t<div class=\"container\">\n\t\t\t<input id=\"listInput\" class=\"grow m-r-1\" required value=\"\" placeholder=\"neueListe\" type=\"text\">\n        \t<button id=\"addListButton\">neue Liste hinzuf\u00FCgen</button>\n\t\t</div>\n        <div id=\"lists\">" + listsTemplate + "<div>\n\t\t";
        this.view.innerHTML = template;
    };
    return ListsView;
}());
module.exports = ListsView;
