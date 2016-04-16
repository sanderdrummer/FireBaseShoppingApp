
import Product = require('./product');
import ProductView = require('./productView');

class ProductManager {
	products: {};
	productView: ProductView;
	fireBase: any;
	constructor() {
		this.products = {};
		this.productView = new ProductView('');
		this.fireBase = new Firebase('https://sizzling-torch-925.firebaseio.com/shopping/products')
	}

	getProducts() {
		this.fireBase.on("value", (snapshot) => {
			this.updateProducts(snapshot.val());
			this.updateView();
		}, function(errorObject) {
			console.log("The read failed: " + errorObject.code);
		});
	}

	addProduct(product:Product) {
		this.fireBase.push(product);
	}

	removeProduct(id) {
		if (this.products[id]) {
			this.products[id].remove();
		}
	}

	updateProducts(res) {
		var config;

		Object.keys(res).map((id) => {
			config = res[id];
			this.products[id] = new Product(id, config);
		});
	}

	updateView() {
		this.productView.render(this.products);
	}
}

export = ProductManager;
