class ListManager {

	lists: {};
	fireBase: any;

	constructor() {
		this.lists = {};
		this.fireBase = new Firebase('https://sizzling-torch-925.firebaseio.com/shopping/lists');
	}

	addList(){

	}

	removeList(){

	}

	getList(){
		
	}
}

export = ListManager;