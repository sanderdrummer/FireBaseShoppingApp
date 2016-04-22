///<reference path="../../../definitions/firebase.d.ts" />

class Product {
	name: string;
	amount: number;
	rating: number;
	fireBase: any;

	constructor(config:any) {
		this.name = config.name || '';
		this.amount = config.amount || 1;
		this.rating = config.rating || 0;
		this.fireBase = new Firebase('https://sizzling-torch-925.firebaseio.com/shopping/products/' + config.name);
			
	}

	update() {
		this.fireBase.set(this.getData);
	}

	getData() {
		return {
			name: this.name,
			amount: this.amount,
			rating: this.rating
		}
	}

	remove() {
		this.fireBase.remove();
	}

}

export = Product;