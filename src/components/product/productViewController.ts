import ProductManager = require('./productManager');
import ProductView = require('./productView');

class ProductViewController {
	searchInput: HTMLInputElement;
	addButton: Element;
	productManager: ProductManager;
	productView: ProductView;


	constructor() {
		this.productManager = new ProductManager();
		this.searchInput = <HTMLInputElement>document
			.getElementById('searchInput');
		this.addButton = document.getElementById('addButton');
		this.productView = new ProductView('');

		this.addButton.addEventListener('click', () => this.addProduct());
		this.searchInput.addEventListener('keyup', (event) => this.addOnEnter(event));
		this.searchInput.addEventListener('keyup', () => this.filterProducts());

		this.productManager.getProducts();
	}

	filterProducts(){
		var name = this.searchInput.value;
		var filteredProducts = {};
		var product;

		Object.keys(this.productManager.products).map((id) => {
			product = this.productManager.products[id];
			if (product.name.indexOf(name) > -1) {
				filteredProducts[id] = product;
			}
		});

		this.productView.render(filteredProducts)
	}

	addOnEnter(event) {
		if (event.keyCode == 13) {
			this.addProduct();
			return false;
		}
	}

	addProduct() {
		var name = this.searchInput.value;
		console.log(this, name, 'asdasd');
		if (name) {
			this.productManager.addProduct({ name: name });
			this.searchInput.value = '';
		}
	}
}

export = ProductViewController;