import List = require('./list');

class ListView {
	template: string;
	view: Element;

	constructor() {
		this.view = document.getElementById('view');
	}

	render(list:List) {
		var product;

		// this.template = Object.keys(products).map((id) => {
		// 	product = products[id];
		// 	return `<li class="product">
		// 		${product.name}
		// 	</li>`
		// }).join('');

		this.view.innerHTML = this.template;
	}

}

export = ListView;