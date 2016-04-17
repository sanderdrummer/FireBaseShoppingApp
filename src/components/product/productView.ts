import Product = require('./product');

class ProductView {
	template: string;
	view: Element;

	constructor(template:string) {
		this.template = template;
		this.view = document.getElementById('view');
	}

	render(products:{}) {
		var product;

		this.template = `
		<input id="searchInput" value="" placeholder="search" type="text">
        <button id="addButton">Test</button>
		`;

		this.template += Object.keys(products).map((id) => {
			product = products[id];
			return `<li class="product">
				${product.name}
			</li>`
		}).join('');



		this.view.innerHTML = this.template;
	}

}

export = ProductView;