import Product = require('./product');

class ProductView {
	view: Element;

	constructor() {
		this.view = document.getElementById('products');
	}

	render(products:{}) {

		this.view.innerHTML = `
		<input id="searchInput" value="" placeholder="search" type="text">
        <button id="addButton">Test</button>
        <div id="productsList"></div>
		`;

		this.updateList(products);
	}

	updateList(products: {}) {
		var product;
		var productsElement = document.getElementById('productsList')
		var template = Object.keys(products).map((id) => {
			product = products[id];
			return `<li class="product">
				${product.name}
			</li>`
		}).join('');
		productsElement.innerHTML = template;
	}
}

export = ProductView;