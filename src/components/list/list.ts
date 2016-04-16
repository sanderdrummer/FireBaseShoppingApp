class List {

	alreadyAdded: {};
	toAdd: {};
	name: string;

	constructor(name) {
		this.toAdd = {};
		this.alreadyAdded = {};
		this.name = name;
	}
}

export = List;