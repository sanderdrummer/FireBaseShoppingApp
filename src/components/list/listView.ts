import List = require('./list');

class ListView {
	template: string;
	view: Element;

	constructor() {
		this.view = document.getElementById('view');
	}

	render(list:List) {
		var product;
		this.template = `
		<h1>${list.name}</h1>
		das ist ein test
		<a href="#/lists/${list.name}/addProducts">+ Produkt</a>
		`;
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