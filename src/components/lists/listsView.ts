class ListsView {

	view: Element;
	products: Element;

	constructor(){
		this.view = document.getElementById('view');
		this.products = document.getElementById('products');

	}

	update(lists:{}){
		var list;
		var listsTemplate;
		
		this.products.innerHTML = '';

		listsTemplate = Object.keys(lists).map((name) => {
			list = lists[name];
			console.log('list', list);
			return `<li class="list">
				<a class="list-item" href="#/lists/${list.name}">${list.name}</a>
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