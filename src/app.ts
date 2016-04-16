declare function require(string): string;
///<reference path="../definitions/firebase.d.ts" />

require('../style/main.less');

import DataManager = require('./components/dataManager');
import ProductViewController = require('./components/product/productViewController');

var productViewController = new ProductViewController();
