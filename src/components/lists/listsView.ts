class ListsView {

	view: Element;

	constructor(){
		this.view = document.getElementById('view');

	}

	update(lists:{}){
		var list;
		var listsTemplate;
		listsTemplate = Object.keys(lists).map((name) => {
			list = lists[name];
			return `<li class="list" id="${name}">
				${list.name}
			</li>`
		}).join('');

		var template = `
		<input id="listInput" value="" placeholder="neueListe" type="text">
        <button id="addListButton">Test</button>
        <div id="lists">${listsTemplate}<div>
		`;

		this.view.innerHTML = template;
	}
}

export = ListsView;