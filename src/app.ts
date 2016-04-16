declare function require(string): string;
require('../style/main.less');

import DataManager = require('./components/dataManager');
import ProductViewController = require('./components/product/productViewController');

console.log(DataManager, ProductViewController);

var productViewController = new ProductViewController();
// productViewController.addProduct({});
