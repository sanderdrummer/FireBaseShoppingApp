/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	__webpack_require__(10);
	var ProductViewController = __webpack_require__(14);
	var ListsController = __webpack_require__(17);
	var ListController = __webpack_require__(19);
	var Router = __webpack_require__(22);
	// bootstrap the app
	var router = new Router();
	var productController = new ProductViewController();
	var listsController = new ListsController();
	var listController = new ListController();
	listController.setProductController(productController);
	// set routes
	if (!window.location.hash) {
	    window.location.hash = '#/';
	}
	router.register('/', function (params) {
	    listsController.init();
	})
	    .register('/lists/:list', function (params) {
	    console.log(params);
	    listController.show(params);
	}).register('/lists/:list/destroy', function (params) {
	    listController.destroy(params);
	}).register('/lists/:list/reset', function (params) {
	    listController.reset(params);
	}).register('/lists/:list/addProducts', function (params) {
	    productController.init(params);
	}).register('/lists/:list/addProductToBasket/:product', function (params) {
	    listController.addProductToBasket(params);
	}).register('/lists/:list/revertProductFromBasket/:product', function (params) {
	    listController.revertProductFromBasket(params);
	}).register('/lists/:list/addProducts/:product', function (params) {
	    productController.selectProductAmount(params);
	}).register('/lists/:list/addProductToList/:product/:amount', function (params) {
	    listController.addProductToList(params);
	}).register('/products/destroy/:product', function (params) {
	    productController.destroy(params);
	});


/***/ },
/* 1 */,
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */,
/* 6 */,
/* 7 */,
/* 8 */,
/* 9 */,
/* 10 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 11 */,
/* 12 */,
/* 13 */,
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var ProductView = __webpack_require__(15);
	var Product = __webpack_require__(16);
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


/***/ },
/* 15 */
/***/ function(module, exports) {

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
	            return "<li class=\"product container\">\n\t\t\t\t<a class=\"buttonSmall grow\" href=\"#/lists/" + list + "/addProducts/" + product.name + "\">\n\t\t\t\t\t" + product.name + "\n\t\t\t\t</a>\n\t\t\t\t<a class=\"buttonSmall\" href=\"#/products/destroy/" + product.name + "\">l\u00F6schen</a>\n\t\t\t</li>";
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


/***/ },
/* 16 */
/***/ function(module, exports) {

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
	    Product.prototype.destroy = function () {
	        this.fireBase.remove();
	    };
	    return Product;
	}());
	module.exports = Product;


/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	///<reference path="../../../definitions/firebase.d.ts" />
	"use strict";
	var ListsView = __webpack_require__(18);
	var ListController = __webpack_require__(19);
	var List = __webpack_require__(20);
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


/***/ },
/* 18 */
/***/ function(module, exports) {

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


/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	///<reference path="../../../definitions/firebase.d.ts" />
	"use strict";
	var List = __webpack_require__(20);
	var ListView = __webpack_require__(21);
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


/***/ },
/* 20 */
/***/ function(module, exports) {

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


/***/ },
/* 21 */
/***/ function(module, exports) {

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
	            return "\n\t\t\t\t<li class=\"product container\"><a class=\"buttonSmall grow\" href=\"" + url + "\">" + product + " - <input type=\"text\" value=\"" + selected.amount + "\"/></a></li>\n\t\t\t";
	        }).join('');
	        listElement.innerHTML = template;
	    };
	    return ListView;
	}());
	module.exports = ListView;


/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var Route = __webpack_require__(23);
	var Param = __webpack_require__(24);
	var Router = (function () {
	    function Router() {
	        var _this = this;
	        this.routes = [];
	        this.findParam = new RegExp(':[a-zA-Z]*');
	        // Adds global eventlistener for routing on hashchange
	        window.addEventListener('hashchange', function () {
	            _this.handleHashChange();
	        });
	        // Special case load handle Hashchange on startup
	        document.addEventListener("DOMContentLoaded", function () {
	            _this.handleHashChange();
	        });
	    }
	    /**
	     * Parse hash and url and check for matching
	     *
	     * @param  {string}   hash
	     * @param  {Route}   route
	     *
	     * @return {void}
	     */
	    Router.prototype.parseRouteUrl = function (hash, route) {
	        var result = this.getMatchAndParamsOf(hash, route.url);
	        if (result.doesMatch) {
	            route.callback(new Param(result.params));
	        }
	    };
	    /**
	     * Checks if route matches hash
	     * and parses params from hash
	     *
	     * @param  {string}   hash
	     * @param  {string}   url
	     * @return {Object}
	     */
	    Router.prototype.getMatchAndParamsOf = function (hash, url) {
	        var _this = this;
	        var urlParts = url.split('/');
	        var hashParts = hash.split('/');
	        var doesMatch = false;
	        var params = {};
	        var allMatches = [];
	        var key;
	        // do both hash and url have the same size ?
	        // -> could match  
	        if (urlParts.length === hashParts.length) {
	            // check all parts of given hash for matching if 
	            // a part is indentified to be a param it is ignored 
	            // for matching but saved into params Object
	            hashParts.map(function (item, index) {
	                if (item === urlParts[index]) {
	                    allMatches.push(true);
	                }
	                else if (_this.findParam.test(urlParts[index])) {
	                    // replace : indicator of param key
	                    key = urlParts[index].replace(':', '');
	                    params[key] = item;
	                }
	                else {
	                    allMatches.push(false);
	                }
	            });
	            // reduce all matchings to one boolean
	            doesMatch = allMatches.reduce(function (a, b) {
	                return a && b;
	            });
	        }
	        // return doesMatch flag and parsed params
	        return {
	            params: params,
	            doesMatch: doesMatch
	        };
	    };
	    /**
	     */
	    Router.prototype.handleHashChange = function () {
	        var _this = this;
	        var hash = window.location.hash.replace('#', '');
	        this.routes.forEach(function (route) {
	            _this.parseRouteUrl(hash, route);
	        });
	    };
	    Router.prototype.register = function (url, callback) {
	        this.routes.push(new Route(url, callback));
	        return this;
	    };
	    return Router;
	}());
	module.exports = Router;


/***/ },
/* 23 */
/***/ function(module, exports) {

	"use strict";
	var Route = (function () {
	    function Route(url, callback) {
	        this.url = url;
	        this.callback = callback;
	    }
	    return Route;
	}());
	module.exports = Route;


/***/ },
/* 24 */
/***/ function(module, exports) {

	"use strict";
	var Param = (function () {
	    function Param(config) {
	        this.id = config.id || 0;
	        this.amount = config.amount || 0;
	        this.list = config.list || '';
	        this.product = config.product || '';
	    }
	    return Param;
	}());
	module.exports = Param;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map