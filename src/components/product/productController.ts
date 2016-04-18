import ProductView = require('./productView');
import Product = require('./product');

class ProductViewController {
	searchInput: HTMLInputElement;
	addButton: Element;
	productView: ProductView;
	filteredProducts: {};
	products: {};
	fireBase: any;
	list: string;

	constructor() {
		this.productView = new ProductView();

		this.filteredProducts = {};
		this.products = {};

		this.fireBase = new Firebase('https://sizzling-torch-925.firebaseio.com/shopping/products');
	}

	init(params) {
		this.getProducts();
		this.list = params.list;
	}

	updateHandlers(){
		this.addButton = document.getElementById('addButton');
		this.searchInput = <HTMLInputElement>document.getElementById('searchInput')
		this.addButton.addEventListener('click', () => this.addProduct());
		this.searchInput.addEventListener('keyup', 
			(event) => this.addOnEnter(event));
		this.searchInput.addEventListener('keyup', 
			() => this.filterProducts());

		// this.fireBase.on('child_added',
		// 	(childSnapshot, prevChildKey) => this.getProducts());
	}

	getProducts() {
		this.fireBase.on("value", (snapshot) => {
			if (snapshot.val()) {
				this.updateProducts(snapshot.val());
			}
			this.updateView();
		}, function(errorObject) {
			console.log("The read failed: " + errorObject.code);
		});
	}

	getProduct(name) {
		if (this.products[name]) {
			return this.products[name];
		}
	}

	updateProducts(res) {
		var config;

		Object.keys(res).map((id) => {
			config = res[id];
			this.products[id] = new Product(config);
		});
	}

	updateView() {
		this.productView.render(this.products, this.list);
		this.updateHandlers();
	}

	filterProducts() {
		var name = this.searchInput.value;
		var product;
		
		this.filteredProducts = {};
		Object.keys(this.products).map((id) => {
			console.log(this.products, id);
			product = this.products[id];
			if (product.name.indexOf(name) > -1) {
				this.filteredProducts[id] = product;
			}
		});

		this.productView.updateList(this.filteredProducts, this.list);
	}

	addOnEnter(event) {
		if (event.keyCode == 13) {
			this.addProduct();
			return false;
		}
	}

	addProduct() {
		var name = this.searchInput.value;
		var notInFilteredList = 
			Object.keys(this.filteredProducts).length === 0;
		var product;
		
		if (name && notInFilteredList) {
			product = new Product({ name: name });
			product.update();


		}
		this.searchInput.value = '';
	}

	selectProductAmount(param){
		this.productView.showAmount(param);
	}
}

export = ProductViewController;