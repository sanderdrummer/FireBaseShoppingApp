


class Product {
	id: string;
	name: string;
	inBasket: boolean;
	amount: number;
	rating: number;
	fireBase: any;

	constructor(id, config:any) {
		this.id = id || '';
		this.name = config.name || '';
		this.amount = config.amount || 1;
		this.rating = config.rating || 0;
		this.inBasket = config.inBasket || false;
		if (id) {
			this.fireBase = new Firebase('https://sizzling-torch-925.firebaseio.com/shopping/products/' + id);
			
		}
	}
	setAmount(amount:number) {
		this.amount = amount;
	}

	toggleBasket(inBasket:boolean) {
		this.inBasket = inBasket;
	}

	remove() {
		this.fireBase.remove();
	}


}

export = Product;