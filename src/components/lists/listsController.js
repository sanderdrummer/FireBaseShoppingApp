///<reference path="../../../definitions/firebase.d.ts" />
"use strict";
var ListsView = require('./listsView');
var ListController = require('../list/listController');
var List = require('../list/list');
var ListsController = (function () {
    function ListsController() {
        this.lists = {};
        this.listsView = new ListsView();
        this.listController = new ListController();
        this.fireBase = new Firebase('https://sizzling-torch-925.firebaseio.com/shopping/lists');
    }
    ListsController.prototype.init = function () {
        this.getLists();
    };
    ListsController.prototype.getLists = function () {
        var _this = this;
        if (this.fireBase) {
            this.fireBase.on("value", function (snapshot) {
                if (snapshot) {
                    _this.updateLists(snapshot.val());
                }
            }, function (errorObject) {
                console.log("The read failed: " + errorObject.code);
            });
        }
    };
    ListsController.prototype.updateLists = function (res) {
        var _this = this;
        var config;
        if (res) {
            Object.keys(res).map(function (name) {
                config = res[name];
                _this.lists[name] = new List(config);
            });
        }
        this.listsView.update(this.lists);
        this.updateHandlers();
    };
    ListsController.prototype.updateHandlers = function () {
        var _this = this;
        var listInput = document.getElementById('listInput');
        var addListButton = document.getElementById('addListButton');
        addListButton.addEventListener('click', function () { return _this.addList(listInput); });
        listInput.addEventListener('keyup', function (event) { return _this.addOnEnter(event, listInput); });
    };
    ListsController.prototype.addOnEnter = function (event, listInput) {
        if (event.keyCode == 13) {
            this.addList(listInput);
            return false;
        }
    };
    ListsController.prototype.addList = function (listInput) {
        var value = listInput.value;
        if (value) {
            this.listController.addAndShowNewList(value);
            listInput.value = '';
        }
    };
    return ListsController;
}());
module.exports = ListsController;
