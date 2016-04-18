///<reference path="../../../definitions/firebase.d.ts" />

class List {

	alreadyAdded: {};
	toAdd: {};
	name: string;
	fireBase: any;

	constructor(config) {
		this.toAdd = config.toAdd || {};
		this.alreadyAdded = config.alreadyAdded || {};
		this.name = config.name.trim();
		this.fireBase = new Firebase('https://sizzling-torch-925.firebaseio.com/shopping/lists/' + config.name.trim());
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