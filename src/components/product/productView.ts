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
				<input id="amountInput" class="grow"type="text" placeholder="Anzahl" />
			</div>
        	<div class="container">
        		<a class="button grow" href="#/" id="addProductButton">Produkt zur Liste</a>
			</div>
        </div>
    	<div class="container">
			<input class="grow" id="searchInput" value="" placeholder="search" type="text">
        </div>
    	<div class="container">
        	<a class="grow button" id="addButton">+ Produkt</a>
        </div>

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
		var addProductButton = document.getElementById('addProductButton');
		var selectAmount = document.getElementById('selectAmount');
		var amountInput = <HTMLInputElement>document.getElementById('amountInput');
		selectAmount.classList.remove('hidden');
		selectAmount.addEventListener('keyup', (event) => this.updateLinkText(addProductButton, params,event))
		amountInput.focus();
	}

	updateLinkText(elem, params, event) {
		var url;
		event.target.value = event.target.value;
		if (event.target.value) {
			url = `#/lists/${params.list}/addProductToList/${params.product}/${event.target.value}`;
			elem.href = url;

			if (event.keyCode === 13) {
				window.location.hash = url;
			}
		}
	}
}

export = ProductView;