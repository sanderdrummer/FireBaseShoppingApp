import List = require('./list');

class ListController {

	constructor() {
	}

	addAndShowNewList(name){
		var list = new List(name);
		list.update();
	}
}

export = ListController;