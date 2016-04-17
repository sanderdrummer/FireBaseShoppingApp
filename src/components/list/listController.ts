import List = require('./list');
import ListView = require('./listView');
import ProductController = require('../product/productController');

class ListController {
	list: List;
	listView: ListView;
	productController: ProductController;

	constructor() {
		this.listView = new ListView();
	}

	setProductController(productController:ProductController) {
		this.productController = productController
	}

	addAndShowNewList(name){
		var list = new List(name);
		list.update();
	}

	show(params) {
		console.log(params);
		this.list = new List(params.list);
		this.list.update();
		this.listView.render(this.list);

	}

	addProductToList(params) {

	}
}

export = ListController;