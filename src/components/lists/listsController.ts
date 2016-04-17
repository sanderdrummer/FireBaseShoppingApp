///<reference path="../../../definitions/firebase.d.ts" />

import ListsView = require('./listsView');
import ListController = require('../list/listController');
import List = require('../list/list');

class ListsController {

	lists: {};
	listsView: ListsView;
	listController: ListController;
	fireBase: any;

	constructor() {
		this.lists = {};
		this.listsView = new ListsView();
		this.listController = new ListController();
		this.fireBase = new Firebase('https://sizzling-torch-925.firebaseio.com/shopping/lists');
	}

	init() {
		this.getLists();
	}

	getLists() {
		if (this.fireBase) {
			this.fireBase.on("value", (snapshot) => {
				console.log(snapshot.val());
				if (snapshot) {
					this.updateLists(snapshot.val());
				}
			}, function(errorObject) {
				console.log("The read failed: " + errorObject.code);
			});
		}
	}

	updateLists(res) {
		var config;

		if (res) {
			Object.keys(res).map((name) => {
				config = res[name];
				this.lists[name] = new List(name);
			});
		}
	
		this.listsView.update(this.lists);
		this.updateHandlers();
	}

	updateHandlers() {
		var listInput = document.getElementById('listInput');
		var addListButton = document.getElementById('addListButton');

		addListButton.addEventListener('click', () => this.addList(listInput));
	}

	addList(listInput) {
		var value = listInput.value;
		console.log(value, 'asdkshdf');
		this.listController.addAndShowNewList(value);
		listInput.value = '';
	}

	// selectList(event) {
	// 	var list;
	// 	var selectedElem;
	// 	if (event.target && this.lists[event.target.id]) {
	// 		window.location.hash = '#/lists/' + event.target.id;
	// 	}
	// }
}

export = ListsController;