import ProductManager = require('./productManager');

class ProductView {
	searchInput: HTMLInputElement;
	addButton: Element;
	productManager: ProductManager;

	constructor() {
		this.productManager = new ProductManager();
		this.searchInput = <HTMLInputElement>document
			.getElementById('searchInput');
		this.addButton = document.getElementById('addButton');

		this.addButton.addEventListener('click', () => this.addProduct());
		this.searchInput.addEventListener('keyup', (event) => this.addOnEnter(event));

		this.productManager.getProducts();
	}

	search() {

	}

	addOnEnter(event) {
		if (event.keyCode == 13) {
			this.addProduct();
			return false;
		}
	}

	addProduct() {
		var productName = this.searchInput.value;
		console.log(this, productName, 'asdasd');
	}

}

export = ProductView;