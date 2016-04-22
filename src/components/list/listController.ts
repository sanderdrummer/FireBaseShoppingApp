///<reference path="../../../definitions/firebase.d.ts" />

import List = require('./list');
import ListView = require('./listView');
import ProductController = require('../product/productController');

class ListController {
	list: List;
	listView: ListView;
	productController: ProductController;
	fireBase: any;

	constructor() {
		this.listView = new ListView();
	}

	setProductController(productController:ProductController) {
		this.productController = productController
	}

	addAndShowNewList(name){
		var list = new List({ name:name });
		list.update();
	}

	show(params) {
		this.fireBase = new Firebase('https://sizzling-torch-925.firebaseio.com/shopping/lists/' + params.list);
		this.fireBase.on("value", (snapshot) => {
			if (snapshot.val()) {
				this.updateList(snapshot.val());
				this.listView.render(this.list);
			}
		}, function(errorObject) {
			console.log("The read failed: " + errorObject.code);
		});
	}

	updateList(res) {
		this.list = new List(res);
	}

	addProductToList(params) {
		var product = this.productController.getProduct(params.product);
		product.amount = params.amount;
		product.rating += 1;
		product.update();
		this.list.toAdd[product.name] = product.getData();
		this.list.update();
		this.listView.render(this.list);
		this.productController.updateView();
	}

	addProductToBasket(params) {
		this.list.alreadyAdded[params.product] = this.list.toAdd[params.product]; 
		this.list.toAdd[params.product] = {};
		this.list.update();
		this.listView.render(this.list);
	}

	revertProductFromBasket(params) {
		this.list.toAdd[params.product] = this.list.alreadyAdded[params.product];
		this.list.alreadyAdded[params.product] = {};
		this.list.update();
		this.listView.render(this.list);
	}

	reset(params) {
		this.list.toAdd = {};
		this.list.alreadyAdded = {};
		this.list.update();
		this.listView.render(this.list);

	}

	destroy(params) {
		this.list.fireBase.remove();
		window.location.hash = '#/';
		delete this.list;
		delete this;
	}
}

export = ListController;