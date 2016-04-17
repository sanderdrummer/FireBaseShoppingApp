declare function require(string): string;
require('../style/main.less');

import ProductViewController = require('./components/product/productController');
import ListsController = require('./components/lists/listsController');
import ListController = require('./components/list/listController');
import Router = require('./router/router');


// bootstrap the app
var router = new Router();

var productController = new ProductViewController();
var listsController = new ListsController();
var listController = new ListController();

listController.setProductController(productController);

// set routes
if (!window.location.hash) {
    window.location.hash = '#/';
}

router.register('/', (params) => {
	listsController.init();
})
.register('/lists/:list', (params) => {
	console.log(params);
	listController.show(params)
}).register('/lists/:list/destroy', (params) => {
	console.log(params);
	listController.show(params)
}).register('/lists/:list/addProducts', (params) => {
	productController.init(params);
}).register('/lists/:list/addProducts/:product', (params) => {
	listController.addProductToList(params);
});