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
		console.log(params);
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
		console.log(res);
		this.list = new List(res);
	}

	addProductToList(params) {
		var product = this.productController.getProduct(params.product);
		console.log('addProductToList', params, product);
		this.list.toAdd[product.name] = product.name;
		this.list.update();
		this.listView.render(this.list);
	}
}

export = ListController;