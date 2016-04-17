import ProductManager = require('./productManager');
import ProductView = require('./productView');

class ProductViewController {
	searchInput: HTMLInputElement;
	addButton: Element;
	productManager: ProductManager;
	productView: ProductView;
	filteredProducts: {};

	constructor() {
		this.productManager = new ProductManager();
		this.searchInput = <HTMLInputElement>document
			.getElementById('searchInput');
		this.addButton = document.getElementById('addButton');
		this.productView = new ProductView('');
		this.filteredProducts = {};

		this.addButton.addEventListener('click', () => this.addProduct());
		this.searchInput.addEventListener('keyup', (event) => this.addOnEnter(event));
		this.searchInput.addEventListener('keyup', () => this.filterProducts());

		this.productManager.getProducts();
	}

	filterProducts() {
		var name = this.searchInput.value;
		var product;
		
		this.filteredProducts = {};

		Object.keys(this.productManager.products).map((id) => {
			product = this.productManager.products[id];
			if (product.name.indexOf(name) > -1) {
				this.filteredProducts[id] = product;
			}
		});

		this.productView.render(this.filteredProducts)
	}

	addOnEnter(event) {
		if (event.keyCode == 13) {
			this.addProduct();
			return false;
		}
	}

	addProduct() {
		this.addProductToFirebase();
	}

	addProductToListByClick() {

	}

	addProductToListByInput() {

	}

	addProductToFirebase() {
		var name = this.searchInput.value;
		var notInFilteredList = Object.keys(this.filteredProducts).length === 0;
		
		if (name && notInFilteredList) {
			this.productManager.addProduct({ name: name });
		}
		this.searchInput.value = '';
	}
}

export = ProductViewController;