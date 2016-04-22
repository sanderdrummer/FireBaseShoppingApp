import Product = require('./product');

class ProductView {
	view: Element;

	constructor() {
		this.view = document.getElementById('products');
	}

	render(products: {}, list: string) {

		this.view.innerHTML = `
        <div id="selectAmount" class="hidden">
        	<div class="container">
				<input class="grow"type="text" placeholder="Anzahl" />
			</div>
        	<div class="container">
        		<a class="button grow" href="#/" id="addProductButton">Produkt zur Liste</a>
			</div>
        </div>
		<input id="searchInput" value="" placeholder="search" type="text">
        <button id="addButton">+ Produkt</button>
        
        <div id="productsList"></div>
        
        <div class="container">
			<a class="button grow" href="#/lists/${list}"> Fertig </a>
		</div>
		`;

		this.updateList(products, list);

	}

	updateList(products: {}, list:string) {
		var product;
		var productsElement = document.getElementById('productsList');
		console.log(productsElement );
		var template = Object.keys(products).map((id) => {
			product = products[id];
			return `<li class="product">
				<a href="#/lists/${list}/addProducts/${product.name}">
					${product.name}
				</a>
			</li>`
		}).join('');

		productsElement.innerHTML = template;
	}

	showAmount(params) {

		var selectAmount = <HTMLInputElement>document.getElementById('selectAmount');
		var addProductButton = document.getElementById('addProductButton');
		selectAmount.classList.remove('hidden');
		selectAmount.addEventListener('keyup', (event) => this.updateLinkText(addProductButton, params,event))
	}

	updateLinkText(elem, params, event) {
		event.target.value = event.target.value || 1;
		
		elem.href = `#/lists/${params.list}/addProductToList/${params.product}/${event.target.value}`;
	}
}

export = ProductView;