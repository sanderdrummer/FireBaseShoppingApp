"use strict";
require('../style/main.less');
var ProductViewController = require('./components/product/productController');
var ListsController = require('./components/lists/listsController');
var ListController = require('./components/list/listController');
var Router = require('./router/router');
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
router.register('/', function (params) {
    listsController.init();
})
    .register('/lists/:list', function (params) {
    console.log(params);
    listController.show(params);
}).register('/lists/:list/destroy', function (params) {
    listController.destroy(params);
}).register('/lists/:list/reset', function (params) {
    listController.reset(params);
}).register('/lists/:list/addProducts', function (params) {
    productController.init(params);
}).register('/lists/:list/addProductToBasket/:product', function (params) {
    listController.addProductToBasket(params);
}).register('/lists/:list/revertProductFromBasket/:product', function (params) {
    listController.revertProductFromBasket(params);
}).register('/lists/:list/addProducts/:product', function (params) {
    productController.selectProductAmount(params);
}).register('/lists/:list/addProductToList/:product/:amount', function (params) {
    listController.addProductToList(params);
}).register('/products/destroy/:product', function (params) {
    productController.destroy(params);
});
