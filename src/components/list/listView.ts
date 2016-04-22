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
		<h2>in den Korb</h2>
		<div id="toAdd"></div>
		<h2>schon im Korb</h2>
		<div id="alreadyAdded"></div>
		<a href="#/lists/${list.name}/reset">Leeren</a>
		<a class="list-item" href="#/lists/${list.name}/destroy">löschen</a>
		`;

		this.view.innerHTML = this.template;

		this.updateList(list, 'toAdd');
		this.updateList(list, 'alreadyAdded');
	}

	updateList(list:List, type:string){
		var listElement = document.getElementById(type);
		var template;
		var url;


		template = Object.keys(list[type]).map((product) => {
			var selected = list[type][product];
			console.log(selected);
			url = type === 'toAdd' ? `#/lists/${list.name}/addProductToBasket/${product}` : `#/lists/${list.name}/revertProductFromBasket/${product}`;

			return `
				<li><a href="${url}">${product}</a><input type="number" value="${selected.amount}"></li>
			`;
		}).join('');
		
		listElement.innerHTML = template;
	}

}

export = ListView;