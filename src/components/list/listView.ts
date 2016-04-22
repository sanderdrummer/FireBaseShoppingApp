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
		<div class="container">
			<a class="button grow" href="#/lists/${list.name}/addProducts">+ Produkt</a>
		</div>
		<h2>noch in den Korb</h2>
		<div id="toAdd"></div>
		<h2>schon dabei</h2>
		<div id="alreadyAdded"></div>
		<div class="container">
			<a class="button grow" href="#/lists/${list.name}/reset">Leeren</a>
		</div>
		<div class="container">
			<a class="button grow" href="#/lists/${list.name}/destroy">löschen</a>
		</div>
		<a 
		<a class="list-item" 
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
				<li class="product"><a href="${url}">${product}</a><input type="text" value="${selected.amount}"></li>
			`;
		}).join('');
		
		listElement.innerHTML = template;
	}

}

export = ListView;