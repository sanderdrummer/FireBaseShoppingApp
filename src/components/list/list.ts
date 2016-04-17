///<reference path="../../../definitions/firebase.d.ts" />

class List {

	alreadyAdded: {};
	toAdd: {};
	name: string;
	fireBase: any;

	constructor(name) {
		this.toAdd = {};
		this.alreadyAdded = {};
		this.name = name;
		this.fireBase = new Firebase('https://sizzling-torch-925.firebaseio.com/shopping/lists/' + name);
	}

	update() {
		this.fireBase.set({
			toAdd: this.toAdd,
			alreadyAdded: this.alreadyAdded,
			name: this.name
		});
	}
}

export = List;