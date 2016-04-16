
import Product = require('./product');
import ProductView = require('./productView');

class ProductManager {
	products: {};
	productView: ProductView;
	fireBase: any;
	constructor() {
		this.products = {};
		this.productView = new ProductView('');
		this.fireBase = new Firebase('https://sizzling-torch-925.firebaseio.com/shopping/products');

		this.fireBase.on('child_added', 
			(childSnapshot, prevChildKey) => this.getProducts());
	}

	getProducts() {
		this.fireBase.on("value", (snapshot) => {
			this.updateProducts(snapshot.val());
			this.updateView();
		}, function(errorObject) {
			console.log("The read failed: " + errorObject.code);
		});
	}

	addProduct(config:any) {

		var product = new Product('', config);
		console.log(product, '654645654');
		this.fireBase.push(product, () => {
			this.getProducts();	
		});
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
