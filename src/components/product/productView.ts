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

		this.template = Object.keys(products).map((id) => {
			product = products[id];
			return `<li>
				${product.name}
			</li>`
		}).join('');

		this.view.innerHTML = this.template;
	}
}

export = ProductView;