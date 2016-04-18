class Param {
	id: number;
	amount: number;
	list: string;
	product: string;

	constructor(config:any) {
		this.id = config.id || 0;
		this.amount = config.amount || 0;
		this.list = config.list || '';
		this.product = config.product || '';
	}
}

export = Param;