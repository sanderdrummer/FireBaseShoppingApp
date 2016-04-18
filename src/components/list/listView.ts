import List = require('./list');

class ListView {
	template: string;
	view: Element;
	products: Element;


	constructor() {
		this.view = document.getElementById('view');
		this.products = document.getElementById('products');

	}

	render(list:List) {

		this.products.innerHTML = '';

		this.template = `
		<h1>${list.name}</h1>
		das ist ein test
		<a href="#/lists/${list.name}/addProducts">+ Produkt</a>
		<div id="toAdd"></div>
		<div id="alreadyAdded"></div>
		`;

		this.view.innerHTML = this.template;

		this.updateList(list, 'toAdd');
		this.updateList(list, 'alreadyAdded');
	}

	updateList(list:List, type:string){
		var listElement = document.getElementById(type);
		var template;
		template = Object.keys(list[type]).map((product) => {
			console.log(product);
			return `
				<li>${product}</li>
			`;
		}).join('');
		
		listElement.innerHTML = template;
	}

}

export = ListView;